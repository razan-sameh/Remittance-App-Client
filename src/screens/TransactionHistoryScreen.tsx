import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { typTransaction } from '../content/type';
import { serverURL } from '../../App';

export default function TransactionHistoryScreen() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${serverURL}/api/transactions`) // change to your local IP on a real device
            .then((res) => res.json())
            .then((data) => setTransactions(data))
            .catch((error) => console.error("Failed to fetch transactions:", error))
            .finally(() => setLoading(false));
    }, []);

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
                keyExtractor={(item : typTransaction) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ borderBottomWidth: 1, paddingVertical: 10 }}>
                        <Text>To: {item.receiver}</Text>
                        <Text>Amount: ${item.amount}</Text>
                        <Text>Status: {item.status}</Text>
                    </View>
                )}
            />
        </View>
    );
}
