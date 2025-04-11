import React,{useState} from "react";
import { View, Text, StyleSheet,ScrollView, ActivityIndicator,} from "react-native";
import { Picker } from '@react-native-picker/picker';
import Input from "../../components/Input";
import Button from "../../components/Button/Button";
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from "react";
function UserRegisterScreen({navigation})
{       
    const handleLogin = async () => {
        // Giriş yapıldığını AsyncStorage'da tut
        await AsyncStorage.setItem('userLoggedIn', 'true');
        navigation.navigate('HomeMain'); // Giriş yaptıktan sonra ana ekrana git
    };
        const[name,setName] = useState(null);
        const[age,setAge] = useState(null);
        const[password,setPassword] = useState(null);
        const[email,setEmail] = useState(null);
        const[weight,setWeight] = useState(null);
        const [gender, setGender] = useState("Male");
        const signUp = async () => {
            try {
                const userCredential = await auth().createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
        
                // Settings verisi
                await database()
                    .ref(`settings/${user.uid}`)
                    .set({
                        userId: user.uid,
                        dailyGoal: 2000,
                        starterTime: 9.00,
                        endTime: 23.00,
                        notificationFrequency: 60,
                        notificationStatus: true,
                    });
        
                console.log("Ayarlar başarıyla kaydedildi!");
        
                // Kullanıcı bilgileri (şifresiz!)
                await database()
                    .ref(`users/${user.uid}`)
                    .set({
                        name: name,
                        email: email,
                        age: age,
                        weight: weight,
                        gender: gender,
                    });
        
                console.log("Kullanıcı bilgileri başarıyla kaydedildi!");
        
                // Otomatik giriş yap
                await auth().signInWithEmailAndPassword(email, password);
        
                console.log("Giriş başarılı!");
        
                // AsyncStorage ile UID kaydetmek istersen:
                await AsyncStorage.setItem("userId", user.uid);
        
                // Ana sayfaya yönlendir
                navigation.navigate("HomeMain", user.uid);
        
            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('Bu e-posta adresi zaten kullanımda!');
                } else if (error.code === 'auth/invalid-email') {
                    console.log('Geçersiz e-posta adresi!');
                } else {
                    console.error('Genel hata:', error);
                }
            }
        };
        
            
            useEffect(() => {
                // Firebase'i başlatma (önceden yapılandırıldıysa tekrar gerek olmayabilir)
                database()
                    .ref('/users')
                    .once('value')
                    .then(snapshot => {
                        console.log(snapshot.val());
                    });
            }, []);
            
            
            
            
        return (

                <View style={styles.container}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                        <Text style={styles.label}>Şifre</Text>
                        <Input
                            type="text"
                            onChangeText={setPassword}
                            placeHolder="Şifrenizi Girin"
                            value={password}
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
                            onValueChange={(itemValue) => setGender(itemValue)}
                            style={styles.picker}
                            dropdownIconColor="blue"
                            dropdownIconRippleColor="#2196F3"
                        >
                            <Picker.Item label="Erkek" value="Male" />
                            <Picker.Item label="Kadın" value="Female" />
                            <Picker.Item label="Diğer" value="Other" />
                        </Picker>    
                        <View style={styles.buttonContainer}>
                            <Button
                                title="Kayıt Ol"
                                onPress={signUp}
                                backgroundColor="#4da6ff"
                                textColor="white"
                            />
                        </View>
                    </ScrollView>
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
                marginLeft:24,
                width: 200,
                height: 60,
                color:"#2196F3",
                backgroundColor:"#D1D8FE"
              },

        label:{
                fontSize:20,
                marginLeft:24,
        },
        container: {
                flex: 1,
                padding:10,
            },
        scrollContainer: {
                flexGrow: 1, // İçeriğin tüm yüksekliği kapsamasını sağlar
                justifyContent: 'space-between',
        },
        buttonContainer: {
                alignItems: 'center',
                marginTop: 20,
                marginBottom: 20, // Butonun alt kısmı ile diğer elemanlar arasındaki boşluğu arttır
        },
})

export default UserRegisterScreen;