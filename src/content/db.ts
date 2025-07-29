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
                createdAt TEXT,
                synced INTEGER
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
    synced: number;
}) => {
    const db = await getDBConnection();
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                'INSERT INTO transactions (sender, receiver, amount, status, createdAt, synced) VALUES (?, ?, ?, ?, ?, ?)',
                [tx.sender, tx.receiver, tx.amount, tx.status, tx.createdAt, tx.synced],
                (_, result) => resolve(result),
                (_, error) => reject(error)
            );
        });
    });
};


// Get unsynced (offline-created) transactions
export const getUnsyncedTransactions = async (): Promise<any[]> => {
    const db = await getDBConnection();
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM transactions WHERE synced = 0',
                [],
                (_, results) => {
                    const rows = results.rows;
                    let txs = [];
                    for (let i = 0; i < rows.length; i++) {
                        txs.push(rows.item(i));
                    }
                    resolve(txs);
                },
                (_, error) => {
                    reject(error);
                    return false;
                }
            );
        });
    });
};

// Mark a transaction as synced and update its status to 'Completed'
export const markTransactionAsSynced = async (id: number): Promise<void> => {
    const db = await getDBConnection();
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `UPDATE transactions 
                SET status = 'Completed', synced = 1 
                WHERE id = ?`,
                [id],
                () => resolve(),
                (_, error) => {
                    reject(error);
                    return false;
                }
            );
        });
    });
};

// Get all transactions for display (history screen)
export const getAllTransactions = async (): Promise<any[]> => {
    const db = await getDBConnection();
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM transactions ORDER BY createdAt DESC',
                [],
                (_, results) => {
                    const rows = results.rows;
                    const txs = [];
                    for (let i = 0; i < rows.length; i++) {
                        txs.push(rows.item(i));
                    }
                    resolve(txs);
                },
                (_, error) => {
                    reject(error);
                    return false;
                }
            );
        });
    });
};
