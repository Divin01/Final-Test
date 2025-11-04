import { collection, addDoc } from '../config/firebase';
import { sampleHotels } from '../data/SampleData';

export const initializeFirebaseData = async () => {
  try {
    // Initialize sample hotels in Firestore
    for (const hotel of sampleHotels) {
      await addDoc(collection(db, 'hotels'), {
        name: hotel.name,
        location: hotel.location,
        price: hotel.price,
        rating: hotel.rating,
        description: hotel.description,
        amenities: hotel.amenities,
        imageUrl: `hotel_${hotel.id}.jpg`, 
        createdAt: new Date().toISOString()
      });
    }
  } catch (error) {
  }
};