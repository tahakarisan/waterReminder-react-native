import db from '../database/database';

// 📌 Su hatırlatıcısını ekleme
export const addReminder = (time, amount) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO reminders (time, amount) VALUES (?, ?);`,
        [time, amount],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

// 📌 Tüm hatırlatıcıları çekme
export const getReminders = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM reminders;`,
        [],
        (_, { rows }) => resolve(rows.raw()), 
        (_, error) => reject(error)
      );
    });
  });
};

// 📌 Belirli bir hatırlatıcıyı silme
export const deleteReminder = id => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM reminders WHERE id = ?;`,
        [id],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};
