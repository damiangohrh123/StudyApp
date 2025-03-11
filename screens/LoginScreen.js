import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, Button } from "react-native";
import { useAuth } from "../context/AuthContext";
import { globalStyles } from "../styles/globalStyles";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Login</Text>
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
        <Button title="Login" onPress={handleLogin} />
        <Button title="Go to Signup" onPress={() => navigation.navigate("Signup")} />
      </View>
    </SafeAreaView>
  );
}