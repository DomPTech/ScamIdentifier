import { Button } from 'expo-router/build/react-navigation';
import { useMemo, useState } from 'react';
import { Text, TextInput, View } from "react-native";
import { ScamClassifier } from '../models/ScamClassifier';
import styles from './styles';
import TalkingToThemButton from './Components/TalkingToThemButton';

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
      <TalkingToThemButton/>
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
        color="#c32323"
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
