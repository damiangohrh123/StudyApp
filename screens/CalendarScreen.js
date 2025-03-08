import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { globalStyles } from "../styles/globalStyles";

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Calendar</Text>
      <View style={styles.calendar}>
        <TouchableOpacity onPress={() => handleDateSelect("2025-03-10")}>
          <Text style={globalStyles.stats}>March 10, 2025</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDateSelect("2025-03-11")}>
          <Text style={globalStyles.stats}>March 11, 2025</Text>
        </TouchableOpacity>
      </View>
      {selectedDate && (
        <Text style={globalStyles.stats}>Selected Date: {selectedDate}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    marginBottom: 20,
  },
});