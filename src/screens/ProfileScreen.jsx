import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserById } from './database/database';

const ProfileScreen = () => {
  const [parsedData, setData] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? parseInt(value, 10) : null;
    } catch (error) {
      console.error("Veri okunurken hata oluştu:", error);
      return null;
    }
  }
  function getUser(){
    
    console.log(parsedData)
                getUserById(parsedData)
                .then(user => {
                if (user) {
                  setName(user.name);
                  setEmail(user.email);
                  setWeight(user.weight);
                  setAge(user.age)
        } else {
        console.log("Kullanıcı bulunamadı.");
    }
  })
  .catch(error => {
    console.error("Hata oluştu:", error);
  });
  }
  useEffect(() => {
    const fetchData = async () => {
      const data = await getData("userId");
      setData(data);
      if (data !== null) {
        const exists = await checkUserExists(data);
        setUserExists(!!exists);
      }
      setIsLoading(false);
    };
    fetchData();
    loadProfile();
    getUser();
  }, []);

  
  const loadProfile = async () => {
    try {
      
      const storedName = await AsyncStorage.getItem('name');
      const storedEmail = await AsyncStorage.getItem('email');
      const storedPhone = await AsyncStorage.getItem('phone');
      if (storedName) setName(storedName);
      if (storedEmail) setEmail(storedEmail);
      if (storedPhone) setPhone(storedPhone);
    } catch (error) {
      console.error('Veriler yüklenirken hata oluştu:', error);
    }
  };

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