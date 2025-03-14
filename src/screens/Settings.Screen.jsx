import React, { useState } from 'react';
import {View, Text, StyleSheet, Dimensions,TextInput} from 'react-native';
import Slider from '../../node_modules/@react-native-community/slider'
let heightPhone = Dimensions.get("window").height/10
const SettingsScreen = () => {
  const [starterTime,setStarterTime]=useState(9.00);
  const [endTime,setEndTime]=useState(9.00);
  const [target,setTarget]=useState(2000);
  const [notificationDensity,setDensity] = useState(60);
  const updateDensity = (number)=>{
    setDensity(notificationDensity+number);
    console.log(notificationDensity);
  }
  const updateTarget = ()=>{
     setTarget(target)
     console.log(target)
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ayarlar</Text>
    <View>
    <View style={styles.settingContainerSlider}>
    <Text style={styles.settingItem}>Günlük Hedef(Ml)</Text>
    <Slider
        style={{marginTop:15}}
        minimumValue={1200}  // Minimum hedef
        maximumValue={3500} // Maksimum hedef
        step={100}          // Artış miktarı
        value={target}
        defaultValue={2000}
        onValueChange={(value) => setTarget(value)}
        minimumTrackTintColor="blue"
        maximumTrackTintColor="gray"
        thumbTintColor="deepskyblue"
      />
    <Text style={styles.targetText}>{target}</Text>
    </View>
    <View style={styles.settingContainer}>
    <Text style={styles.settingItem}>Bildirim Sıklığı(Dakika)</Text>
      <TextInput
      placeholderTextColor="gray"
      value={notificationDensity}
      inputMode='numeric'
      maxLength={3}
      defaultValue='60'
      style={styles.input}
      placeholder='Hedefinizi Yazın'
      />
    </View>
    <View style={styles.settingContainerHour}>
    <Text style={styles.settingItem}>Bildirim Saat Aralıkları</Text>
      <TextInput
        style={styles.input}
        value={starterTime} // Başlangıçta "12:00"
        onChangeText={(text) => setStarterTime(text)} // Kullanıcı değiştirebilir
        keyboardType="numeric" // Sadece rakam girişine izin verir
        placeholder="Başlangıç Saat gir (HH:MM)"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        value={endTime}
        onChangeText={(text) => setEndTime(text)}
        keyboardType="numeric" 
        placeholder="Son Saati gir (HH:MM)"
        placeholderTextColor="#888"
      />
    </View>
    </View>
    </View>
  );
};
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
  settingItem:{
    paddingTop:20,
    textAlign:"center",
    fontSize:18,
    color:"#2196F3"
  },
  settingContainer:{
    marginTop:20,
    borderWidth:1,
    borderRadius:10,
    borderColor:"#2196F3",
    height:Dimensions.get("window").height/8
  },
  settingContainerHour:{
    marginTop:20,
    borderWidth:1,
    borderRadius:10,
    borderColor:"#2196F3",
    height:Dimensions.get("window").height/5,
  },
  input: {
    flexDirection:"row",
    color:"black",
    backgroundColor:"#E3F2FD",
    borderColor:"#2196F3",
    height: 40,
    margin: 8,
    borderWidth: 1,
    borderRadius:10,
  },
  targetText:{
    textAlign:"center",
    color:"#2196F3",
    fontSize:24,
  },
  settingContainerSlider:{
    marginTop:20,
    borderWidth:1,
    borderRadius:10,
    borderColor:"#2196F3",
    height:Dimensions.get("window").height/7,
  }
});

export default SettingsScreen;