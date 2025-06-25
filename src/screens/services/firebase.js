// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCUmVECHyx7W1OiSxTeQFMRmRO-Yc1xN0Q",
  databaseURL: "https://waterreminder-1905-default-rtdb.firebaseio.com/",
  projectId: "waterreminder-1905",
  messagingSenderId: "563168890297",
  appId: "1:563168890297:android:d3239bb1089c2d6cd43a68"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Database referansını al
const database = getDatabase(app);

export { database };