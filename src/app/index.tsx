import { useMemo, useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { ScamClassifier } from '../models/ScamClassifier';
import TalkingToThemButton from './Components/TalkingToThemButton';
import TrustedContactsView from './Components/TrustedContactsView';
import styles from './styles';

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
  const [contactsModalVisible, setContactsModalVisible] = useState(false);

  const classifier = useMemo(() => ScamClassifier.fromBundled(), []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check Before You Act</Text>
      <TalkingToThemButton/>
    
      <Modal
        visible={contactsModalVisible}
        animationType='fade'
        transparent={true}
        onRequestClose={() => setContactsModalVisible(false)}
      >
        <TrustedContactsView message={text} onClose={() => setContactsModalVisible(false)} />
      </Modal>

      <Text style={styles.heading}>
        Paste a message here
      </Text>
      <TextInput
        style={[styles.input, styles.mainInput]}
        onChangeText={ (text) => {
          setText(text);

          const result = classifier.predict(text);
          const score = result.score + checkForKeywords(text);
          // Sigmoid function to convert score to probability
          const probability = 1 / (1 + Math.exp(-score));
          setIsScam(probability >= 0.5);
          setProbability(probability);
        }}
        value={text}
        placeholder="Enter message here"
        placeholderTextColor="#555"
        multiline={true}
        numberOfLines={6}
      />

      {isScam !== null && (
        <Text style={isScam ? styles.resultScam : styles.resultSafe}>{
          isScam ? 'This is very likely a scam. Please check with someone you trust.' : 'This may not be a scam, but proceed with caution.'
        }</Text>
      )}
      {probability !== null && (
        <View style={{alignItems: 'center', padding: 10}}>
          <Text>
            Confidence: {(probability * 100).toFixed(1)}%
          </Text>

          <Pressable style={styles.contactsButton} onPress={() => setContactsModalVisible(true)}>
            <Text style={styles.contactsButtonText}>Ask Trusted Contacts</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
