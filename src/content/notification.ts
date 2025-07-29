// content/notification.ts

import { Alert, PermissionsAndroid, Platform } from 'react-native';
import {
    getMessaging,
    requestPermission,
    getToken,
    onMessage,
    AuthorizationStatus,
} from '@react-native-firebase/messaging';

const messaging = getMessaging();

export const requestUserPermission = async (): Promise<string | null> => {
    try {
        if (Platform.OS === 'ios') {
            const authStatus = await messaging.requestPermission();
            const enabled =
                authStatus === 1 || // AUTHORIZED
                authStatus === 2;  // PROVISIONAL

            if (!enabled) {
                console.warn('🚫 Notification permission not granted (iOS).');
                return null;
            }
        }

        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                {
                    title: 'Notification Permission',
                    message: 'This app needs access to send you notifications.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );

            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                console.warn('🚫 Notification permission not granted (Android).');
                return null;
            }
        }

        const token = await getToken(messaging);
        console.log('✅ FCM Token:', token);
        return token;
    } catch (err) {
        console.error('🔥 Error requesting notification permission:', err);
        return null;
    }
};
export const listenToForegroundMessages = (
    onMessageCallback: (msg: any) => void
): (() => void) => {
    if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
        console.warn('🚫 Firebase messaging not supported on this platform.');
        return () => { };
    }

    const unsubscribe = onMessage(messaging, async remoteMessage => {
        onMessageCallback(remoteMessage);
        Alert.alert(
            remoteMessage.notification?.title ?? 'Notification',
            remoteMessage.notification?.body ?? ''
        );
    });

    return unsubscribe;
};
