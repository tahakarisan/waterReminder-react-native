import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Dimensions, TextInput, Switch, TouchableOpacity, Alert, Platform} from 'react-native';
import Slider from '@react-native-community/slider';
import styles from './styles/settingsStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, getDatabase, set, get } from 'firebase/database';
import { database } from '../services/firebase';
import notificationService from '../services/notificationService';

const SettingsScreen = () => {
  const [starterTime, setStarterTime] = useState('9.00');
  const [endTime, setEndTime] = useState('23.00');
  const [target, setTarget] = useState(2000);
  const [notificationDensity, setDensity] = useState('60');
  const [activateNotification, setActivate] = useState(true);
  const [id, setId] = useState(null);
  
  const { width, height } = Dimensions.get('window');
  const isTablet = width >= 600;
  
  const updateNotification = () => {
    setActivate(!activateNotification);
  };

  const handleDensityChange = (text) => {
    // Only allow numbers
    if (/^\d*$/.test(text)) {
      setDensity(text);
    }
  };

  const updateSettings = async () => {
    if (!id) {
      Alert.alert("Hata", "Kullanıcı bilgisi bulunamadı!");
      return;
    }

    try {
      const db = getDatabase();
      const settingsRef = ref(db, `settings/${id}`);
      
      // Saat formatını kontrol et
      const timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3])\.[0-5][0-9]$/;
      if (!timeRegex.test(starterTime) || !timeRegex.test(endTime)) {
        Alert.alert("Hata", "Lütfen geçerli bir saat formatı girin (örn: 9.00, 23.00)");
        return;
      }

      // Bildirim sıklığını kontrol et
      const density = parseInt(notificationDensity);
      if (isNaN(density) || density < 1 || density > 240) {
        Alert.alert("Hata", "Bildirim sıklığı 1-240 dakika arasında olmalıdır");
        return;
      }

      // Ayarları kaydet
      const settingsData = {
        targetWater: target,
        notifications: {
          isEnabled: activateNotification,
          startTime: starterTime,
          endTime: endTime,
          frequency: density
        },
        lastUpdated: new Date().toISOString()
      };

      await set(settingsRef, settingsData);

      // AsyncStorage'a hedef su miktarını ve bildirim aralığını kaydet
      await AsyncStorage.setItem('targetWater', target.toString());
      await AsyncStorage.setItem('notificationInterval', density.toString());

      // Bildirim zamanlamasını güncelle
      if (activateNotification) {
        await notificationService.scheduleNextNotification(density);
      }

      Alert.alert(
        "Başarılı",
        "Ayarlarınız kaydedildi! 🎉",
        [{ text: "Tamam" }]
      );

    } catch (error) {
      console.error("Ayarlar kaydedilirken hata:", error);
      Alert.alert(
        "Hata",
        "Ayarlar kaydedilirken bir sorun oluştu. Lütfen internet bağlantınızı kontrol edin."
      );
    }
  };

  const getSettings = async () => {
    if (!id) {
      Alert.alert("Hata", "Kullanıcı Bilgisi Bulunamadı");
      return;
    }

    try {
      const db = getDatabase();
      const settingsRef = ref(db, `settings/${id}`);
      const snapshot = await get(settingsRef);
      const settingsData = snapshot.val();

      if (settingsData) {
        // Null check ve varsayılan değerler ekleyelim
        setDensity(settingsData.notifications?.frequency?.toString() || '60');
        setEndTime(settingsData.notifications?.endTime || '23.00');
        setStarterTime(settingsData.notifications?.startTime || '9.00');
        setTarget(settingsData.targetWater || 2000);
        setActivate(settingsData.notifications?.isEnabled ?? true);

        // AsyncStorage güncelleme
        await AsyncStorage.setItem('targetWater', settingsData.targetWater?.toString() || '2000');
      } else {
        console.log("Ayarlar bulunamadı, varsayılan değerler kullanılıyor");
      }
    } catch (error) {
      console.error("Ayarlar yüklenirken hata:", error);
      Alert.alert(
        "Hata",
        "Ayarlar yüklenirken bir sorun oluştu. Lütfen internet bağlantınızı kontrol edin."
      );
    }
  };

  // ID'yi al
  useEffect(() => {
    const getUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          setId(userId);
        }
      } catch (error) {
        console.error("ID alınırken hata:", error);
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (id) {
      getSettings();
    }
  }, [id]);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, isTablet && styles.titleTablet]}>Ayarlar</Text>
      
      <View style={styles.contentContainer}>
        {/* Daily Target Slider */}
        <View style={[styles.settingContainer, styles.sliderContainer]}>
          <Text style={styles.settingItem}>Günlük Hedef (Ml)</Text>
          <Slider
            style={styles.slider}
            minimumValue={1200}
            maximumValue={3500}
            step={100}
            value={target}
            onValueChange={(value) => setTarget(Math.round(value))}
            minimumTrackTintColor="#2196F3"
            maximumTrackTintColor="#BBDEFB"
            thumbTintColor="#2196F3"
          />
          <Text style={styles.targetText}>{target} ml</Text>
        </View>
        
        {/* Notification Density */}
        <View style={styles.settingContainer}>
          <Text style={styles.settingItem}>Bildirim Sıklığı (Dakika)</Text>
          <TextInput
            style={styles.input}
            value={notificationDensity}
            onChangeText={handleDensityChange}
            keyboardType='numeric'
            maxLength={3}
            placeholder='60 (Default)'
            placeholderTextColor="#90A4AE"
          />
        </View>
        
        {/* Notification Hours */}
        <View style={styles.settingContainer}>
          <Text style={styles.settingItem}>Bildirim Saat Aralıkları</Text>
          <View style={styles.timeInputContainer}>
            <TextInput
              style={[styles.input, styles.timeInput]}
              value={starterTime}
              onChangeText={(text) => setStarterTime(text)}
              keyboardType="numeric"
              placeholder="Başlangıç: 9.00"
              placeholderTextColor="#90A4AE"
            />
            <TextInput
              style={[styles.input, styles.timeInput]}
              value={endTime}
              onChangeText={(text) => setEndTime(text)}
              keyboardType="numeric"
              placeholder="Bitiş: 23.00"
              placeholderTextColor="#90A4AE"
            />
          </View>
        </View>
        
        {/* Notification Settings */}
        <View style={styles.settingContainer}>
          <Text style={styles.settingItem}>Bildirim Ayarları</Text>
          <View style={styles.notificationContainer}>
            <Text style={styles.notificationText}>Bildirimlere İzin Ver</Text>
            <Switch
              value={activateNotification}
              onValueChange={updateNotification}
              trackColor={{ false: "#BDBDBD", true: "#81D4FA" }}
              thumbColor={activateNotification ? "#2196F3" : "#f4f3f4"}
            />
          </View>
        </View>
        
        {/* Save Button */}
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={updateSettings}
          activeOpacity={0.7}
        >
        <Text style={styles.saveButtonText}>Ayarları Kaydet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsScreen;