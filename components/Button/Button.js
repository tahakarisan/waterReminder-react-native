import React from "react";
import { View,TouchableOpacity, StyleSheet} from "react-native";


function Button({title,onPress}){
    return(
        <View>
            <TouchableOpacity
                title={title}
                onPress={onPress}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    
})

export default Button;