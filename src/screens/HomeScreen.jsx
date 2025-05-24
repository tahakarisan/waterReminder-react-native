import React, { useEffect, useState, useRef } from "react";
import { database } from "./services/firebase";
import { ref, getDatabase, set, onValue, get } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "./styles/homepageStyle";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Alert,
  TextInput,
  Modal
} from "react-native";
import notificationService from '../services/notificationService';

const HomeScreen = ({ route, navigation }) => {
  const userId = route.params;
  const [id, setId] = useState(userId);
  const [isLoading, setIsLoading] = useState(true);
  const [userExists, setUserExists] = useState(false);
  const [targetWater, setTargetWater] = useState(2000);
  const [currentWater, setWater] = useState(0);
  const [glassSize, setGlassSize] = useState(200);
  const [showGlassSizeModal, setShowGlassSizeModal] = useState(false);
  const [newGlassSize, setNewGlassSize] = useState('');

  // Animasyon değerleri
  const waterLevelAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const bubbleAnim1 = useRef(new Animated.Value(0)).current;
  const bubbleAnim2 = useRef(new Animated.Value(0)).current;
  const bubbleAnim3 = useRef(new Animated.Value(0)).current;

  // Kullanıcı giriş ve kayıt kontrolü
  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      try {
        let storedId = userId;
        if (!storedId) {
          storedId = await AsyncStorage.getItem("userId");
        }
        if (storedId) {
          setId(storedId);
          const db = getDatabase();
          const userRef = ref(db, `users/${storedId}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUserExists(true);
            await AsyncStorage.setItem('userLoggedIn', 'true');
          } else {
            setUserExists(false);
            await AsyncStorage.setItem('userLoggedIn', 'false');
          }
        } else {
          setUserExists(false);
          await AsyncStorage.setItem('userLoggedIn', 'false');
        }
      } catch (error) {
        setUserExists(false);
        await AsyncStorage.setItem('userLoggedIn', 'false');
        console.error('Kullanıcı kontrolünde hata:', error);
      }
      setIsLoading(false);
    };
    checkUser();
  }, [userId]);

  // Hedef su miktarını ve mevcut suyu çek
  useEffect(() => {
    if (!id) return;
    const db = getDatabase();

    // Hedef su miktarı
    const fetchTarget = async () => {
      try {
        const targetRef = ref(db, `settings/${id}/targetWater`);
        const snapshot = await get(targetRef);
        if (snapshot.exists()) {
          setTargetWater(snapshot.val());
        }
      } catch (error) {
        console.error("Hedef su miktarı alınırken hata:", error);
      }
    };

    // Günlük su miktarı
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const waterRef = ref(db, `users/${id}/waterIntake/${dateKey}`);
    const unsubscribe = onValue(waterRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.totalWater !== undefined) {
        setWater(data.totalWater);
        Animated.timing(waterLevelAnim, {
          toValue: (data.totalWater / targetWater) * 100,
          duration: 500,
          useNativeDriver: false,
        }).start();
      }
    }, (error) => {
      console.error("Su verisi çekilirken hata:", error);
    });

    fetchTarget();
    return () => unsubscribe();
  }, [id, targetWater]);

  // Dalga ve baloncuk animasyonları
  useEffect(() => {
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const startBubbleAnimation = (anim, delay, duration, translateYValue) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: -translateYValue,
            duration: duration,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startBubbleAnimation(bubbleAnim1, 500, 3000, 200);
    startBubbleAnimation(bubbleAnim2, 1000, 3500, 220);
    startBubbleAnimation(bubbleAnim3, 1500, 4000, 240);
  }, []);

  // Su ekleme işlemi
  const updateWater = async () => {
    if (!id) {
      Alert.alert("Hata", "Kullanıcı Bilgisi Bulunamadı");
      return;
    }
    try {
      const newWater = Math.min(targetWater, currentWater + glassSize);
      const today = new Date();
      const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      const db = getDatabase();
      const waterRef = ref(db, `users/${id}/waterIntake/${dateKey}`);
      const snapshot = await get(waterRef);
      const currentData = snapshot.val() || {};
      const newData = {
        lastUpdate: new Date().toISOString(),
        totalWater: newWater,
        logs: [
          ...(currentData.logs || []),
          {
            time: new Date().toLocaleTimeString('tr-TR'),
            amount: glassSize,
          }
        ]
      };
      await set(waterRef, newData);
      await notificationService.saveLastDrinkTime();
      Animated.timing(waterLevelAnim, {
        toValue: Math.min(100, Math.round((newWater / targetWater) * 100)),
        duration: 500,
        useNativeDriver: false,
      }).start();
      setWater(newWater);
      if (newWater >= targetWater) {
        Alert.alert("Tebrikler!", "Günlük su hedefinize ulaştınız! 🎉");
      }
    } catch (error) {
      console.error("Su miktarı güncellenirken hata:", error);
      Alert.alert("Hata", "Su miktarı güncellenirken bir sorun oluştu");
    }
  };

  // Bardak boyutu değiştirme
  const changeGlassSize = () => {
    setNewGlassSize(glassSize.toString());
    setShowGlassSizeModal(true);
  };

  const handleGlassSizeChange = () => {
    const size = parseInt(newGlassSize);
    if (!isNaN(size) && size >= 200 && size < 400) {
      setGlassSize(size);
      setShowGlassSizeModal(false);
      Alert.alert("Başarılı", `Bardak boyutu ${size}ml olarak ayarlandı`);
    } else {
      Alert.alert("Hata", "Lütfen geçerli bir sayı girin (200-399 ml arası)");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  const calculateWaterPercentage = (current, target) => {
    return Math.min(100, Math.round((current / target) * 100));
  };

  const waveTranslate = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  return (
    <View style={styles.container}>
      {userExists ? (
        <>
          <Text style={styles.title}>Günlük Su Takibi</Text>
          <View style={styles.waterContainer}>
            <Animated.View
              style={[styles.waterLevel, {
                height: waterLevelAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              }]}
            />
            <Animated.View
              style={[styles.wave, { transform: [{ translateX: waveTranslate }] }]}
            />
            <Animated.View
              style={[styles.bubble, { left: "20%", transform: [{ translateY: bubbleAnim1 }] }]}
            />
            <Animated.View
              style={[styles.bubble, { left: "50%", transform: [{ translateY: bubbleAnim2 }] }]}
            />
            <Animated.View
              style={[styles.bubble, { left: "75%", transform: [{ translateY: bubbleAnim3 }] }]}
            />
            <Text style={styles.waterText}>
              {calculateWaterPercentage(currentWater, targetWater)}%
            </Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={updateWater}>
            <Text style={styles.buttonText}>💧 Su İç ({glassSize}ml)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={changeGlassSize}>
            <Text style={styles.buttonText}>🥤 Bardak  Değiştir</Text>
          </TouchableOpacity>
          <Modal
            visible={showGlassSizeModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowGlassSizeModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Bardak Boyutu</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={newGlassSize}
                  onChangeText={setNewGlassSize}
                  placeholder="Bardak boyutunu ml cinsinden girin"
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowGlassSizeModal(false)}
                  >
                    <Text style={styles.modalButtonText}>İptal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleGlassSizeChange}
                  >
                    <Text style={styles.modalButtonText}>Tamam</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Hoş Geldiniz!</Text>
          <Image source={require("../../images/water_avatar.jpg")} style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 20 }} />
          <Text style={styles.text}>Uygulamamıza Kayıt Olun :)</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("UserRegister")}>
            <Text style={styles.buttonText}>Kayıt Ol</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;