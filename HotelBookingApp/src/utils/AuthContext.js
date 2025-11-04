import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '../services/firebaseService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Load user profile from Firestore
        const profileResult = await userService.getUserProfile(user.uid);
        if (profileResult.success) {
          setUserProfile(profileResult.data);
        }
        
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Load user profile
      const profileResult = await userService.getUserProfile(userCredential.user.uid);
      if (profileResult.success) {
        setUserProfile(profileResult.data);
      }
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

const signUp = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    await updateProfile(userCredential.user, {
      displayName: displayName
    });

    // Create user profile in Firestore
    await userService.createUserProfile(userCredential.user.uid, {
      email: email,
      displayName: displayName,
      createdAt: new Date().toISOString()
    });

    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('hasCompletedOnboarding');
      setUserProfile(null);
    } catch (error) {
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      // Update Firebase Auth profile
      if (updates.displayName) {
        await updateProfile(user, {
          displayName: updates.displayName
        });
      }

      // Update Firestore profile
      const result = await userService.updateUserProfile(user.uid, updates);
      if (result.success) {
        setUserProfile(prev => ({ ...prev, ...updates }));
        setUser(prev => ({ ...prev, ...updates }));
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    userProfile,
    signIn,
    signUp,
    logout,
    resetPassword,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};