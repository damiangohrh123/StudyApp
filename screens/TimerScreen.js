import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { globalStyles } from "../styles/globalStyles";

export default function TimerScreen() {
  const [seconds, setSeconds] = useState(1500);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      clearInterval(interval);
      alert("Time's up!");
    }

    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(1500);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.timer}>{formatTime(seconds)}</Text>
      <Button title={isActive ? "Pause" : "Start"} onPress={toggleTimer} />
      <Button title="Reset" onPress={resetTimer} />
    </View>
  );
}