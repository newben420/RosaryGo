import * as SQLite from 'expo-sqlite';
import { Site } from '../site';
import { Log } from './log';
import { Session } from './model/session';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from './storageKeys';

export const db = SQLite.openDatabaseSync(Site.DB_NAME);

export const dbSetUp = () => new Promise<boolean>((resolve, reject) => {
    db.withExclusiveTransactionAsync(async (txn) => {
        // await txn.execAsync(`DROP TABLE model;`);
        await txn.execAsync(`CREATE TABLE IF NOT EXISTS session (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, is_dm INTEGER NOT NULL, start TEXT NOT NULL, stop TEXT, intention TEXT);`);
    }).then(r => {
        resolve(true);
    }).catch(err => {
        Log.dev(err);
        resolve(false);
    });
});

export const getSessions = (limit: number = 0) => {
    return new Promise<Session[]>(async (resolve, reject) => {
        db.getAllAsync(`SELECT * FROM session ORDER BY id DESC ${limit ? `LIMIT ${limit}` : ''};`).then(r => {
            resolve((r as any).map((row: any) => ({
                ...row,
                is_dm: row.is_dm == 1,
                start: parseInt(row.start),
                stop: parseInt(row.stop) || null,
                intention: row.intention || null,
            })) as Session[]);
        }).catch(err => {
            Log.dev(err);
            resolve([]);
        });
    });
}

export const getHistory = () => {
    return new Promise<Session[]>(async (resolve, reject) => {
        db.getAllAsync(`SELECT * FROM session WHERE stop IS NOT NULL ORDER BY id DESC;`).then(r => {
            resolve((r as any).map((row: any) => ({
                ...row,
                is_dm: row.is_dm == 1,
                start: parseInt(row.start),
                stop: parseInt(row.stop) || null,
                intention: row.intention || null,
            })) as Session[]);
        }).catch(err => {
            Log.dev(err);
            resolve([]);
        });
    });
}

export const clearUnfinishedSessions = () => {
    return new Promise<boolean>(async (resolve, reject) => {
        db.runAsync(`DELETE FROM session WHERE stop IS NULL;`).then(r => {
            resolve(true);
        }).catch(err => {
            Log.dev(err);
            resolve(false);
        })
    });
}

export const finishSession = (timestamp: number) => {
    return new Promise<boolean>(async (resolve, reject) => {
        const id = parseInt((await AsyncStorage.getItem(StorageKeys.SESS_ID)) || "0");
        if (id) {
            db.runAsync(`UPDATE session SET stop = ? WHERE id = ?;`, [timestamp.toString(), id]).then(r => {
                resolve(!!r.changes);
            }).catch(err => {
                Log.dev(err);
                resolve(false);
            });
        }
        else {
            resolve(false);
        }
    });
}

export const deleteSession = (id: number) => {
    return new Promise<boolean>(async (resolve, reject) => {
        db.runAsync(`DELETE FROM session WHERE id = ?;`, [id]).then(r => {
            resolve(!!r.changes);
        }).catch(err => {
            Log.dev(err);
            resolve(false);
        });
    });
}

export const saveNewSession = (session: Session) => {
    return new Promise<null | Session>((resolve, reject) => {
        let id: number = 0;
        let err = false;
        db.withExclusiveTransactionAsync(async (txn) => {
            const added = await db.runAsync(`INSERT INTO session (is_dm, start, intention) VALUES (?, ?, ?);`, [session.is_dm ? 1 : 0, session.start.toString(), session.intention || null]);
            if (added.lastInsertRowId) {
                id = added.lastInsertRowId;
                const l: any = await db.getFirstAsync(`SELECT COUNT(id) as l FROM session;`);
                if (l && l.l) {
                    if (l.l > Site.MAX_SESSIONS) {
                        db.runAsync(`DELETE FROM session ORDER BY id ASC LIMIT ${(l.l - Site.MAX_SESSIONS)};`);
                    }
                }
            }
            else {
                err = true;
            }
        }).then(async r => {
            if (id) {
                await AsyncStorage.setItem(StorageKeys.SESS_ID, id.toString());
            }
            resolve((err || !id) ? null : { ...session, id });
        }).catch(err => {
            Log.dev(err);
            resolve(null);
        });
    });
}