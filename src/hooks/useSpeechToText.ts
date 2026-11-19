import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

type SpeechRecognitionPackage = typeof import('expo-speech-recognition');

// expo-speech-recognition is isn't available in Expo Go, so we load it lazily!
let speechRecognition: SpeechRecognitionPackage | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  speechRecognition = require('expo-speech-recognition');
} catch {
  speechRecognition = null;
}

const ExpoSpeechRecognitionModule = speechRecognition?.ExpoSpeechRecognitionModule;
const useSpeechRecognitionEvent: SpeechRecognitionPackage['useSpeechRecognitionEvent'] =
  speechRecognition?.useSpeechRecognitionEvent ?? (() => {});

export type SpeechStatus = 'idle' | 'preparing' | 'listening';

export function useSpeechToText(onTranscript: (text: string) => void) {
  const [status, setStatus] = useState<SpeechStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [supported] = useState(
    () => ExpoSpeechRecognitionModule?.isRecognitionAvailable() ?? false
  );

  const finalizedRef = useRef('');
  const stoppedRef = useRef(false);
  const listeningRef = useRef(false);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(onTranscript);

  useEffect(() => {
    callbackRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      listeningRef.current = false;
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      if (listeningRef.current) ExpoSpeechRecognitionModule?.abort();
    };
  }, []);

  useSpeechRecognitionEvent('result', (event) => {
    const interim = event.results[0]?.transcript ?? '';
    const combined = finalizedRef.current
      ? `${finalizedRef.current} ${interim}`
      : interim;
    callbackRef.current(combined);
    if (event.isFinal) {
      finalizedRef.current = combined;
    }
  });

  useSpeechRecognitionEvent('error', (event) => {
    switch (event.error) {
      // Transient or caused by our own stop(); the end handler decides whether to restart or go idle
      case 'aborted':
      case 'busy':
      case 'no-speech':
      case 'speech-timeout':
        return;
      case 'not-allowed':
        stoppedRef.current = true;
        setStatus('idle');
        setError('Microphone access was blocked. Enable it in your browser or device Settings to speak your message.');
        break;
      case 'service-not-allowed':
      case 'language-not-supported':
        stoppedRef.current = true;
        setStatus('idle');
        setError("Voice input isn't available on this device. You can paste or type the message instead.");
        break;
      case 'network':
        stoppedRef.current = true;
        setStatus('idle');
        setError('Voice input needs an internet connection right now. You can paste or type the message instead.');
        break;
      case 'audio-capture':
        stoppedRef.current = true;
        setStatus('idle');
        setError('I could not hear anything. Please check your microphone and try again.');
        break;
      default:
        stoppedRef.current = true;
        setStatus('idle');
        setError('Voice input stopped. Tap the button to try again.');
    }
  });

  useSpeechRecognitionEvent('end', () => {
    if (!ExpoSpeechRecognitionModule) return;
    listeningRef.current = false;
    if (stoppedRef.current) {
      stoppedRef.current = false;
      setStatus('idle');
      return;
    }
    // The engine ended on its own (a pause in speech). Restart so slow speakers are not cut off
    if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    restartTimerRef.current = setTimeout(() => {
      try {
        ExpoSpeechRecognitionModule.start({
          lang: 'en-US',
          interimResults: true,
          continuous: true,
        });
        listeningRef.current = true;
      } catch {
        setStatus('idle');
        setError('Voice input stopped. Tap the button to try again.');
      }
    }, 300);
  });

  const start = useCallback(async () => {
    if (listeningRef.current) return;
    setError(null);
    finalizedRef.current = '';
    stoppedRef.current = false;
    setStatus('preparing');

    if (!ExpoSpeechRecognitionModule || !ExpoSpeechRecognitionModule.isRecognitionAvailable()) {
      setStatus('idle');
      setError("Voice input isn't available on this device. You can paste or type the message instead.");
      return;
    }

    if (Platform.OS !== 'web') {
      const permissions = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!permissions.granted) {
        setStatus('idle');
        setError(
          permissions.canAskAgain
            ? 'Voice input needs microphone access. Please allow it when asked, then try again.'
            : 'Microphone access was blocked. Enable it in Settings to speak your message.'
        );
        return;
      }
    }

    try {
      ExpoSpeechRecognitionModule.start({
        lang: 'en-US',
        interimResults: true,
        continuous: true,
      });
      listeningRef.current = true;
      setStatus('listening');
    } catch {
      setStatus('idle');
      setError('Voice input could not start. Please try again.');
    }
  }, []);

  const stop = useCallback(() => {
    stoppedRef.current = true;
    ExpoSpeechRecognitionModule?.stop();
  }, []);

  return { status, error, supported, start, stop };
}
