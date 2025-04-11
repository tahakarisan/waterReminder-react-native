import React, { useEffect, useState, useRef } from "react";
import database, { get } from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
  Image,
} from "react-native";

const HomeScreen = ({route, navigation}) => {
  const userId = route.params;
  const [id , setId] = useState(userId);
  const [isLoading, setIsLoading] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const targetWater = 2000;
  const [currentWater, setWater] = useState(0);
  const [loadWater, setLoadWater] = useState(false);  
 
  // Animasyon değerleri:
  const waterLevelAnim = useRef(new Animated.Value(0)).current; // Su seviyesi (yüzde olarak)
  const waveAnim = useRef(new Animated.Value(0)).current; // Dalga kayması
  // Farklı konumlarda baloncuklar için:
  const bubbleAnim1 = useRef(new Animated.Value(0)).current;
  const bubbleAnim2 = useRef(new Animated.Value(0)).current;
  const bubbleAnim3 = useRef(new Animated.Value(0)).current;

  
  const getCurrentWater = () => {
    const reference = database().ref(`/userWaterInfo/${id}`);
  
    const onValueChange = reference.on('value', snapshot => {
      const data = snapshot.val();
      if (data && data.waterIntake !== undefined) {
        const value = data.waterIntake;
        setWater(value);
  
        // 💧 Animasyonu da burada başlat
        Animated.timing(waterLevelAnim, {
          toValue: (value / targetWater) * 100,
          duration: 500,
          useNativeDriver: false,
        }).start();
      }
    });
  
    return () => reference.off('value', onValueChange);
  };
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
      setId(data)// Bu asenkron olduğu için getUser burada çağrılmamalı
      console.log("User ID:", data);
    }
  };
  
  const setWaterIntake = async (waterLevel) => {
    const getTurkeyTime = () => {
      const options = { timeZone: 'Europe/Istanbul', hour12: false };
      const turkeyDate = new Date().toLocaleString('en-US', options);
      return turkeyDate;
    };
    
    const getCurrentHourAndDate = () => {
      const turkeyTime = new Date(getTurkeyTime());
      const currentHour = turkeyTime.getHours();  // Saat
      const currentMinute = turkeyTime.getMinutes();  // Dakika
      const currentDay = turkeyTime.getDate();  // Gün
      const currentMonth = turkeyTime.getMonth() + 1;  // Ay (0-11, 1 ekliyoruz)
      const currentYear = turkeyTime.getFullYear();  // Yıl
      
      return {
        currentDay,
        currentMonth,
        currentYear,
        currentHour,
        currentMinute
      };
    };
    
    const { currentDay, currentMonth, currentYear, currentHour, currentMinute } = getCurrentHourAndDate();
      const reference  = database().ref(`/userWaterInfo/${id}`);
      reference.set({
        date: {currentDay:
          currentDay,currentMonth:currentMonth,currentYear: currentYear,currentHour:currentHour,currentMinute:
           currentMinute},
        waterIntake: waterLevel,
      })
  }

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

  // Su seviyesini güncelleyen fonksiyon:
  const updateWater = () => {
    if (currentWater < targetWater) {
      const newWater = currentWater + 200;
      setWater(newWater);
      setWaterIntake(newWater);
      Animated.timing(waterLevelAnim, {
        toValue: (newWater / targetWater) * 100,
        duration: 500,
        useNativeDriver: false,
      }).start();
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
            <Text style={styles.waterText}>{Math.round((currentWater / targetWater) * 100)}%</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={updateWater}>
            <Text style={styles.buttonText}>💧 Su İç</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={()=>{}}>
            <Text style={styles.buttonText}>🥤 Bardak Değiştir</Text>
          </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 20,
  },
  waterContainer: {
    width: 200,
    height: 400,
    backgroundColor: "#E3F2FD",
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 30,
  },
  waterLevel: {
    width: "100%",
    backgroundColor: "#1976D2",
    position: "absolute",
    bottom: 0,
  },
  wave: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 200,
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  waterText: {
    marginTop:180,
    position: "absolute",
    top: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    zIndex: 10,
  },
  bubble: {
    position: "absolute",
    bottom: 10,
    width: 10,
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#1976D2",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    width:300,
    marginBottom:20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign:"center"
  },
  textContainer: {
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
    marginTop:130,
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
    color: "#1976D2",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default HomeScreen;
