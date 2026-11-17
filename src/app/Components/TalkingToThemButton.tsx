import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

interface Props {
    onPress: () => void;
}

const PHONE_WIDTH_BREAKPOINT = 768;

const TalkingToThemButton = ({onPress}: Props) => {
    const { width } = useWindowDimensions();
    const isNarrow = width < PHONE_WIDTH_BREAKPOINT;
    return (
        <View style={[styles.card, isNarrow && styles.cardVertical]}>
            <Text style={styles.text}>
                Are you talking to them right now?
            </Text>
            <Pressable
                style={styles.button}
                onPress={onPress}
            >
                <Text style={styles.buttonText}>I'm talking to them now</Text>
            </Pressable> 
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ebd3d3', 
        flexDirection: 'row',
        padding: 14,
        borderRadius: 20,
        borderLeftWidth: 6,
        borderLeftColor: '#df3c3c',
        columnGap: 50,
        maxWidth: "90%",
    },
    cardVertical: {
        flexDirection: 'column',
        rowGap: 10,
    },
    text: {
        color: '#541c18',
        fontSize: 15,
        padding: 10,
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "#c32323",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontFamily: "Arial",
        fontSize: 15,
        padding: 10,
        fontWeight: "bold",
    }
});

export default TalkingToThemButton;