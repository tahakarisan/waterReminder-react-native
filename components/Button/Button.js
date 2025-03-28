import React from "react";
import { TouchableOpacity,View, Text, StyleSheet } from "react-native";

const Button = ({ title, onPress, backgroundColor = "#007bff", textColor = "#fff"}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
      >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width:365,
    marginTop:30
  },
  container:{
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Button;
