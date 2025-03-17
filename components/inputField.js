import React, { useState, useRef } from 'react';
import { TextInput, View, Text, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';

const InputField = ({ label, value, onChangeText }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef(null);
  const labelY = useRef(new Animated.Value(0)).current;

  // Handle focus and blur
  const handleFocus = () => {
    setIsFocused(true);
    // Animate label to move up when focused
    Animated.timing(labelY, {
      toValue: -20, // Move the label up
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Animate label back to center when blurred
    if (value.trim() === '') {
      Animated.timing(labelY, {
        toValue: 0, // Move the label back to the center only if there is no value
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  // Update value and check if the input field has any content
  const handleChangeText = (text) => {
    onChangeText(text);
    setHasValue(text.trim().length > 0);
  };

  // Focus the TextInput when the view is clicked
  const handlePress = () => {
    inputRef.current.focus();
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.touchableArea}>
          <Animated.Text
            style={[
              styles.label,
              (isFocused || hasValue) ? styles.focusedLabel : null,  // Apply focusedLabel if focused or has value
              { transform: [{ translateY: labelY }] }, // Apply animated Y position
            ]}
          >
            {label}
          </Animated.Text>
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={[
              styles.input,
              (isFocused || hasValue) ? styles.focusedInput : null, // Apply focusedInput if focused or has value
            ]}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  touchableArea: {
    position: 'relative', // Allow label positioning within the view
  },
  label: {
    position: 'absolute',
    paddingHorizontal: 8,
    fontSize: 16,
    left: 10,
    top: '25%', // Vertically center the label
    color: colors.gray,
    backgroundColor: colors.background,
    zIndex: 1,
  },
  focusedLabel: {
    fontSize: 12,
    color: colors.primary,
  },
  input: {
    paddingVertical: 0,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 5,
    fontSize: 16,
    height: 45,
  },
  focusedInput: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
});

export default InputField;
