import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import database, { get } from '@react-native-firebase/database';
import styles from "./styles/profileStyle"
const ProfileScreen = ({navigation}) => {
  const [parsedData, setData] = useState(null);
  const [dataLoaded,setState] = useState(false);
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
      if (data) 
      {
          setName(data.name);
          setEmail(data.email);
          setAge(data.age);
          setWeight(data.weight);
      }
    });
    setState(true);
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
  const navigateProfile = ()=>{
    setIsEditing(false);
    navigation.navigate("Profile")
  }

  const confirmLogout = () => {
  Alert.alert(
    'Çıkış Yap',
    'Hesabınızdan çıkmak istediğinize emin misiniz?',
    [
      {
        text: 'İptal',
        style: 'cancel',
      },
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: () => logOut(),
      },
    ],
    { cancelable: true }
  );
  };
    const logOut= async()=>{
      try {
        const res = await AsyncStorage.removeItem("userId")
        const method = await AsyncStorage.removeItem("userLoggedIn")
          Alert.alert("Çıkış Başarıyla Yapıldı");
          console.log(response);
          navigation.navigate("HomeMain");
      }
      catch (error) {
        Alert.alert("Hata Oluştu");
        console.log("Hata",error);
      }
     
    }

  if(dataLoaded==false){
    return(
      <ActivityIndicator style={{alignItems:"center"}} size="large" color="#00ff00"/>
    )
  }
  return (
    
    <View style={styles.mainContainer}>
      {isEditing ? (
        <>
        <TouchableOpacity style={styles.route} onPress={navigateProfile}>
          <Text style={{color:"#2196F3",fontSize:20,fontWeight:"bold",width:200}}>Geri Dön</Text>
        </TouchableOpacity>
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
        <View style={{alignItems:"center"}}>
          <Image source={require("../../images/water_avatar.jpg")} style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 20 }} />
        </View>
        
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
          <Text style={styles.text}>{age} Yaş</Text>
        </View>
      </View>
      <View style={innerStyles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={()=>{setIsEditing(true)}}>
          <Text style={styles.buttonText}>Düzenle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.errorButton} onPress={confirmLogout}>
          <Text style={styles.buttonText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>

    </View>
          
        </>
      )}
    </View>
  );
};

const innerStyles = StyleSheet.create({
  buttonContainer:{
    flexDirection:"row",
  },
})
export default ProfileScreen;