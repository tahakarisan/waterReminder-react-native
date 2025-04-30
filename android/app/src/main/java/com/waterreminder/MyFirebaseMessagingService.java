package com.waterreminder;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class MyFirebaseMessagingService extends FirebaseMessagingService {
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        
        // Bildirim geldiğinde yapılacak işlemler
        if (remoteMessage.getNotification() != null) {
            // Bildirim içeriğini al
            String title = remoteMessage.getNotification().getTitle();
            String body = remoteMessage.getNotification().getBody();
            
            // Bildirimi göster
            NotificationHelper.showNotification(this, title, body);
        }
    }

    @Override
    public void onNewToken(String token) {
        super.onNewToken(token);
        // Yeni FCM token'ı alındığında yapılacak işlemler
    }
} 