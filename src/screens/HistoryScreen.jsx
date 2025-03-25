import React from 'react';
import {View, Text, StyleSheet,ActivityIndicator,Button} from 'react-native';
import Input from '../../components/Input';
  const HistoryScreen = ({navigation}) => {
  function routeUserForm(){
    navigation.navigate("UserRegister")
  }
  return (
    
    <View style={styles.container}>
      <Text style={styles.title}>Su İçme Geçmişi</Text>
      <Button
        title="Kulanıcı Kayıt Formu"
        onPress={routeUserForm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 20,
  },
});

export default HistoryScreen;