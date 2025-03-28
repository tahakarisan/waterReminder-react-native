import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
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
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f4f4', padding: 20 }}>
      <Image source={require("../../images/water_avatar.jpg")} style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 20 }} />
      {isEditing ? (
        <>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ad" />
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="E-posta" keyboardType="email-address" />
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Telefon" keyboardType="phone-pad" />
          <TouchableOpacity style={styles.button} onPress={saveProfile}>
            <Text style={styles.buttonText}>Kaydet</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.text}>{name || 'Adınız'}</Text>
          <Text style={styles.text}>{email || 'E-posta adresiniz'}</Text>
          <Text style={styles.text}>{phone || 'Telefon numaranız'}</Text>
          <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
            <Text style={styles.buttonText}>Düzenle</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = {
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
};

export default ProfileScreen;