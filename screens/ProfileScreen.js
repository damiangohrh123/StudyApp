import React from "react";
import { View, Text, Button } from "react-native";
import { globalStyles } from "../styles/globalStyles";

export default function ProfileScreen() {
  const user = { name: "John Doe", tasksCompleted: 12, streak: 5 };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Profile</Text>
      <Text style={globalStyles.userName}>Name: {user.name}</Text>
      <Text style={globalStyles.stats}>Completed Tasks: {user.tasksCompleted}</Text>
      <Text style={globalStyles.stats}>Current Streak: {user.streak} days</Text>
      <Button title="Log Out" onPress={() => alert("Log Out")} />
    </View>
  );
}