import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Input from "../../components/Input";

function UserRegisterScreen()
{
    return (
        <View>
            <Text>Kullanıcı Kayıt Ekranı</Text>
            <Input
                    type="text"
                    onChangeText={console.log("basıldı")}
                    placeHolder="Adınızı Girin"
            />
            <Input
                    type="numeric"
                    onChangeText={console.log("basıldı")}
                    placeHolder="Yaşınızı Girin"
            />
            <Input
                    type="text"
                    onChangeText={console.log("basıldı")}
                    placeHolder="Email Adresinizi Girin"
            />
            <Input
                    type="numeric"
                    onChangeText={console.log("basıldı")}
                    placeHolder="Kilonuzu Girin"
            />
        </View>
    );

}

export default UserRegisterScreen;