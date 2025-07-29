import React, { useEffect, createContext, useContext } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { getMessaging, getToken } from '@react-native-firebase/messaging';
import { serverURL } from '../../App';
import { getUnsyncedTransactions, markTransactionAsSynced } from '../content/db';

const syncOfflineTransactions = async () => {
    try {
        const pending = await getUnsyncedTransactions(); // unsynced transactions
        if (!pending.length) return;

        const messaging = getMessaging();
        const fcmToken = await getToken(messaging);

        for (const tx of pending) {
            const res = await fetch(`${serverURL}/api/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...tx, fcmToken }),
            });

            if (res.ok) {
                await markTransactionAsSynced(tx.id); // remove or update status
            }
        }
    } catch (err) {
        console.error('❌ Sync failed:', err);
    }
};

const SyncContext = createContext({});

export const SyncProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            if (state.isConnected) {
                syncOfflineTransactions(); // call your logic here
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <SyncContext.Provider value={{}}>
            {children}
        </SyncContext.Provider>
    );
};

// Optional: Export hook if you plan to expose sync state/functions
export const useSync = () => useContext(SyncContext);
