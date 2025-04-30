import React, { useEffect, useState, useRef } from "react";
import {database} from "./services/firebase"; // Firebase'i başlat
import { ref,getDatabase,set, onValue, get } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "./styles/homepageStyle";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Alert,
  RefreshControl,
  TextInput,
  Modal
} from "react-native";
import notificationService from '../services/notificationService';

const HomeScreen = ({route, navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  const userId = route.params;
  const [id, setId] = useState(userId);
  const [isLoading, setIsLoading] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [targetWater, setTargetWater] = useState(2000);
  const [currentWater, setWater] = useState(0);
  const [loadWater, setLoadWater] = useState(false);
  const [glassSize, setGlassSize] = useState(200); // Varsayılan bardak boyutu
  const [showGlassSizeModal, setShowGlassSizeModal] = useState(false);
  const [newGlassSize, setNewGlassSize] = useState('');

  // Animasyon değerleri
  const waterLevelAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const bubbleAnim1 = useRef(new Animated.Value(0)).current;
  const bubbleAnim2 = useRef(new Animated.Value(0)).current;
  const bubbleAnim3 = useRef(new Animated.Value(0)).current;

  const getTargetWater = async()=>{
    if (!id) {
      Alert.alert("Hata", "Kullanıcı Bilgisi Bulunamadı");
      return;
    }

    try {
      const db = getDatabase();
      const targetRef = ref(db, `settings/${id}/targetWater`);
      const snapshot = await get(targetRef);
      const targetWater = snapshot.val();

      if (targetWater) {
        await setTargetWater(targetWater);

      } else {
        console.log("Hata");
      }
    } catch (error) {
      console.error("Ayarlar yüklenirken hata:", error);
      Alert.alert(
        "Hata",
      );
    }

  }
  const onRefresh = () => {
    setRefreshing(true);
    setupRealtimeListeners();
    setRefreshing(false);
  };
  // Firebase'den su verisini çekme
  const getCurrentWater = () => {
    // Bugünün tarihini al
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    
    // Doğru referans yolu
    const waterRef = ref(database, `users/${id}/waterIntake/${dateKey}`);
    
    const unsubscribe = onValue(waterRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data?.totalWater !== undefined) { // waterIntake yerine totalWater kontrolü
        const value = data.totalWater;
        setWater(value);
        
        Animated.timing(waterLevelAnim, {
          toValue: (value / targetWater) * 100,
          duration: 500,
          useNativeDriver: false,
        }).start();
      }
      
      setLoadWater(true);
    }, (error) => {
      console.error("Su verisi çekilirken hata:", error);
      setLoadWater(true);
    });
  
    return unsubscribe;
  };
  useEffect(() => {
    const unsubscribe = getCurrentWater();
    return () => unsubscribe(); // Component kaldırıldığında dinleyiciyi temizle
  }, [id]); // id değiştiğinde yeniden çalışır
  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? value : null; 
    } catch (error) {
      console.error("Veri okunurken hata oluştu:", error);
      return null;
    }
  }
  const fetchData = async () => {
    const data = await getData("userId");
    if (data !== null) {
      setId(data)
      console.log("User ID:", data);
    }
  };

const setWaterIntake = async (waterLevel) => {
  if (!id) {
    console.error("Kullanıcı ID'si bulunamadı!");
    return;
  }

  try {
    // Günün tarihini al
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    
    // Database referansını al
    const db = getDatabase();
    const waterRef = ref(db, `users/${id}/waterIntake/${dateKey}`);
    
    // Mevcut veriyi kontrol et
    const snapshot = await get(waterRef);
    const currentData = snapshot.val() || {};
    
    // Yeni kayıt
    const newData = {
      lastUpdate: new Date().toISOString(),
      totalWater: waterLevel,
      logs: [
        ...(currentData.logs || []),
        {
          time: new Date().toLocaleTimeString('tr-TR'),
          amount: 200, // Her tıklamada eklenen miktar
        }
      ]
    };

    // Veriyi güncelle
    await set(waterRef, newData);
    
  } catch (error) {
    console.error("Su seviyesi güncellenirken hata:", error);
    Alert.alert(
      "Hata",
      "Veriler kaydedilirken bir ssorun oluştu. Lütfen internet bağlantınızı kontrol edin."
    );
    throw error;
  }
};

  useEffect(() => {
    fetchData();
    const checkLoginStatus = async () => {
      try {
        const userLoggedIn = await AsyncStorage.getItem('userLoggedIn');
        if (userLoggedIn === 'true') {
          setUserExists(true); // Giriş yapmış kullanıcı
        } else {
          setUserExists(false); // Giriş yapmamış kullanıcı
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setIsLoading(false); // Yükleme bitti
      }
    };
    checkLoginStatus(); // Uygulama açıldığında login durumunu kontrol et
    console.log('Test logu: Uygulama başlatıldı!');
  }, []); // Ekran ilk açıldığında çalışacak
  useEffect(() => {
    fetchData();// Uygulama başladığında AsyncStorage'dan su miktarını çek
    console.log('Test logu: Uygulama başlatıldı!');
  }, []); // İlk açılışta çalışacak
  useEffect(() => {
    if (id) {getCurrentWater();  
    getTargetWater();  
  }}, [id]); // id değiştiğinde tekrar veri çek,
  useEffect(() => {
    const getUserData = async () => {
      setIsLoading(true);
      try {
        const snapshot = await database().ref('/users/' + userId).once('value');
        const data = snapshot.val();
        if (data !== null) {
          console.log('Kullanıcı verisi:', data);
          setUserExists(true);
          // Kullanıcıyı giriş yapmış olarak kaydet
          await AsyncStorage.setItem('userLoggedIn', 'true');
          await AsyncStorage.setItem('userId', userId.toString());
        } else {
          console.log("Kullanıcı bulunamadı.");
          setUserExists(false);
          await AsyncStorage.setItem('userLoggedIn', 'false');
        }
      } catch (error) {
        console.error('Veri çekme hatası:', error);
        setUserExists(false);
        await AsyncStorage.setItem('userLoggedIn', 'false');
      }
      setIsLoading(false);
    };
    if (userId) {
      getUserData();
    } else {
      console.log("userId boş geldi");
      setUserExists(false);
      setIsLoading(false);
    }
  }, [userId]);

  // Dalga animasyonu: dalganın yatay kayması
  useEffect(() => {
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [waveAnim]);

  // Baloncuk animasyonları: her biri farklı delay ve hızda yukarı çıkacak
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

  useEffect(() => {
    startBubbleAnimation(bubbleAnim1, 500, 3000, 200);
    startBubbleAnimation(bubbleAnim2, 1000, 3500, 220);
    startBubbleAnimation(bubbleAnim3, 1500, 4000, 240);
  }, []);

  const calculateWaterPercentage = (current, target) => {
    return Math.min(100, Math.round((current / target) * 100));
  };

  const updateWater = async () => {
    if (!id) {
      Alert.alert("Hata", "Kullanıcı Bilgisi Bulunamadı");
      return;
    }

    try {
      const newWater = Math.min(targetWater, currentWater + glassSize); // Sabit 250 yerine glassSize kullan
      const percentage = calculateWaterPercentage(newWater, targetWater);
      
      // Firebase'i güncelle
      await setWaterIntake(newWater);

      // Bildirim servisini güncelle
      await notificationService.saveLastDrinkTime();
      
      // Su seviyesi animasyonunu güncelle
      Animated.timing(waterLevelAnim, {
        toValue: percentage,
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

  useEffect(() => {
    const getTargetWater = async () => {
      try {
        const savedTarget = await AsyncStorage.getItem('targetWater');
        if (savedTarget) {
          setTargetWater(parseInt(savedTarget));
        }
      } catch (error) {
        console.error("Hedef su miktarı alınırken hata:", error);
      }
    };

    getTargetWater();
  }, []);

  const changeGlassSize = () => {
    setNewGlassSize(glassSize.toString());
    setShowGlassSizeModal(true);
  };

  const handleGlassSizeChange = () => {
    const size = parseInt(newGlassSize);
    if (!isNaN(size) && size >= 200 && size<400) {
      setGlassSize(size);
      setShowGlassSizeModal(false);
      Alert.alert("Başarılı", `Bardak boyutu ${size}ml olarak ayarlandı`);
    } 
    else {
      Alert.alert("Hata", "Lütfen geçerli bir sayı girin");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  // Dalga animasyonu: yatay hareket (örneğin -50px kadar sola kaysın)
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
            {/* Su seviyesi (alt kısımda yükselen mavi alan) */}
            <Animated.View
              style={[styles.waterLevel, {
                height: waterLevelAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              }]}
            />
            {/* Dalga animasyonu (üstte yarı saydam dalga efekti) */}
            <Animated.View
              style={[styles.wave, { transform: [{ translateX: waveTranslate }] }]}
            />
            {/* Farklı konumlarda baloncuklar */}
            <Animated.View
              style={[styles.bubble, { left: "20%", transform: [{ translateY: bubbleAnim1 }] }]}
            />
            <Animated.View
              style={[styles.bubble, { left: "50%", transform: [{ translateY: bubbleAnim2 }] }]}
            />
            <Animated.View
              style={[styles.bubble, { left: "75%", transform: [{ translateY: bubbleAnim3 }] }]}
            />
            {/* Su yüzdesi metni */}
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
