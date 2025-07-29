// src/screens/VerificationSuccessScreen.tsx

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import callBiometric from '../content/biometric';

export default function VerificationSuccessScreen({ navigation }: any) {
    async function onStart() {
        const success = await callBiometric();
        if (success) {
            navigation.replace("MainTabs");
        }
    }

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/verified.jpg')} // Put your verification image here
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={styles.title}>Account Verified</Text>
            <Text style={styles.subtitle}>Your identity has been successfully verified.</Text>
            <TouchableOpacity style={styles.button} onPress={onStart}>
                <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#4CAF50',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#555',
    },
    button: {
        backgroundColor: '#8fbc8f', // Purple
        padding: 16,
        borderRadius: 12,
        marginTop: 24,
        alignItems: 'center',
        width: 150
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
