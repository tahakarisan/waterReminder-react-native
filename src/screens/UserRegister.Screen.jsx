import React,{useState} from "react";
import { View, Text, StyleSheet,ScrollView, ActivityIndicator,} from "react-native";
import { Picker } from '@react-native-picker/picker';
import Input from "../../components/Input";
import Button from "../../components/Button/Button";
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { yupResolver } from '@hookform/resolvers/yup';
import Toast from 'react-native-toast-message';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { useEffect } from "react";
function UserRegisterScreen({navigation})
{       
    const schema = yup.object({
      name: yup.string().required('İsim zorunludur'),
      age: yup.number().required('Yaş zorunludur').positive().integer(),
      email: yup.string().email('Geçersiz e-posta').required(),
      password: yup.string().min(6, 'Şifre en az 6 karakter olmalı').required(),
      weight: yup.number().required().positive(),
      gender: yup.string().oneOf(['Male', 'Female']),
    }).required();
     const {
    control,
    handleSubmit,
    formState: { errors },
    } = useForm({
    defaultValues: {
      name: '',
      age: '',
      email: '',
      password: '',
      weight: '',
      gender: 'Male',
    },
    resolver: yupResolver(schema),
    });
    const onSubmit = async (data) => {
  // geçerli ise buraya düşer
  console.log("Form geçerli:", data);
  if(signUp(data)){
  Toast.show({
    type: 'success',
    text1: 'Başarılı!',
    text2: 'Kayıt başarılı şekilde tamamlandı.',
  });
  }
};

const onError = (errors) => {
  // hata varsa buraya düşer
  const firstError = Object.values(errors)[0];
  if (firstError) {
    Toast.show({
      type: 'error',
      text1: 'Hata',
      text2: firstError.message,
    });
  }
};

           const signUp = async (data) => {
  const { name, email, password, age, weight, gender } = data;
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    await database().ref(`settings/${user.uid}`).set({
      userId: user.uid,
      dailyGoal: 2000,
      starterTime: 9.00,
      endTime: 23.00,
      notificationFrequency: 60,
      notificationStatus: true,
    });

    await database().ref(`users/${user.uid}`).set({
      name,
      email,
      age,
      weight,
      gender,
    });

    await AsyncStorage.setItem("userId", user.uid);
    navigation.navigate("HomeMain", user.uid);  // Objeyle gönder
    return true;

  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      Toast.show({ type: 'error', text1: 'Hata', text2: 'Bu e-posta zaten kullanımda!' });
    } else if (error.code === 'auth/invalid-email') {
      Toast.show({ type: 'error', text1: 'Hata', text2: 'Geçersiz e-posta!' });
    } else {
      Toast.show({ type: 'error', text1: 'Hata', text2: 'Bilinmeyen bir hata oluştu.' });
      console.error('Genel hata:', error);
    }
    return false;
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
                        <Controller
                        control={control}
                        name="name"
                        render={({field:{ onChange, value }})=>(
                            <Input
                            type="text"
                            onChangeText={onChange}
                            placeHolder="Adınızı Girin"
                            value={value}
                            />
                            )}
                        />
                        <Text style={styles.label}>Yaş</Text>
                        <Controller
                            control={control}
                            name="age"
                            render={({field:{onChange,value}})=>(
                            <Input
                            type="numeric"
                            onChangeText={onChange}
                            placeHolder="Yaşınızı Girin"
                            value={value}
                            />
                             )   }
                        
                        />
                        <Text style={styles.label}>E-Mail Adresi</Text>
                        <Controller
                            control={control}
                            name="email"
                            render={({field:{onChange,value}})=>(
                            <Input
                            type="text"
                            onChangeText={onChange}
                            placeHolder="Email Adresinizi Girin"
                            value={value}
                            />
                            )}
                        />
                        <Text style={styles.label}>Şifre</Text>
                        <Controller
                            control={control}
                            name="password"
                            render={({field:{onChange,value}})=>(
                            <Input
                            type="text"
                            onChangeText={onChange}
                            placeHolder="Şifrenizi Girin"
                            value={value}
                            />
                         )}
                        />
                        <Text style={styles.label}>Kilonuz</Text>
                        <Controller
                            control={control}
                            name="weight"
                            render={({field:{onChange,value}})=>(
                            <Input
                            type="numeric"
                            onChangeText={onChange}
                            placeHolder="Kilonuzu Girin"
                            value={value}
                            />
                        )}
                        />
                        
                        <Text style={styles.label}>Cinsiyet Seç:</Text>
                        <Controller
                            control={control}
                            name="gender"
                            render={({field:{onChange,value}})=>(
                            <Picker
                            selectedValue={value}
                            onValueChange={onChange}
                            style={styles.picker}
                            dropdownIconColor="blue"
                            dropdownIconRippleColor="#2196F3"
                            >
                            <Picker.Item label="Erkek" value="Male" />
                            <Picker.Item label="Kadın" value="Female" />
                            <Picker.Item label="Diğer" value="Other" />
                            </Picker>   
                            )}
                        />
                        <View style={styles.buttonContainer}>
                            <Button
                                title="Kayıt Ol"
                                onPress={handleSubmit(onSubmit,onError)}
                                backgroundColor="#4da6ff"
                                textColor="white"
                            />
                        </View>
                        <Toast/>
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