import React, {useState,useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/Settings.Screen'; // Hata düzeltilmiş
import HistoryScreen from './src/screens/HistoryScreen';
import ProfileScreen from './src/screens/ProfileScreen'
import UserRegisterScreen from './src/screens/UserRegister.Screen'; // Hata düzeltilmiş
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
// Stack Navigatörü Tanımlama (History'den UserRegister'a gitmek için)
function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HistoryMain" component={HistoryScreen} />
    </Stack.Navigator>
  );
}
function HomePageStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="UserRegister" component={UserRegisterScreen} />
    </Stack.Navigator>
  );
}

// Tab Navigatörü
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomePageStack}
        options={{
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({ color, size }) => (
            <Icon name="water-drop" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryStack} // Stack Navigator olarak değiştirildi
        options={{
          tabBarLabel: 'Geçmiş',
          tabBarIcon: ({ color, size }) => (
            <Icon name="history" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Ayarlar',
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Ana Uygulama Bileşeni
export default function App() {
  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}
