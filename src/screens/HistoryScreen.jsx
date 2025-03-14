import React from 'react';
import {View, Text, StyleSheet,ActivityIndicator} from 'react-native';

const HistoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Su İçme Geçmişi</Text>
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