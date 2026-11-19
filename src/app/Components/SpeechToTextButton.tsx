import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import type { SpeechStatus } from '../../hooks/useSpeechToText';

interface Props {
    status: SpeechStatus;
    style: StyleProp<ViewStyle>;
    textStyle: StyleProp<TextStyle>;
    onStart: () => void;
    onStop: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SpeechToTextButton = ({ status, style, textStyle, onStart, onStop }: Props) => {
    const listening = status === 'listening';
    const [pulse] = useState(() => new Animated.Value(0));

    useEffect(() => {
        if (!listening) {
            pulse.setValue(0);
            return;
        }
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 0, duration: 700, useNativeDriver: true }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, [listening, pulse]);

    const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] });
    const label =
        status === 'preparing'
            ? 'Getting voice ready…'
            : listening
                ? 'Listening… tap when done'
                : 'Speak the Message';
    return (
        <AnimatedPressable
            style={[style, listening && styles.listening, { transform: [{ scale }] }]}
            onPress={listening ? onStop : onStart}
            disabled={status === 'preparing'}
        >
            <Text style={textStyle}>{label}</Text>
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    listening: {
        backgroundColor: '#c32323',
    },
});

export default SpeechToTextButton;
