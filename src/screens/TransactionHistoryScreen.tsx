import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import moment from 'moment';
import { typTransaction } from '../content/type';
import { getAllTransactions } from '../content/db';
import { useFocusEffect } from '@react-navigation/native';

export default function TransactionHistoryScreen() {
    const [transactions, setTransactions] = useState<typTransaction[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTransactions = async () => {
        setLoading(true);
        try {
            const localTxs = await getAllTransactions();
            setTransactions(localTxs);
        } catch (error) {
            console.error('Failed to load local transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadTransactions();
        }, [])
    );

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={{ padding: 20 }}>
            <FlatList
                data={transactions}
                keyExtractor={(item: typTransaction) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ borderBottomWidth: 1, paddingVertical: 10 }}>
                        <Text>To: {item.receiver}</Text>
                        <Text>Amount: ${item.amount}</Text>
                        <Text>Status: {item.status}</Text>
                        <Text>Date: {moment(item.createdAt).format('YYYY-MM-DD HH:mm')}</Text>
                    </View>
                )}
            />
        </View>
    );
}
