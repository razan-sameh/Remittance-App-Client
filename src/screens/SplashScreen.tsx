// components/SplashScreen.tsx
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

export default function SplashScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Remittance App</Text>
            <ActivityIndicator size="large" color="#007bff" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 'bold',
    },
});
