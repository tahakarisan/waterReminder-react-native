import React, {useState,useEffect} from 'react';
import {View, Text, StyleSheet,FlatList,Image,ActivityIndicator,Button} from 'react-native';
import { initializeDatabase } from './database/database';
import { addReminder, getReminders, deleteReminder } from './services/ReminderService';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
  

const HistoryScreen = ({navigation}) => {
    const [parsedData, setData] = useState(null);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    function routeUserForm(){
      navigation.navigate("UserRegister")
    }
    const [reminders, setReminders] = useState([]);

  useEffect(() => {
    initializeDatabase(); 
    fetchReminders(); 
  },[]);
  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? value : null; 
    } catch (error) {
      console.error("Veri okunurken hata oluştu:", error);
      return null;
    }
  }
  const getUser = () => {
    const reference = database().ref('/users/'+ parsedData);
    const onValueChange = reference.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        setName(data.name);
        setAge(data.age);
      }
    });
  
    // Component unmount olduğunda listener'ı kaldır
    return () => reference.off('value', onValueChange);
  };
  useEffect(() => {
    if (parsedData) {
      getUser();
    }
  }, [parsedData]);
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
  const fetchData = async () => {
    const data = await getData("userId");
    if (data !== null) {
      setData(data); // Bu asenkron olduğu için getUser burada çağrılmamalı
      console.log("User ID:", data);
    }
  };
  useEffect(() => {
    fetchData();
  },[])

  return (
    <View>
      <View style={styles.userInfoContainer}>
      <Image source={require("../../images/water_avatar.jpg")} style={{marginLeft:30,marginTop:20, width: 70, height: 70, borderRadius: 60, marginBottom: 5 }} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.age}>{age} Yaş</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.text}>Su Kayıtları</Text>
      </View>
    </View>
  );
}
;

const styles = StyleSheet.create({
  userInfoContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 13,
    borderColor: "#2196F3",
    borderWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
    
    shadowColor: "#2196F3",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  
    elevation: 3,
  },
  
  name:{
    marginTop:30,
    marginLeft:20,
    fontSize:22,
    color:"#2196F3",
    fontWeight:"bold",
  },
  age:{
    marginTop:30,
    marginLeft:50,
    fontSize:22,
    color:"#2196F3",
    fontWeight:"bold",
  },
  container: {
    alignItems: 'center',
  },
  text:{
    marginTop: 30,
    fontSize: 28,
    color: '#2196F3',
    marginBottom: 10,
    fontWeight: 'bold',
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 20,
  },
});

export default HistoryScreen;