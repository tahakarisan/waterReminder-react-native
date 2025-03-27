import React,{useState} from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Picker } from '../../node_modules/@react-native-picker/picker';
import Input from "../../components/Input";
import Button from "../../components/Button/Button"
function UserRegisterScreen()
{
        const[name,setName] = useState(null);
        const[age,setAge] = useState(null);
        const[email,setEmail] = useState(null);
        const[weight,setWeight] = useState(null);
        const [gender, setGender] = useState(null);
        
        return (
        <View>
            <Text style={styles.header}>Kullanıcı Kayıt Ekranı</Text>
            <Text style={styles.label}>İsim</Text>
            <Input
                    type="text"
                    onChangeText={setName}
                    placeHolder="Adınızı Girin"
            />
            <Text style={styles.label}>Yaş</Text>
            <Input
                    type="numeric"
                    onChangeText={setAge}
                    placeHolder="Yaşınızı Girin"
            />
            <Text style={styles.label}>E-Mail Adresi</Text>
            <Input
                    type="text"
                    onChangeText={setEmail}
                    placeHolder="Email Adresinizi Girin"
            />
            <Text style={styles.label}>Kilonuz</Text>
            <Input
                    type="numeric"
                    onChangeText={setWeight}
                    placeHolder="Kilonuzu Girin"
            />
                
            <View style={styles.container}>
            <Button 
                title="Kayıt Ol" 
                onPress={() => alert('Butona tıklandı!')} 
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

        label:{
                fontSize:20,
                marginLeft:24,
        },
        container:{
                alignItems:"center"
        }
})

export default UserRegisterScreen;