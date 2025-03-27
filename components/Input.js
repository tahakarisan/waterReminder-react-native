import React from "react";
import { View, Text, StyleSheet, ActivityIndicator,TextInput, TouchableOpacity } from "react-native";

function Input({thisValue,type,onPress,placeHolder})
{
    return(
        <View style={styles.container}>
            <TextInput
                style={styles.button}
                keyboardType={type}
                onChangeText={onPress}
                placeholder={placeHolder}
                placeholderTextColor="black"
                value={thisValue}
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