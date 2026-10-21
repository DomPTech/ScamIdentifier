import { Button } from 'expo-router/build/react-navigation';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from "react-native";

const keywords: string[] = ["scam", "win", "won", "money", "claim", "redeem"];

function checkForKeywords(input: string): boolean {
  for (const word of keywords) {
    if (input.toLocaleLowerCase().includes(word)) {
      return true;
    }
  }
  return false;
}

export default function Index() {
  const [text, setText] = useState('');
  const [isScam, setIsScam] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Check a Message
      </Text>
      <TextInput style={styles.input} onChangeText={setText} value={text} placeholder="Enter message here" placeholderTextColor="#555"/>
      <Button
        color="#c32323"
        onPress={() => {
          setIsScam(checkForKeywords(text));
        }}>Review Risk</Button>
      <Text>{isScam ? 'SCAM DETECTED: This is most likely a scam. Do not respond and do not send money or personal information.' : 'No scam detected. However, always be cautious and do not send money or personal information to people you do not know.'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    marginBottom: 20,
    fontSize: 18,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 5,
  },
  result: {
    marginTop: 15,
    fontSize: 14,
    color: '#555',
  },
});
