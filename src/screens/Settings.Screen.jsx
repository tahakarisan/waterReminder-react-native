import React, { useState } from 'react';
import {View, Text, StyleSheet, Dimensions,TextInput,Switch,TouchableOpacity, Alert} from 'react-native';
import Slider from '../../node_modules/@react-native-community/slider'

let heightPhone = Dimensions.get("window").height/10
const SettingsScreen = () => {
  const [starterTime,setStarterTime]=useState(9.00);
  const [endTime,setEndTime]=useState(23.00);
  const [target,setTarget]=useState(2000);
  const [notificationDensity,setDensity] = useState(60);
  const [activateNotification,setActivate] = useState(true);
  const updateNotification = ()=> {
    setActivate(!activateNotification);
    console.log(activateNotification);
  }
  const updateDensity = (number)=>{
    setDensity(notificationDensity+number);
    console.log(notificationDensity);
  }
  const updateTarget = ()=>{
     setTarget(target)
     Alert.alert("Ayarlar Kaydedildi")
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
        placeholder="Başlangıç: 9.00 (Default)"
        placeholderTextColor="black"
      />
      <TextInput
        style={styles.input}
        value={endTime}
        onChangeText={(text) => setEndTime(text)}
        keyboardType="numeric" 
        placeholder="Bitiş: 23.00 (Default)"
        placeholderTextColor="black"
      />
    </View>
    <View style={styles.settingContainerHour}>
    <Text style={styles.settingItem}>Bildirim Ayarları</Text>
      <View style={styles.notificationContainer}>
      <Text style={[styles.settingItem,styles.marginPosition]}>Bildirimlere İzin Ver</Text>
      <Switch
        value={activateNotification}
        onValueChange={updateNotification}
        style={{marginTop:30}}
      />
      </View>
    </View>
    <TouchableOpacity onPress={()=>{updateTarget()}}>
      <Text style={styles.saveButton}>Ayarları Kaydet</Text>
    </TouchableOpacity>
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
  marginPosition:{
    marginLeft:10,
    marginTop:10,
  }
  ,
  saveButton:{
    textAlign:"center",
    fontSize:22,
    marginTop:12,
    borderColor:"#2196F3",
    backgroundColor:"#E3F2FD",
    borderWidth:1,
    padding:10,
    borderRadius:10,
  },
  notificationContainer:{
    flexDirection:"row",
    justifyContent:"space-between",
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
    marginTop:12,
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