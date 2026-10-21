import { Button } from 'expo-router/build/react-navigation';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from "react-native";
import { ScamClassifier } from '../models/ScamClassifier';

const keywords: string[] = ["scam", "winning", "money", "prize", "urgent", "click", "link", "bank", "account", "password", "lottery", "transfer", "bitcoin", "crypto"];

function checkForKeywords(input: string): number {
  let numKeywords = 0;
  for (const word of keywords) {
    if (input.toLocaleLowerCase().includes(word)) {
      numKeywords++;
    }
  }
  return numKeywords / keywords.length;
}

export default function Index() {
  const [text, setText] = useState('');
  const [isScam, setIsScam] = useState<boolean | null>(null);
  const [probability, setProbability] = useState<number | null>(null);

  const classifier = useMemo(() => ScamClassifier.fromBundled(), []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check Before You Act</Text>
      <Text style={styles.heading}>
        Paste a message here
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={setText}
        value={text}
        placeholder="Enter message here"
        placeholderTextColor="#555"
        multiline={true}
        numberOfLines={6}
      />
      <Button
        color="#007AFF"
        onPress={() => {
          const result = classifier.predict(text);
          const score = result.score + checkForKeywords(text);
          // Sigmoid function to convert score to probability
          const probability = 1 / (1 + Math.exp(-score));
          setIsScam(probability >= 0.5);
          setProbability(probability);
        }}
      >
        {!text.trim() ? "Your message is empty" : "Check"}
      </Button>
      {isScam !== null && (
        <Text style={isScam ? styles.resultScam : styles.resultSafe}>{
          isScam ? 'This is very likely a scam. Please check with someone you trust.' : 'This may not be a scam, but proceed with caution.'
        }</Text>
      )}
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
    width: 300,
  },
  resultScam: {
    marginTop: 15,
    fontSize: 14,
    color: 'red',
  },
  resultSafe: {
    marginTop: 15,
    fontSize: 14,
    color: 'orange',
  },
  probability: {
    marginTop: 5,
    fontSize: 12,
    color: '#777',
  },
  title: {
    fontSize: 32, 
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
});
