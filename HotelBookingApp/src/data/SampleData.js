// src/data/sampleData.js
export const onboardingData = [
  {
    id: '1',
    title: 'Find Perfect Hotels',
    description: 'Discover the best hotels that match your preferences and budget',
    image: require('../../assets/01-Onboarding Page/Onboarding 1.png')
  },
  {
    id: '2',
    title: 'Easy Booking',
    description: 'Book your stay with just a few taps and secure your reservation',
    image: require('../../assets/01-Onboarding Page/Onboarding 2.png')
  },
  {
    id: '3',
    title: 'Manage Your Trips',
    description: 'View and manage all your bookings in one place',
    image: require('../../assets/01-Onboarding Page/Onboarding 3.png')
  }
];

export const sampleHotels = [
  {
    id: '1',
    name: 'Luxury Resort & Spa',
    location: 'Bali, Indonesia',
    price: 299,
    rating: 4.8,
    image: require('../../assets/06-Explore Page/image-1.png'),
    description: 'Luxurious beachfront resort with spa and premium amenities',
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Restaurant'],
    reviews: [
      {
        id: '1',
        userName: 'John Doe',
        rating: 5,
        comment: 'Amazing experience! The staff was very helpful.',
        date: '2024-01-15',
        userImage: require('../../assets/10-Hotel Detail Page/profile-1.png')
      },
      {
        id: '2',
        userName: 'Jane Smith',
        rating: 4,
        comment: 'Great location and beautiful rooms.',
        date: '2024-01-10',
        userImage: require('../../assets/10-Hotel Detail Page/profile-2 copy.png')
      }
    ]
  },
  {
    id: '2',
    name: 'City View Hotel',
    location: 'New York, USA',
    price: 189,
    rating: 4.3,
    image: require('../../assets/06-Explore Page/image-4.png'),
    description: 'Modern hotel in the heart of the city with stunning views',
    amenities: ['Free WiFi', 'Gym', 'Business Center', 'Bar'],
    reviews: []
  },
  {
    id: '3',
    name: 'Mountain Retreat',
    location: 'Swiss Alps, Switzerland',
    price: 349,
    rating: 4.9,
    image: require('../../assets/06-Explore Page/image-13.png'),
    description: 'Cozy retreat with breathtaking mountain views',
    amenities: ['Free WiFi', 'Fireplace', 'Hot Tub', 'Restaurant'],
    reviews: [
      {
        id: '3',
        userName: 'Mike Johnson',
        rating: 5,
        comment: 'Perfect getaway! The views were incredible.',
        date: '2024-01-08',
        userImage: require('../../assets/10-Hotel Detail Page/profile-3 copy.png')
      }
    ]
  }
];

export const authIcons = {
  google: require('../../assets/02-Sign in Page/google 1.png'),
  apple: require('../../assets/02-Sign in Page/vuesax_bold_apple.png'),
  eyeOff: require('../../assets/02-Sign in Page/eye-off.png')
};