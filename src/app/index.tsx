import { Button } from 'expo-router/build/react-navigation';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from "react-native";
import { ScamClassifier } from '../models/ScamClassifier';

// const keywords: string[] = ["scam", "winning", "money"];

// function checkForKeywords(input: string): boolean {
//   for (const word of keywords) {
//     if (input.toLocaleLowerCase().includes(word)) {
//       return true;
//     }
//   }
//   return false;
// }

export default function Index() {
  const [text, setText] = useState('');
  const [isScam, setIsScam] = useState<boolean>(false);
  const [probability, setProbability] = useState<number | null>(null);

  const classifier = useMemo(() => ScamClassifier.fromBundled(), []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Check a Message
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={setText}
        value={text}
        placeholder="Enter message here"
        placeholderTextColor="#555"
      />
      <Button
        color="#007AFF"
        onPress={() => {
          const result = classifier.predict(text);
          setIsScam(result.isScam);
          setProbability(result.probability);
        }}
      >
        Submit
      </Button>
      <Text style={styles.result}>Is Scam?: {isScam ? 'True' : 'False'}</Text>
      {probability !== null && (
        <Text style={styles.probability}>
          Confidence: {(probability * 100).toFixed(1)}%
        </Text>
      )}
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
  probability: {
    marginTop: 5,
    fontSize: 12,
    color: '#777',
  },
});
