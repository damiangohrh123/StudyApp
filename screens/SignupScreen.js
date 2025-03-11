import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, Button } from "react-native";
import { useAuth } from "../context/AuthContext";
import { globalStyles } from "../styles/globalStyles";

export default function SignupScreen({ navigation }) {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await register(email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Signup</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={globalStyles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={globalStyles.input}
        />
        <Button title="Signup" onPress={handleSignup} />
        <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />
      </View>
    </SafeAreaView>
  );
}