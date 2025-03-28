import React,{useState} from "react";
import { View, Text, StyleSheet, ActivityIndicator, YellowBox } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { addUser,getUserById } from "./database/database";
import Input from "../../components/Input";
import Button from "../../components/Button/Button";
import AsyncStorage from '@react-native-async-storage/async-storage';
function UserRegisterScreen()
{
        const storeData = async (key, value) => {
                try {
                  await AsyncStorage.setItem(key, value);
                  console.log('Veri başarıyla kaydedildi.');
                } catch (error) {
                  console.error('Veri kaydedilirken hata oluştu:', error);
                }
        };
        const[name,setName] = useState(null);
        const[age,setAge] = useState(null);
        const[email,setEmail] = useState(null);
        const[weight,setWeight] = useState(null);
        const [gender, setGender] = useState("Male");
        function getUser(){
                getUserById(userId)
                .then(user => {
                if (user) {
                console.log("Kullanıcı bulundu:", user);
        } else {
        console.log("Kullanıcı bulunamadı.");
    }
  })
  .catch(error => {
    console.error("Hata oluştu:", error);
  });
        }
        const handleRegister = async () => {
                console.log(name,age,email,weight,gender)
                try {
                  const userId = await addUser(name, email, parseInt(age), parseFloat(weight), gender);
                  storeData("userId",userId);
                  console.log("Kullanıcı başarıyla eklendi:", userId);
                  // Burada kullanıcıya bir başarı mesajı gösterebilirsiniz.
                } catch (error) {
                  console.error("Kullanıcı ekleme hatası:", error);
                  // Burada hata mesajı gösterebilirsiniz.
                }
              };
        return (
        <View>
            <Text style={styles.header}>Kullanıcı Kayıt Ekranı</Text>
            <Text style={styles.label}>İsim</Text>
            <Input
                    type="text"
                    onChangeText={setName}
                    placeHolder="Adınızı Girin"
                    value={name}
            />
            <Text style={styles.label}>Yaş</Text>
            <Input
                    type="numeric"
                    onChangeText={setAge}
                    placeHolder="Yaşınızı Girin"
                    value={age}
            />
            <Text style={styles.label}>E-Mail Adresi</Text>
            <Input
                    type="text"
                    onChangeText={setEmail}
                    placeHolder="Email Adresinizi Girin"
                    value={email}
            />
            <Text style={styles.label}>Kilonuz</Text>
            <Input
                    type="numeric"
                    onChangeText={setWeight}
                    placeHolder="Kilonuzu Girin"
                    value={weight}
            />
            <Text style={styles.label}>Cinsiyet Seç:</Text>
        <Picker
           selectedValue={gender}
           onValueChange={(itemValue) =>setGender(itemValue)}
           style={styles.picker}
          >
          <Picker.Item label="Erkek" value="Male" />
          <Picker.Item label="Kadın" value="Female" />
          <Picker.Item label="Diğer" value="Other" />
                </Picker>    
            <View style={styles.container}>
            <Button
                title="Kayıt Ol" 
                onPress={handleRegister}
                backgroundColor="#4da6ff"
                textColor="white"
            />
            </View>
            
        </View>
    );

}


const styles = StyleSheet.create({
        header:{
                margin:24,
                textAlign:"center",
                fontSize:24,
                color:"#2196F3",
                fontWeight:"bold"
        },
        picker: {
                marginTop:10,
                marginLeft:20,
                width: 200,
                height: 50,
              },

        label:{
                fontSize:20,
                marginLeft:24,
        },
        container:{
                alignItems:"center"
        }
})

export default UserRegisterScreen;