import { Pressable, StyleSheet, Text, View } from 'react-native';
import globalStyles from '../../styles';

interface Props {
    onClose: () => void;
}

export default function TalkingToThemView({onClose}: Props) {
    return (
        <View style={globalStyles.overlay}>
            <View style={globalStyles.sheet}>
                <View style={{padding: 25}}>
                    <Text style={{fontSize: 12, fontFamily: 'arial', color: '#c32323', fontWeight: 'bold'}} >LIVE CALL SAFETY</Text>
                    <Text style={styles.header}>Pause the conversation now.</Text>
                    <View>
                        <Text style={{color: '#c32323', fontWeight: 'bold', marginLeft: 12}}>Do not send money, share a code, install software, allow remote access, or agree to meet anyone.</Text>
                    </View>
                    <View style={{padding: 15}}>
                        <Text style={styles.mainText}>End the call or stop replying.</Text>
                        <Text style={styles.mainText}>Do not click links or call numbers they supplied.</Text>
                        <Text style={styles.mainText}>Contact the organization using a number you independently verify.</Text>
                        <Text style={styles.mainText}>Tell someone you trust before taking any action.</Text>
                        <Text style={styles.mainText}>If someone is coming to your home or you feel threatened, call 911.</Text>
                    </View>
                    <Pressable style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>I have stopped the conversation</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 45,
        fontFamily: 'Times New Roman',
        color: '#0a112a',
        padding: 10,
    },
    button: {
        backgroundColor: "#0f1b4a",
        borderRadius: 10,
        width: 260,
        padding: 4,
    },
    buttonText: {
        color: "white",
        fontFamily: "Arial",
        fontWeight: "bold",
        fontSize: 15,
        padding: 10,
    },
    mainText: {
        fontSize: 18,
        fontFamily: "Arial",
        color: '#434861',
        padding: 10,
    }
})
