import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, ScrollView } from "react-native";
import { TextInput, Button, Switch } from "react-native-paper";
import { DatePickerModal, registerTranslation } from "react-native-paper-dates";
import { format, addDays, subDays, isToday } from "date-fns";
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { AntDesign } from "@expo/vector-icons"; // Checkmark icon

// Register the English locale for date picker
registerTranslation('en', {
  save: 'Save',
  selectSingle: 'Select a date',
  close: 'Close',
  previous: 'Previous',
  next: 'Next',
  typeInDate: 'Type in date',
});

export default function TaskScreen() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState([]);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    if (!user) return;

    // Query tasks by userId
    const q = query(collection(db, "tasks"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Check for expired tasks
      const updatedTasks = taskList.map((task) => {
        const currentDate = new Date();
        const taskDueDate = task.dueDate ? task.dueDate.toDate() : null;

        if (taskDueDate && taskDueDate < currentDate && !task.completed) {
          // Mark as expired or completed if due date has passed
          return { ...task, expired: true }; // Optional: add expired field or update status
        }
        return task;
      });

      setTasks(updatedTasks);
    });

    return () => unsubscribe();
  }, [user]);

  // Function to generate the range of dates
  const generateDateRange = () => {
    const dates = [];
    for (let i = -10; i <= 10; i++) {
      dates.push(addDays(new Date(), i)); // Add 10 days before and 10 days after today
    }
    return dates;
  };

  // Handle task filtering based on selected date
  const filteredTasks = tasks.filter((task) => {
    const taskDate = task.dueDate ? task.dueDate.toDate() : null;
    return taskDate && taskDate.toDateString() === selectedDate.toDateString();
  });

  const addTask = async () => {
    if (!newTaskTitle.trim()) {
      alert("Please enter a task title.");
      return;
    }

    try {
      await addDoc(collection(db, "tasks"), {
        userId: user.uid,
        title: newTaskTitle,
        dueDate: isRecurring ? null : dueDate ? dueDate : null, // Storing as Timestamp if available
        isRecurring,
        recurringDays: isRecurring ? recurringDays : [],
        completed: false,
        expired: false, // Initially not expired
      });

      setNewTaskTitle("");
      setDueDate(null);
      setIsRecurring(false);
      setRecurringDays([]);
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding task: ", error);
      alert("Failed to add task.");
    }
  };

  const toggleTask = async (task) => {
    try {
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, { completed: !task.completed });
    } catch (error) {
      console.error("Error updating task: ", error);
      alert("Failed to update task.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        {isToday(selectedDate) ? "Today" : format(selectedDate, "MMMM dd, yyyy")}
      </Text>

      {/* Scrollable date range */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        {generateDateRange().map((date) => (
          <TouchableOpacity
            key={date.toDateString()}
            onPress={() => setSelectedDate(date)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 5,
              backgroundColor: selectedDate.toDateString() === date.toDateString() ? "#6FCF97" : "#f0f0f0",
              marginRight: 10,
            }}
          >
            <Text style={{ fontSize: 16, color: selectedDate.toDateString() === date.toDateString() ? "white" : "#333" }}>
              {format(date, "MMM dd")}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Task list */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", padding: 10, borderBottomWidth: 1, borderColor: "#ddd" }}
            onPress={() => toggleTask(item)}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: item.completed || item.expired ? "#BDBDBD" : "#6FCF97", // Adjust color based on task status
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
            >
              {item.completed && <AntDesign name="check" size={16} color="#6FCF97" />}
              {item.expired && !item.completed && (
                <AntDesign name="clockcircleo" size={16} color="#BDBDBD" /> // Add icon for expired tasks
              )}
            </View>

            <View>
              <Text
                style={{
                  fontSize: 18,
                  textDecorationLine: item.completed || item.expired ? "line-through" : "none",
                  color: item.completed || item.expired ? "#BDBDBD" : "#333",
                }}
              >
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Add Task Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#007BFF",
          borderRadius: 50,
          padding: 15,
          position: "absolute",
          bottom: 20,
          right: 20,
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: "white", fontSize: 24, textAlign: "center" }}>+</Text>
      </TouchableOpacity>

      {/* Task Creation Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ width: "90%", padding: 20, backgroundColor: "white", borderRadius: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>New Task</Text>

            <TextInput
              label="Task Title"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              style={{ marginBottom: 10 }}
            />

            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
              <Text style={{ fontSize: 16 }}>Recurring Task</Text>
              <Switch value={isRecurring} onValueChange={setIsRecurring} />
            </View>

            <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
              <TextInput
                label="Due Date"
                value={dueDate ? format(dueDate, "yyyy-MM-dd") : "Select Date"}
                editable={false}
                style={{ marginBottom: 10 }}
              />
            </TouchableOpacity>

            <DatePickerModal
              locale="en"
              mode="single"
              visible={datePickerVisible}
              onDismiss={() => setDatePickerVisible(false)}
              date={dueDate}
              onConfirm={(params) => {
                setDueDate(params.date);
                setDatePickerVisible(false);
              }}
            />

            <Button mode="contained" onPress={addTask} style={{ marginBottom: 10 }}>
              Add Task
            </Button>
            <Button mode="outlined" onPress={() => setModalVisible(false)} color="red">
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}