import React from "react";
import { View, Text, StyleSheet, ActivityIndicator,TextInput, TouchableOpacity } from "react-native";

function Input({type,onPress,placeHolder})
{
    return(
        <View style={styles.container}>
            <TextInput
                style={styles.button}
                keyboardType={type}
                onChangeText={onPress}
                placeHolder={placeHolder}
                placeHolderTextColor="black"
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
        backgroundColor:"#eefc",
        borderRadius:8,
        margin:10,
    }
})
export default Input;