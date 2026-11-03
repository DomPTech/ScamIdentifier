import { Button, StyleSheet, Text, View } from 'react-native';

const TalkingToThemButton = () => {
    return (
        <View style={styles.card}>
            <Text style={styles.text}>
                Are you talking to them right now?
            </Text>
            <Button 
            title="I'm talking to them now"
            color="#c32323"/>
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
    },
    text: {
        color: '#541c18',
        fontSize: 15,
        padding: 10,
    },
});

export default TalkingToThemButton;