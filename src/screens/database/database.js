import SQLite from '../../../node_modules/react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'WaterReminder.db',
    location: 'default',
  },
  () => console.log('Database connected!'),
  error => console.error('Database error: ', error)
);

export const checkUserExists = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT COUNT(*) AS userCount FROM Users;",
        [],
        (_, result) => {
          const count = result.rows.item(0).userCount;
          resolve(count > 0);  // Eğer count > 0 ise true döner
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const initializeDatabase = () => {
  db.executeSql("PRAGMA foreign_keys = ON;");
  db.transaction(tx => {
    
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        name TEXT,
        email TEXT,
        age INTEGER,
        weight REAL,
        gender TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,
      [],
      () => { console.log("Users tablosu oluşturuldu"); },
      error => { console.error("Users tablosu hatası: ", error); }
    );
    
    // Reminders tablosu
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Reminders (
        id INTEGER PRIMARY KEY NOT NULL,
        userId INTEGER,
        reminderTime DATETIME,
        reminderText TEXT,
        FOREIGN KEY (userId) REFERENCES Users(id)
      );`,
      [],
      () => { console.log("Reminders tablosu oluşturuldu"); },
      error => { console.error("Reminders tablosu hatası: ", error); }
    );
  
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Settings (
        id INTEGER PRIMARY KEY NOT NULL,
        userId INTEGER,
        dailyGoal TEXT,
        starterTime DATETIME,
        endTime DATETIME,
        notificationFrequency INTEGER,
        notificationStatus INTEGER,
        FOREIGN KEY (userId) REFERENCES Users(id)
      );`,
      [],
      () => { console.log("Settings tablosu oluşturuldu"); },
      error => { console.error("Settings tablosu hatası: ", error); }
    );
  });
};

export default db;
