// src/providers/NotificationProvider.tsx
import React, { useEffect } from 'react';
import { requestUserPermission, listenToForegroundMessages } from '../content/notification';
import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDMPW3KX0UWWcl1p49E3lWbjEmca0t_rRk",
    authDomain: "remittance-app-3ec4a.firebaseapp.com",
    projectId: "remittance-app-3ec4a",
    storageBucket: "remittance-app-3ec4a.appspot.com", // fixed here
    messagingSenderId: "917962898437",
    appId: "1:917962898437:web:4c7d48fc9c4f48a31af06c",
    measurementId: "G-YSKGBLBGKD"
};

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    if (!getApps().length) {
        initializeApp(firebaseConfig);
    }

    useEffect(() => {
        const setupNotifications = async () => {
            await requestUserPermission();

            const unsubscribe = listenToForegroundMessages((message) => {
                console.log('🚀 Message received in NotificationProvider:', message);
                // Optionally: show Toast or custom UI
            });

            // Return cleanup function
            return unsubscribe;
        };

        let unsubscribeFn: (() => void) | undefined;
        setupNotifications().then(fn => {
            unsubscribeFn = fn;
        });

        return () => {
            if (unsubscribeFn) {
                unsubscribeFn();
            }
        };
    }, []);

    return <>{children}</>;
};
