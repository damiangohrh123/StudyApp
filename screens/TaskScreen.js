import React, { useEffect, useState, useRef, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, TouchableOpacity, Modal, ScrollView } from "react-native";
import { TextInput, Button, Switch } from "react-native-paper";
import { DatePickerModal, registerTranslation } from "react-native-paper-dates";
import { format, addDays, isToday } from "date-fns";
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { Feather } from "@expo/vector-icons";
import { globalStyles } from "../styles/globalStyles";

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

  // Auto-scroll to today's date for the horizontal scroll
  const scrollRef = useRef(null);
  useFocusEffect(
    useCallback(() => {
      const today = new Date();
      setSelectedDate(today); // Auto-select today when screen is focused

      if (scrollRef.current) {
        const todayIndex = generateDateRange().findIndex((date) => isToday(date));
        if (todayIndex !== -1) {
          const itemWidth = 50 + 8; // Width + marginRight
          const scrollToX = (todayIndex * itemWidth) - (itemWidth * 2.9); // Scroll to today
          scrollRef.current.scrollTo({ x: scrollToX, animated: true });
        }
      }
    }, [])
  );

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "tasks"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(taskList);
    });

    return () => unsubscribe();
  }, [user]);

  const generateDateRange = () => {
    return Array.from({ length: 21 }, (_, i) => addDays(new Date(), i - 10));
  };

  const filteredTasks = tasks.filter((task) => {
    const taskDate = task.dueDate ? task.dueDate.toDate() : null;
    const selectedDay = format(selectedDate, "EEEE");

    if (task.isRecurring && task.recurringDays.includes(selectedDay)) {
      const startDate = task.startDate ? task.startDate.toDate() : null;
      return startDate ? selectedDate >= startDate : true;
    }

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
        dueDate: isRecurring ? null : dueDate || null,
        startDate: isRecurring ? new Date() : null,
        isRecurring,
        recurringDays: isRecurring ? recurringDays : [],
        completed: false,
        expired: false,
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
      await updateDoc(doc(db, "tasks", task.id), { completed: !task.completed });
    } catch (error) {
      console.error("Error updating task: ", error);
      alert("Failed to update task.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>
          {isToday(selectedDate) ? "Today" : format(selectedDate, "MMMM dd, yyyy")}
        </Text>

        {/* Horizontal scroll for date ranges*/}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={scrollRef}>
          {generateDateRange().map((date, index) => (
            <TouchableOpacity
              key={date.toDateString()}
              onPress={() => setSelectedDate(date)}
              style={[
                globalStyles.dateButton,
                selectedDate.toDateString() === date.toDateString() && globalStyles.selectedDateButton,
              ]}
            >
              <Text style={[globalStyles.dayText, selectedDate.toDateString() === date.toDateString() && globalStyles.selectedDateText]}>
                {format(date, "EEE")} {/* Shows "Mon", "Tue", etc. */}
              </Text>
              <Text style={[globalStyles.dateText, selectedDate.toDateString() === date.toDateString() && globalStyles.selectedDateText]}>
                {format(date, "dd")} {/* Shows "05", "06", etc. */}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tasks list */}
        <View style={globalStyles.tasksContainer}>
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={globalStyles.taskItem}
                onPress={() => toggleTask(item)}
              >
                <Text style={[globalStyles.taskText, item.completed && globalStyles.taskTextCompleted]}>
                  {item.title}
                </Text>
                <View style={[globalStyles.taskCheckbox, item.completed && globalStyles.taskCheckboxCompleted]}>
                  {item.completed && <Feather name="check" size={18} color="#FFF" />}
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        <TouchableOpacity style={globalStyles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={globalStyles.addButtonText}>+</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={globalStyles.modalContainer}>
            <View style={globalStyles.modalContent}>
              <Text style={globalStyles.modalTitle}>New Task</Text>

              <TextInput label="Task Title" value={newTaskTitle} onChangeText={setNewTaskTitle} style={globalStyles.input} />

              <View style={globalStyles.switchContainer}>
                <Text>Recurring Task</Text>
                <Switch value={isRecurring} onValueChange={setIsRecurring} />
              </View>

              {isRecurring && (
                <View>
                  <Text>Select Recurring Days:</Text>
                  <View style={globalStyles.recurringDaysContainer}>
                    {daysOfWeek.map((day) => (
                      <TouchableOpacity
                        key={day}
                        onPress={() => {
                          setRecurringDays((prev) =>
                            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
                          );
                        }}
                        style={[
                          globalStyles.dayButton,
                          recurringDays.includes(day) && globalStyles.selectedDayButton,
                        ]}
                      >
                        <Text style={globalStyles.dayButtonText}>{day}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
                <TextInput
                  label={isRecurring ? "Start Date" : "Due Date"}
                  value={dueDate ? format(dueDate, "yyyy-MM-dd") : "Select Date"}
                  editable={false}
                  style={globalStyles.input}
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

              <Button mode="contained" onPress={addTask} style={globalStyles.addButton}>
                Add Task
              </Button>
              <Button mode="outlined" onPress={() => setModalVisible(false)} color="red">
                Cancel
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}