// db.ts
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

let dbInstance: SQLiteDatabase | null = null;

export const getDBConnection = async (): Promise<SQLiteDatabase> => {
    if (dbInstance) return dbInstance;

    return new Promise((resolve, reject) => {
        const db = SQLite.openDatabase(
            { name: 'remittance.db', location: 'default' },
            () => {
                dbInstance = db;
                resolve(db);
            },
            error => reject(error)
        );
    });
};

export const initDB = async () => {
    const db = await getDBConnection();
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender TEXT,
        receiver TEXT,
        amount REAL,
        status TEXT,
        createdAt TEXT
    );`
        );
    });
};

export const insertTransaction = async (tx: {
    sender: string;
    receiver: string;
    amount: number;
    status: string;
    createdAt: string;
}) => {
    const db = await getDBConnection();
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                'INSERT INTO transactions (sender, receiver, amount, status, createdAt) VALUES (?, ?, ?, ?, ?)',
                [tx.sender, tx.receiver, tx.amount, tx.status, tx.createdAt],
                (_, result) => resolve(result),
                (_, error) => reject(error)
            );
        });
    });
};
