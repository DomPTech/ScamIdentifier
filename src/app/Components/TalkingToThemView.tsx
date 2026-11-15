import { Pressable, StyleSheet, Text, View } from 'react-native';
import styles from '../styles';

interface Props {
    onClose: () => void;
}

export default function TalkingToThemView({onClose}: Props) {
    return (
        <View style={styles.overlay}>
            <View style={styles.sheet}>
                <Pressable style={styles.contactsButton} onPress={onClose}>
                    <Text style={styles.contactsButtonText}>Close</Text>
                </Pressable>
            </View>
        </View>
    );
}