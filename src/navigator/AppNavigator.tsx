// AppNavigator.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { Alert, View, Text, StyleSheet } from 'react-native';

import JailMonkey from 'jail-monkey';

import { initDB } from '../content/db';

import KycScreen from '../screens/KycScreen';
import VerificationSuccessScreen from '../screens/VerificationSuccessScreen';
import callBiometric from '../content/biometric';

import { NotificationProvider } from '../provider/NotificationProvider';
import { SyncProvider } from '../provider/SyncProvider';
import SplashScreen from '../screens/SplashScreen';
import MainTabs from './MainTabs';
import { loadEncryptedKyc } from '../content/secureStorage';
import { setKycData } from '../redux/slices/kycSlice';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const [initialRoute, setInitialRoute] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isJailBroken, setIsJailBroken] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const initApp = async () => {
            // Check jailbreak/root status right away
            if (JailMonkey.isJailBroken()) {
                setIsJailBroken(true);
                Alert.alert(
                    'Security Warning',
                    'Your device is jailbroken/rooted, which may compromise security. The app will not run on this device.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                // Optionally: exit app or just block access by not loading app UI
                            },
                        },
                    ],
                    { cancelable: false }
                );
                setLoading(false);
                return;
            }

            await initDB();
            const kyc = await loadEncryptedKyc();

            if (kyc) {
                dispatch(setKycData(kyc));
                const biometricSuccess = await callBiometric();

                if (biometricSuccess) {
                    setInitialRoute('MainTabs');
                } else {
                    Alert.alert('Access Denied', 'Biometric authentication failed.');
                    // You can choose to exit app here or just do nothing to block access
                    setLoading(false);
                    return;
                }
            } else {
                setInitialRoute('KycScreen');
            }

            setLoading(false);
        };

        initApp();
    }, [dispatch]);

    if (loading) return <SplashScreen />;

    if (isJailBroken) {
        // Show a screen blocking access on jailbroken/rooted devices
        return (
            <View style={styles.blockedContainer}>
                <Text style={styles.blockedText}>
                    Security Risk Detected. This app cannot run on jailbroken/rooted devices.
                </Text>
            </View>
        );
    }

    return (
        <NotificationProvider>
            <SyncProvider>
                <NavigationContainer>
                    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute!}>
                        <Stack.Screen name="KycScreen" component={KycScreen} />
                        <Stack.Screen name="VerificationSuccess" component={VerificationSuccessScreen} />
                        <Stack.Screen name="MainTabs" component={MainTabs} />
                    </Stack.Navigator>
                </NavigationContainer>
            </SyncProvider>
        </NotificationProvider>
    );
}

const styles = StyleSheet.create({
    blockedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    blockedText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
        textAlign: 'center',
    },
});
