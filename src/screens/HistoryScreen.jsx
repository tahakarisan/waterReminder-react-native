import React, {useState, useEffect} from 'react';
import { StyleSheet, Alert } from 'react-native';
import {
  View, 
  Text, 
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { ref, getDatabase, onValue, enableIndexedDbPersistence, set, serverTimestamp } from 'firebase/database';
import { database } from '../services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles/history';
import NetInfo from '@react-native-community/netinfo';

const HistoryScreen = () => {
  const [userData, setUserData] = useState(null);
  const [waterLogs, setWaterLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalWater, setTotalWater] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setupRealtimeListeners();
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const setupRealtimeListeners = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        setLoading(false);
        return;
      }

      const db = getDatabase();
      
      // Kullanıcı bilgileri için realtime listener
      const userRef = ref(db, `users/${userId}`);
      onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          setUserData(userData);
        }
      });

      // Su kayıtları için realtime listener
      const today = new Date();
      const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      const waterRef = ref(db, `users/${userId}/waterIntake/${dateKey}`);
      
      onValue(waterRef, (snapshot) => {
        const waterData = snapshot.val();
        if (waterData) {
          // Logları tersine çevirip en son içileni en üstte göster
          const logs = waterData.logs || [];
          setWaterLogs([...logs].reverse());
          setTotalWater(waterData.totalWater || 0);
        } else {
          setWaterLogs([]);
          setTotalWater(0);
        }
        setLoading(false);
      });

    } catch (error) {
      console.error('Realtime veri dinlemede hata:', error);
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setupRealtimeListeners();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  const renderWaterLog = ({ item, index }) => (
    <View style={styles.logItem}>
      <View style={styles.logTime}>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      <View style={styles.logAmount}>
        <Text style={styles.amountText}>+{item.amount} ml</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>
            Çevrimdışı mod - Verileriniz internet bağlantısı sağlandığında güncellenecek
          </Text>
        </View>
      )}
      {/* Profil Kartı */}
      <View style={styles.profileCard}>
        <Image 
          source={require("../../images/water_avatar.jpg")} 
          style={styles.avatar} 
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userData?.name || 'Kullanıcı'}</Text>
          <Text style={styles.userDetails}>
            {userData?.age} yaş
          </Text>
        </View>
      </View>

      {/* Günlük Özet */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Bugünkü Su Tüketimi</Text>
        <Text style={styles.summaryAmount}>
          {totalWater} ml
        </Text>
        <View style={styles.targetInfo}>
          <Text style={styles.targetText}>
            Hedef: {userData?.settings?.targetWater || 2000} ml
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${Math.min((totalWater / (userData?.settings?.targetWater || 2000)) * 100, 100)}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Su İçme Kayıtları */}
      <View style={styles.logsContainer}>
        <Text style={styles.logsTitle}>Günlük Su İçme Kayıtları</Text>
        <FlatList
          data={waterLogs}
          renderItem={renderWaterLog}
          keyExtractor={(_, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#1976D2"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Bugün henüz su içme kaydınız bulunmuyor.
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default HistoryScreen;
