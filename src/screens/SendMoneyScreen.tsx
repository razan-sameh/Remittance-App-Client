import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { insertTransaction } from '../content/db';
import NetInfo from "@react-native-community/netinfo";
import { serverURL } from '../../App';


export default function SendMoneyScreen() {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const sender = 'user@example.com'; // ثابت مؤقتًا

    const authenticateBiometric = async () => {
        try {
            const credentials = await Keychain.getGenericPassword({
                authenticationPrompt: {
                    title: 'Biometric Authentication',
                    subtitle: 'Confirm transaction',
                },
            });

            return !!credentials;
        } catch (error) {
            return false;
        }
    };

    const handleSend = async () => {
        const isAuthenticated = await authenticateBiometric();
        if (!isAuthenticated) {
            Alert.alert('Authentication Failed');
            return;
        }

        const txData = {
            sender,
            receiver: recipient,
            amount: parseFloat(amount),
            status: 'Created',
            createdAt: new Date().toISOString(),
        };

        try {
            const net = await NetInfo.fetch();
            if (net.isConnected) {
                // Try send to backend
                const res = await fetch(`${serverURL}/api/transactions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...txData, fcmToken: 'mock-token' }),
                });

                if (!res.ok) throw new Error('Failed to send to server');
                Alert.alert('Transaction sent to server');
            } else {
                // Save offline
                await insertTransaction(txData);
                Alert.alert('Offline', 'Transaction saved locally');
            }
        } catch (err) {
            // Network error or server down
            await insertTransaction(txData);
            Alert.alert('Offline fallback', 'Saved locally due to error');
        }

        // Reset form
        setRecipient('');
        setAmount('');
    };

    return (
        <View style={{ padding: 20 }}>
            <Text>Recipient Phone</Text>
            <TextInput
                value={recipient}
                onChangeText={setRecipient}
                style={{ borderWidth: 1, marginBottom: 10 }}
            />

            <Text>Amount</Text>
            <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={{ borderWidth: 1, marginBottom: 10 }}
            />

            <Button title="Send Money" onPress={handleSend} />
        </View>
    );
}
