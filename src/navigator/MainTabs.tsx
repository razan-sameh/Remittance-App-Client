// MainTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SendMoneyScreen from '../screens/SendMoneyScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';


const Tab = createBottomTabNavigator();

export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'Send Money') {
                        iconName = 'cash-outline';
                    } else if (route.name === 'Transactions') {
                        iconName = 'receipt-outline';
                    }

                    return <Ionicons name={iconName!} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#8fbc8f',
                tabBarInactiveTintColor: '#8fbc8f', // adjust if needed
                tabBarLabelStyle: {
                    fontSize: 12,
                },
            })}
        >
            <Tab.Screen name="Send Money" component={SendMoneyScreen} />
            <Tab.Screen name="Transactions" component={TransactionHistoryScreen} />
        </Tab.Navigator>
    );
}
