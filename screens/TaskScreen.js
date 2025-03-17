import React, { useEffect, useState, useRef, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, TouchableOpacity, Modal, ScrollView } from "react-native";
import { TextInput, Button, Switch } from "react-native-paper";
import { format, addDays, isToday, isDate } from "date-fns";
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { Feather } from "@expo/vector-icons";
import { globalStyles, colors, categoryColors } from "../styles/globalStyles";
import InputField from "../components/inputField";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TaskScreen() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  // Create task modal
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerActive, setIsDatePickerActive] = useState(false);


  // Edit task modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState("");
  const [editedCategory, setEditedCategory] = useState("");

  const taskCategories = [
    { name: "Assignment", icon: "edit" },
    { name: "Revision", icon: "book-open" },
    { name: "Practice", icon: "watch" },
  ];
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

  // Add task function
  const addTask = async () => {
    // Input validation
    if (!newTaskTitle.trim()) {
      alert("Please enter a task title.");
      return;
    }
    if (!selectedCategory) {
      alert("Please select a task category.");
      return;
    }
    if (!isRecurring && !dueDate) {
      alert("Please select a due date.");
      return;
    }
    if (isRecurring && recurringDays.length === 0) {
      alert("Please select at least one recurring day.");
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
        category: selectedCategory,
        completed: false,
        expired: false,
      });

      // Close the modal after adding the task
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding task: ", error);
      alert("Failed to add task.");
    }
  };

  // Reset the state of modal after adding task or closing modal 
  useEffect(() => {
    if (!modalVisible && !isDatePickerActive) {
      setNewTaskTitle("");
      setDueDate(null);
      setIsRecurring(false);
      setRecurringDays([]);
      setSelectedCategory("");
    }
  }, [modalVisible, isDatePickerActive]);

  const toggleTask = async (task) => {
    try {
      await updateDoc(doc(db, "tasks", task.id), { completed: !task.completed });
    } catch (error) {
      console.error("Error updating task: ", error);
      alert("Failed to update task.");
    }
  };

  const updateTask = async (taskId) => {
    if (!editedTaskTitle.trim()) {
      alert("Task title cannot be empty.");
      return;
    }

    try {
      await updateDoc(doc(db, "tasks", taskId), {
        title: editedTaskTitle,
        category: editedCategory,
      });

      setEditModalVisible(false);
    } catch (error) {
      console.error("Error updating task: ", error);
      alert("Failed to update task.");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      setEditModalVisible(false);
    } catch (error) {
      console.error("Error deleting task: ", error);
      alert("Failed to delete task.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
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
                onLongPress={() => {
                  setSelectedTask(item);
                  setEditedTaskTitle(item.title);
                  setEditedCategory(item.category);
                  setEditModalVisible(true);
                }}
              >
                {/* Category icon with dynamic color */}
                <View
                  style={[
                    { backgroundColor: categoryColors[item.category]?.backgroundColor },
                    { padding: 10, borderRadius: 50 },
                  ]}
                >
                  <Feather
                    name={
                      item.category === "Assignment" ? "edit" :
                        item.category === "Revision" ? "book-open" : "watch"
                    }
                    size={20}
                    color={categoryColors[item.category]?.iconColor || "#000"}
                  />
                </View>
                <View>
                  <Text style={globalStyles.taskText}>{item.title}</Text>
                  <Text style={globalStyles.taskCategoryText}>{item.category}</Text>
                </View>
                <View style={[globalStyles.taskCheckbox, item.completed && globalStyles.taskCheckboxCompleted]}>
                  {item.completed && <Feather name="check" size={18} color="#FFF" />}
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Add tasks button */}
        <TouchableOpacity style={globalStyles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={globalStyles.addButtonText}>+</Text>
        </TouchableOpacity>

        {/* Add tasks modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={globalStyles.modalContainer}>
            <View style={globalStyles.modalContent}>
              <Text style={globalStyles.modalTitle}>New Task</Text>

              <InputField
                label="Task Title"
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                style={globalStyles.input}
                labelStyle={globalStyles.inputLabel}
                containerStyle={globalStyles.inputContainer}
              />

              {/* Task Category Selection */}
              <View style={globalStyles.categorySelectionContainer}>
                <Text style={globalStyles.inputLabel}>Category</Text>
                <View style={globalStyles.categories}>
                  {taskCategories.map((category) => (
                    <TouchableOpacity
                      key={category.name}
                      onPress={() => setSelectedCategory(category.name)}
                      style={[
                        globalStyles.categoryButton,
                        (selectedCategory === category.name || editedCategory === category.name),
                        {
                          backgroundColor: selectedCategory === category.name || editedCategory === category.name
                            ? categoryColors[category.name]?.backgroundColor
                            : "transparent",
                        },
                      ]}
                    >
                      <Feather
                        name={category.icon}
                        size={20}
                        color={selectedCategory === category.name || editedCategory === category.name ? "#fff" : "#000"} // White icon when selected, black otherwise
                      />
                      <Text
                        style={[
                          globalStyles.categoryButtonText,
                          { color: selectedCategory === category.name || editedCategory === category.name ? "#fff" : "#000" }, // White text when selected, black otherwise
                        ]}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

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

              <TouchableOpacity onPress={() => setIsDatePickerActive(true)}>
                <TextInput
                  label={isRecurring ? "Start Date" : "Due Date"}
                  value={dueDate ? format(dueDate, "yyyy-MM-dd") : "Select Date"}
                  editable={false}
                  style={globalStyles.input}
                />
              </TouchableOpacity>

              {isDatePickerActive && (
                <DateTimePicker
                  value={dueDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setDueDate(selectedDate);
                    }
                    setIsDatePickerActive(false);
                  }}
                />
              )}

              <Button mode="contained" onPress={addTask} style={globalStyles.addButton}>
                Add Task
              </Button>
              <Button mode="outlined" onPress={() => setModalVisible(false)} color="red">
                Cancel
              </Button>
            </View>
          </View>
        </Modal>

        {/* Edit task modal */}
        <Modal visible={editModalVisible} animationType="slide" transparent>
          <View style={globalStyles.modalContainer}>
            <View style={globalStyles.modalContent}>
              <Text style={globalStyles.modalTitle}>Edit Task</Text>

              <TextInput
                label="Task Title"
                value={editedTaskTitle}
                onChangeText={setEditedTaskTitle}
                style={globalStyles.input}
              />

              <Text style={globalStyles.inputLabel}>Task Category</Text>
              <View style={globalStyles.categorySelectionContainer}>
                {taskCategories.map((category) => (
                  <TouchableOpacity
                    key={category.name}
                    onPress={() => setEditedCategory(category.name)}
                    style={[
                      globalStyles.categoryButton,
                      editedCategory === category.name,
                      {
                        backgroundColor:
                          editedCategory === category.name
                            ? categoryColors[category.name]?.backgroundColor || "#f0f0f0"
                            : "transparent",
                      },
                    ]}
                  >
                    <Feather
                      name={category.icon}
                      size={20}
                      color={editedCategory === category.name ? "#fff" : "#000"} // Text color black for unselected
                    />
                    <Text
                      style={[
                        globalStyles.categoryButtonText,
                        {
                          color: editedCategory === category.name ? "#fff" : "#000", // Black text for unselected categories
                        },
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Button
                mode="contained"
                onPress={() => updateTask(selectedTask.id)}
                style={globalStyles.addButton}
              >
                Save Changes
              </Button>

              <Button
                mode="contained"
                onPress={() => deleteTask(selectedTask.id)}
                style={[globalStyles.addButton, { backgroundColor: "red" }]}
              >
                Delete Task
              </Button>

              <Button mode="outlined" onPress={() => setEditModalVisible(false)} color="black">
                Cancel
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}