import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class NotificationService {
  constructor() {
    this.notificationTimer = null;
    this.initializePushNotifications();
  }

  initializePushNotifications = () => {
    // Android için bildirim kanalı oluştur
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'water_reminder_channel',
          channelName: 'Su Hatırlatıcı Bildirimleri',
          channelDescription: 'Su içme hatırlatıcı bildirimleri',
          importance: 4, // IMPORTANCE_HIGH
          vibrate: true,
        },
        (created) => console.log(`Bildirim kanalı oluşturuldu: ${created}`)
      );
    }

    PushNotification.configure({
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    // iOS için özel yapılandırma
    if (Platform.OS === 'ios') {
      PushNotificationIOS.addEventListener('register', this.onPushNotificationRegistered);
      PushNotificationIOS.addEventListener('registrationError', this.onPushNotificationRegistrationError);
      PushNotificationIOS.addEventListener('notification', this.onPushNotificationReceived);
      PushNotificationIOS.addEventListener('localNotification', this.onPushNotificationReceived);
    }
  };

  onPushNotificationRegistered = (token) => {
    console.log('iOS Push Notification Token:', token);
  };

  onPushNotificationRegistrationError = (error) => {
    console.error('iOS Push Notification Registration Error:', error);
  };

  onPushNotificationReceived = (notification) => {
    console.log('iOS Push Notification Received:', notification);
  };

  requestNotificationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const result = await PushNotificationIOS.requestPermissions({
          alert: true,
          badge: true,
          sound: true,
        });
        console.log('iOS Bildirim İzinleri:', result);
        return result;
      } else {
        PushNotification.requestPermissions();
        return true;
      }
    } catch (error) {
      console.error('Bildirim izni hatası:', error);
      return false;
    }
  };

  getInitialNotification = async () => {
    try {
      if (Platform.OS === 'ios') {
        const notification = await PushNotificationIOS.getInitialNotification();
        console.log('İlk Bildirim:', notification);
        return notification;
      } else {
        return PushNotification.getInitialNotification();
      }
    } catch (error) {
      console.error('İlk bildirim alınırken hata:', error);
      return null;
    }
  };

  scheduleNextNotification = (intervalInMinutes) => {
    console.log('Bildirim zamanlayıcı başlatılıyor:', intervalInMinutes, 'dakika');
    
    if (this.notificationTimer) {
      clearInterval(this.notificationTimer);
    }

    this.notificationTimer = setInterval(() => {
      this.sendNotification();
    }, intervalInMinutes * 60 * 1000);

    // İlk bildirimi hemen gönder
    this.sendNotification();
  };

  sendNotification = () => {
    console.log('Bildirim gönderiliyor...');
    
    PushNotification.localNotification({
      title: 'Su İçme Zamanı!',
      message: 'Vücudunuzun suya ihtiyacı var. Bir bardak su için.',
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
      channelId: 'water_reminder_channel',
    });
  };

  saveLastDrinkTime = async () => {
    try {
      const now = new Date().toISOString();
      await AsyncStorage.setItem('lastDrinkTime', now);
      console.log('Son içme zamanı kaydedildi:', now);
    } catch (error) {
      console.error('Son içme zamanı kaydedilirken hata:', error);
    }
  };

  getLastDrinkTime = async () => {
    try {
      const lastDrinkTime = await AsyncStorage.getItem('lastDrinkTime');
      console.log('Son içme zamanı alındı:', lastDrinkTime);
      return lastDrinkTime;
    } catch (error) {
      console.error('Son içme zamanı alınırken hata:', error);
      return null;
    }
  };

  cleanup = () => {
    if (this.notificationTimer) {
      clearInterval(this.notificationTimer);
      this.notificationTimer = null;
    }
  };
}

export default new NotificationService(); 