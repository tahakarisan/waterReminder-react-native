import React, { useState } from 'react';
import {View, Text, StyleSheet, Dimensions,TextInput} from 'react-native';

let heightPhone = Dimensions.get("window").height/10
const SettingsScreen = () => {
  const [number,setTarget]=useState(2000);
  const updateTarget = ()=>{
     setTarget(number)
     console.log(number)
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ayarlar</Text>
    <View>
    <View style={styles.settingContainer}>
      <Text style={styles.settingItem}>Günlük Hedef</Text>
      <TextInput 
      onChangeText={updateTarget}
      value={number}
      style={styles.input}
      placeholder='Hedefinizi Yazın'
      />
    </View>
    <View style={styles.settingContainer}>
      <Text>Bildirim Aralıkları</Text>
    </View>
    <View style={styles.settingContainer}>
      <Text>Bildirim Saat Aralıkları</Text>
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
  input: {
    color:"black",
    backgroundColor:"#E3F2FD",
    borderColor:"#2196F3",
    height: 40,
    margin: 8,
    borderWidth: 1,
    borderRadius:10,
  },
});

export default SettingsScreen;