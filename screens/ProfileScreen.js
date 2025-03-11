import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Button } from "react-native";
import { globalStyles } from "../styles/globalStyles";

export default function ProfileScreen() {
  const user = { name: "John Doe", tasksCompleted: 12, streak: 5 };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Profile</Text>
        <Text style={globalStyles.userName}>Name: {user.name}</Text>
        <Text style={globalStyles.stats}>Completed Tasks: {user.tasksCompleted}</Text>
        <Text style={globalStyles.stats}>Current Streak: {user.streak} days</Text>
        <Button title="Log Out" onPress={() => alert("Log Out")} />
      </View>
    </SafeAreaView>
  );
}