import React from "react";
import { View, Text, StyleSheet, ActivityIndicator,TextInput, TouchableOpacity } from "react-native";

function Input({value,type,onChangeText,placeHolder})
{
    return(
        <View style={styles.container}>
            <TextInput
                style={styles.button}
                keyboardType={type}
                onChangeText={onChangeText}
                placeholder={placeHolder}
                placeholderTextColor="black"
                value={value}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container:{
        margin:12,
    },
    button:{
        padding:10,
        backgroundColor:"#D1D8FE",
        borderRadius:8,
        margin:10,
    }
})
export default Input;