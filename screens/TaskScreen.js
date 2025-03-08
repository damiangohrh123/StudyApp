import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Button } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { useAuth } from "../context/AuthContext";
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { AntDesign } from "@expo/vector-icons"; // For checkmark icon

export default function TaskScreen() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Fetch tasks from Firestore in real-time
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

  // Function to add a new task
  const addTask = async () => {
    if (!newTaskTitle.trim()) {
      alert("Please enter a task title.");
      return;
    }

    try {
      await addDoc(collection(db, "tasks"), {
        userId: user.uid,
        title: newTaskTitle,
        dueDate: dueDate || "No due date",
        completed: false,
      });

      setNewTaskTitle("");
      setDueDate("");
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding task: ", error);
      alert("Failed to add task.");
    }
  };

  // Function to toggle task completion
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
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Tasks</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[globalStyles.taskItem, { flexDirection: "row", alignItems: "center" }]}
            onPress={() => toggleTask(item)}
          >
            {/* Circular Checkmark */}
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: item.completed ? "#6FCF97" : "#BDBDBD",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
            >
              {item.completed && <AntDesign name="check" size={16} color="#6FCF97" />}
            </View>

            {/* Task Text */}
            <Text 
              style={{ 
                fontSize: 18, 
                textDecorationLine: item.completed ? "line-through" : "none",
                color: item.completed ? "#BDBDBD" : "#333"
              }}
            >
              {item.title} 
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Add Task Button */}
      <TouchableOpacity
        style={globalStyles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={globalStyles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Task Creation Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={globalStyles.modalContainer}>
          <View style={globalStyles.modalContent}>
            <Text style={globalStyles.modalTitle}>New Task</Text>

            <TextInput
              style={globalStyles.input}
              placeholder="Task Title"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />

            <TextInput
              style={globalStyles.input}
              placeholder="Due Date (Optional)"
              value={dueDate}
              onChangeText={setDueDate}
            />

            <Button title="Add Task" onPress={addTask} />
            <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}