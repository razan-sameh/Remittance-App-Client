import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import NetInfo from '@react-native-community/netinfo';
import { serverURL } from '../../App';
import { enmTransactionStatus } from '../content/enum';
import { verifyBiometric } from '../content/biometric';
import { typKYC } from '../content/type';
import { insertTransaction } from '../content/db';
import { getToken, getMessaging } from '@react-native-firebase/messaging';
import { loadEncryptedKyc } from '../content/secureStorage';

type FormData = {
    amount: string;
    recipient: string;
};

const SendMoneyScreen = () => {
    const { control, handleSubmit, reset } = useForm<FormData>();
    const [loading, setLoading] = useState(false);
    const [sender, setSender] = useState<typKYC>();

    useEffect(() => {
        const loadKycData = async () => {
            const storedData = await loadEncryptedKyc();
            if (storedData) {
                setSender(storedData); // sets fullName, phone, etc.
            }
        };
        loadKycData();
    }, []);


    // Simulate a Cybrid API rate fetch
    const getMockRate = async (): Promise<number> => {
        // Simulate delay and return fixed exchange rate (e.g., USD → SLL = 20)
        return new Promise((resolve) => {
            setTimeout(() => resolve(20.0), 500); // 500ms delay
        });
    };

    const onSubmit = async (data: FormData) => {
        setLoading(true);

        const verified = await verifyBiometric();
        if (!verified) {
            setLoading(false);
            Alert.alert('Authentication Failed', 'Biometric authentication is required to send money.');
            return;
        }

        await getMockRate();

        const txData = {
            sender: sender?.phone || '',
            receiver: data.recipient,
            amount: parseFloat(data.amount),
            status: enmTransactionStatus.Created,
            createdAt: new Date().toISOString(),
            synced: 0,
        };

        try {
            const net = await NetInfo.fetch();
            const isConnected = net.isConnected;

            if (isConnected) {
                const messaging = getMessaging();
                const fcmToken = await getToken(messaging);

                const res = await fetch(`${serverURL}/api/transactions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...txData, fcmToken }),
                });

                if (!res.ok) throw new Error('Server error');

                
                Alert.alert('Success', 'Transaction sent successfully.');
                // ✅ Store as synced & completed locally (optional)
                await insertTransaction({
                    ...txData,
                    status: enmTransactionStatus.Completed,
                    synced: 1,
                });
            } else {
                // ⛔ Offline — store as unsynced
                await insertTransaction({
                    ...txData,
                    synced: 0,
                });

                Alert.alert('Offline', 'Transaction saved locally.');
            }
        } catch (err) {
            console.error(err);

            await insertTransaction({
                ...txData,
                synced: 0,
            });

            Alert.alert('Error', 'Transaction saved locally due to a network/server issue.');
        }

        setLoading(false);
        reset();
    };



    return (
        <ScrollView contentContainerStyle={styles.container}>

            <Text style={styles.label}>Recipient Phone</Text>
            <Controller
                control={control}
                name="recipient"
                rules={{
                    required: 'Recipient phone is required',
                    pattern: {
                        value: /^\+?[1-9]\d{1,14}$/,
                        message: 'Invalid international phone number',
                    },
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <>
                        <TextInput
                            style={styles.input}
                            keyboardType="phone-pad"
                            value={value}
                            onChangeText={onChange}
                            placeholder="+201234567890"
                        />
                        {error && <Text style={styles.error}>{error.message}</Text>}
                    </>
                )}
            />

            <Text style={styles.label}>Amount</Text>
            <Controller
                control={control}
                name="amount"
                rules={{
                    required: 'Amount is required',
                    pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: 'Enter a valid amount',
                    },
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={value}
                            onChangeText={onChange}
                            placeholder="Enter amount"
                        />
                        {error && <Text style={styles.error}>{error.message}</Text>}
                    </>
                )}
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.disabledButton]}
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Sending...' : 'Send Money'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default SendMoneyScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#8fbc8f',
        textAlign: 'center',
        marginBottom: 24,
    },
    label: {
        fontWeight: 'bold',
        marginTop: 12,
        fontSize: 16,
        color: '#333',
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 10,
        marginTop: 8,
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
    button: {
        backgroundColor: '#8fbc8f',
        padding: 16,
        borderRadius: 12,
        marginTop: 24,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.7,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
