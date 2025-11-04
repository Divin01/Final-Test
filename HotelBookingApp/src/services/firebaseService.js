import { 
  db, 
  collections,
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
} from '../config/firebase';

export const userService = {
  createUserProfile: async (userId, userData) => {
    try {
      await setDoc(doc(db, collections.USERS, userId), {
        ...userData,
        uid: userId,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getUserProfile: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, collections.USERS, userId));
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      } else {
        return { success: false, error: 'User profile not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  updateUserProfile: async (userId, updates) => {
    try {
      await updateDoc(doc(db, collections.USERS, userId), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export const bookingService = {
  createBooking: async (bookingData) => {
    try {
      const bookingRef = await addDoc(collection(db, collections.BOOKINGS), {
        ...bookingData,
        createdAt: new Date().toISOString(),
        status: 'confirmed'
      });
      
      return { 
        success: true, 
        bookingId: bookingRef.id 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getUserBookings: (userId, callback) => {
    try {
      const bookingsQuery = query(
        collection(db, collections.BOOKINGS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(bookingsQuery, 
        (snapshot) => {
          const bookings = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          callback({ success: true, data: bookings });
        },
        (error) => {
          callback({ success: false, error: error.message });
        }
      );

      return unsubscribe;
    } catch (error) {
      callback({ success: false, error: error.message });
      return () => {}; // Return empty function
    }
  },

  getBookingById: async (bookingId) => {
    try {
      const bookingDoc = await getDoc(doc(db, collections.BOOKINGS, bookingId));
      if (bookingDoc.exists()) {
        return { success: true, data: bookingDoc.data() };
      } else {
        return { success: false, error: 'Booking not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export const reviewService = {
  addReview: async (reviewData) => {
    try {
      await addDoc(collection(db, collections.REVIEWS), {
        ...reviewData,
        createdAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getHotelReviews: (hotelId, callback) => {
    try {
      const reviewsQuery = query(
        collection(db, collections.REVIEWS),
        where('hotelId', '==', hotelId),
        orderBy('createdAt', 'desc')
      );

      return onSnapshot(reviewsQuery, 
        (snapshot) => {
          const reviews = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          callback({ success: true, data: reviews });
        },
        (error) => {
          callback({ success: false, error: error.message });
        }
      );
    } catch (error) {
      callback({ success: false, error: error.message });
      return () => {};
    }
  }
};