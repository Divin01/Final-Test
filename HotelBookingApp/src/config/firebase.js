// src/config/firebase.js 
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDkmexZhAa7Q_DsJ8PhmCo7PioZ6FeOHmM",
  authDomain: "hotelbookingapp-cb5d9.firebaseapp.com",
  projectId: "hotelbookingapp-cb5d9",
  storageBucket: "hotelbookingapp-cb5d9.firebasestorage.app",
  messagingSenderId: "150038915585",
  appId: "1:150038915585:web:f3208d18619c4daad66e00"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);

// Firestore Collections
export const collections = {
  USERS: 'users',
  BOOKINGS: 'bookings',
  REVIEWS: 'reviews',
  HOTELS: 'hotels'
};

export { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot 
};

export default app;