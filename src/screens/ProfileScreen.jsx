import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database, { get } from '@react-native-firebase/database';

const ProfileScreen = () => {
  const [parsedData, setData] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [isEditing, setIsEditing] = useState(false);

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
    const reference = database().ref('/users/' + parsedData);
    const onValueChange = reference.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        setName(data.name);
        setEmail(data.email);
        setAge(data.age);
        setWeight(data.weight);
      }
    });
  
    // Component unmount olduğunda listener'ı kaldır
    return () => reference.off('value', onValueChange);
  };
  useEffect(() => {
    const fetchData = async () => {
      const data = await getData("userId");
      if (data !== null) {
        setData(data); // Bu asenkron olduğu için getUser burada çağrılmamalı
        console.log("User ID:", data);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    if (parsedData) {
      getUser();
    }
  }, [parsedData]);

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem('name', name);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('phone', phone);
      setIsEditing(false);
    } catch (error) {
      console.error('Veriler kaydedilirken hata oluştu:', error);
    }
  };

  return (
    
    <View style={styles.mainContainer}>
      {isEditing ? (
        <>
        <Image source={require("../../images/water_avatar.jpg")} style={{width: 120, height: 120, borderRadius: 60, marginBottom: 20 }} />
          <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={name} placeholderTextColor="black" onChangeText={setName} placeholder="Ad" />
          </View>
          <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={email} placeholderTextColor="black" onChangeText={setEmail} placeholder="E-posta" keyboardType="email-address" />
          </View>
          <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={weight} onChangeText={setWeight} placeholder="Kilo" placeholderTextColor="black" keyboardType="phone-pad" />
          </View>
          <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={age} onChangeText={setAge} placeholder="Yaş" placeholderTextColor="black" keyboardType="phone-pad" />
          </View>
          <TouchableOpacity style={styles.button} onPress={saveProfile}>
            <Text style={styles.buttonText}>Kaydet</Text>
          </TouchableOpacity>
        </>
       ) : (
        <>
        <View style={styles.profileContainer}>
        <Image source={require("../../images/water_avatar.jpg")} style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 20 }} />
        <Text style={styles.profileTitleText}>{name}</Text>
          </View>
          <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.profileInfo}>
          <Text style={styles.profileText}>İsim:</Text>
          <Text style={styles.text}>{name}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileText}>E-Mail:</Text>
          <Text style={styles.text}>{email}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileText}>Kilo:</Text>
          <Text style={styles.text}>{weight} kg</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileText}>Yaş:</Text>
          <Text style={styles.text}>{age} kg</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
        <Text style={styles.buttonText}>Düzenle</Text>
      </TouchableOpacity>
    </View>
          
        </>
      )}
    </View>
  );
};

const styles = {
  mainContainer: {
    marginTop:80,
    padding: 20,
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
    height:400,
    alignSelf: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  container: {
    marginTop:80,
    padding: 20,
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
    height:400,
    alignSelf: "center",
    elevation: 3, // Android gölgelendirme
    shadowColor: "#000", // iOS gölgelendirme
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  editContainer: {
    marginTop:80,
    padding: 20,
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    height:400,
    alignSelf: "center",
    elevation: 3, // Android gölgelendirme
    shadowColor: "#000", // iOS gölgelendirme
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoContainer: {
    width: "100%",
    gap: 10, // Bileşenler arasına boşluk bırakır (React Native 0.71+)
  },
  profileInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  profileText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#555",
  },
  profileTitleText: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#555",
    textAlign:"center",
    marginBottom:-40,
  },
  text: {
    marginTop:3,
    fontSize: 13,
    color: "#333",
  },
  button: {
    marginTop: 50,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // Android gölgelendirme
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
};

export default ProfileScreen;