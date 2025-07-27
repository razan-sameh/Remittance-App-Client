import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import KycScreen from './src/screens/KycScreen';
import SendMoneyScreen from './src/screens/SendMoneyScreen';
import TransactionHistoryScreen from './src/screens/TransactionHistoryScreen';
import { useEffect } from 'react';
import { initDB } from './src/content/db';


const Stack = createNativeStackNavigator();
export const serverURL = 'http://10.0.2.2:3000';
export default function App() {
  useEffect(() => {
    initDB(); // دلوقتي هي async وتشتغل تمام
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="KYC" component={KycScreen} />
        <Stack.Screen name="SendMoney" component={SendMoneyScreen} />
        <Stack.Screen name="Transactions" component={TransactionHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
