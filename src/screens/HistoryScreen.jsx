import React, {useState,useEffect} from 'react';
import {View, Text, StyleSheet,FlatList,ActivityIndicator,Button} from 'react-native';
import { initializeDatabase } from './database/database';
import { addReminder, getReminders, deleteReminder } from './services/ReminderService';
  

const HistoryScreen = ({navigation}) => {

    function routeUserForm(){
      navigation.navigate("UserRegister")
    }
    const [reminders, setReminders] = useState([]);

  useEffect(() => {
    initializeDatabase(); 
    fetchReminders(); 
  }, []);

  const fetchReminders = async () => {
    const data = await getReminders();
    setReminders(data);
  };

  const handleAddReminder = async () => {
    await addReminder('08:00 AM', 250);
    fetchReminders(); // Listeyi güncelle
  };

  const handleDeleteReminder = async id => {
    await deleteReminder(id);
    fetchReminders();
  };

  return (
    <View>
      <Button title="Hatırlatıcı Ekle" onPress={handleAddReminder} />
      <FlatList
        data={reminders}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.time} - {item.amount} ml</Text>
            <Button title="Sil" onPress={() => handleDeleteReminder(item.id)} />
          </View>
        )}
      />

      <View style={styles.container}>
      <Text style={styles.title}>Su İçme Geçmişi</Text>
      <Button
        title="Kulanıcı Kayıt Formu"
        onPress={routeUserForm}
      />
      </View>
    </View>
  );
}
;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 20,
  },
});

export default HistoryScreen;