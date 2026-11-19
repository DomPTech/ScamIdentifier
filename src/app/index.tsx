import * as Clipboard from 'expo-clipboard';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";
import { useSpeechToText } from '../hooks/useSpeechToText';
import { ScamClassifier } from '../models/ScamClassifier';
import globalStyles from '../styles';
import SpeechToTextButton from './Components/SpeechToTextButton';
import TalkingToThemButton from './Components/TalkingToThemButton';
import TalkingToThemView from './Components/TalkingToThemView';
import TrustedContactsView from './Components/TrustedContactsView';

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
  const [talkingModalVisible, setTalkingModalVisible] = useState(false);

  const classifier = useMemo(() => ScamClassifier.fromBundled(), []);

  const handleTextChange = useCallback((inputText: string) => {
    setText(inputText);

    if (inputText.trim().length !== 0) {
      const result = classifier.predict(inputText);
      const score = result.score + checkForKeywords(inputText);
      // Sigmoid function to convert score to probability
      const prob = 1 / (1 + Math.exp(-score));
      setIsScam(prob >= 0.5);
      setProbability(prob);
    } else {
      setIsScam(null);
      setProbability(null);
    }
  }, [classifier]);

  const speech = useSpeechToText(handleTextChange);
  const { width } = useWindowDimensions();
  const isNarrow = width < 480;

  const handlePaste = async () => {
    try {
      const copiedText = await Clipboard.getStringAsync();
      if (copiedText && copiedText.trim().length > 0) {
        handleTextChange(copiedText);
      } else {
        Alert.alert('Clipboard Empty', 'No copied text was found on your clipboard to paste.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not read from clipboard.');
    }
  };

  const handleClear = () => {
    handleTextChange('');
  };

  return (
    <ScrollView style={{flex: 1}} contentContainerStyle={globalStyles.container} keyboardShouldPersistTaps="handled">
      <Text style={globalStyles.title}>Check Before You Act</Text>
      <TalkingToThemButton onPress={() => setTalkingModalVisible(true)}/>
    
      <Modal
        visible={contactsModalVisible}
        animationType='fade'
        transparent={true}
        onRequestClose={() => setContactsModalVisible(false)}
      >
        <TrustedContactsView message={text} onClose={() => setContactsModalVisible(false)}/>
      </Modal>

      <Modal
        visible={talkingModalVisible}
        animationType='fade'
        transparent={true}
        onRequestClose={() => setTalkingModalVisible(false)}
      >
        <TalkingToThemView onClose={() => setTalkingModalVisible(false)} />
      </Modal>

      <Text style={[globalStyles.heading, { marginTop: 20, marginLeft: 20, marginRight: 20 }]}>Check a suspicious text, email, social message, phone number, link description, or voicemail summary</Text>

      <View style={[styles.actionRow, isNarrow && styles.actionRowNarrow]}>
        {speech.supported && (
          <SpeechToTextButton
            status={speech.status}
            style={styles.actionButton}
            textStyle={styles.actionButtonText}
            onStart={speech.start}
            onStop={speech.stop}
          />
        )}
        <Pressable style={[styles.actionButton, styles.outlineButton]} onPress={handlePaste}>
          <Text style={[styles.actionButtonText, styles.outlineButtonText]}>Paste Copied Message</Text>
        </Pressable>
      </View>
      {speech.error !== null && (
        <Text style={styles.speechError}>{speech.error}</Text>
      )}

      <TextInput
        style={[globalStyles.input, globalStyles.mainInput]}
        onChangeText={handleTextChange}
        value={text}
        placeholder="Or type message here..."
        placeholderTextColor="#555"
        multiline={true}
        numberOfLines={6}
      />

      {text.length > 0 && (
        <Pressable style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearButtonText}>Clear Message</Text>
        </Pressable>
      )}

      {isScam !== null && (
        <Text style={isScam ? globalStyles.resultScam : globalStyles.resultSafe}>{
          isScam ? 'This is very likely a scam. Please check with someone you trust.' : 'This may not be a scam, but proceed with caution.'
        }</Text>
      )}
      {probability !== null && (
        <View style={{alignItems: 'center', padding: 10}}>
          <Text>
            Confidence: {(probability * 100).toFixed(1)}%
          </Text>

          <Pressable style={globalStyles.contactsButton} onPress={() => setContactsModalVisible(true)}>
            <Text style={globalStyles.contactsButtonText}>Ask Trusted Contacts</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    columnGap: 10,
    width: '100%',
    maxWidth: 520,
    marginTop: 10,
    marginBottom: 10,
  },
  actionRowNarrow: {
    flexDirection: 'column',
    rowGap: 10,
  },
  actionButton: {
    backgroundColor: '#0056b3',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: 64,
    elevation: 3,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  outlineButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#0056b3',
    elevation: 0,
  },
  outlineButtonText: {
    color: '#0056b3',
  },
  clearButton: {
    marginTop: 6,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
  },
  clearButtonText: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '600',
  },
  speechError: {
    color: '#c32323',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
});
