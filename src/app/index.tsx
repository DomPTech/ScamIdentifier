import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function Index() {
  const [text, setText] = useState('');

  return (
    <View style={styles.container}>
      <Text>Hello, World.</Text>

      <TextInput style={styles.input} placeholder="Enter message here"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  result: {
    marginTop: 15,
    fontSize: 14,
    color: '#555',
  },
});
