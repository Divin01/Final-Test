// src/screens/HotelDetailsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { useAuth } from '../utils/AuthContext';
import { apiService } from '../services/apiService';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function HotelDetailsScreen({ route, navigation }) {
  const { hotel } = route.params;
  const { user } = useAuth();
  const [reviews, setReviews] = useState(hotel.reviews || []);
  const [hotelWeather, setHotelWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    loadHotelWeather();
  }, [hotel]);

  const loadHotelWeather = async () => {
    let city = 'Johannesburg';
    
    if (hotel.location.includes('Cape Town')) {
      city = 'Cape Town';
    } else if (hotel.location.includes('Pretoria')) {
      city = 'Pretoria';
    }
    
    setWeatherLoading(true);
    const result = await apiService.getWeather(city);
    setWeatherLoading(false);
    
    if (result.success) {
      setHotelWeather(result.data);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to book a hotel',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('SignIn') }
        ]
      );
      return;
    }
    navigation.navigate('Booking', { hotel });
  };

  const handleAddReview = () => {
    if (!user) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to add a review',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('SignIn') }
        ]
      );
      return;
    }
    navigation.navigate('AddReview', { hotel, onReviewAdded: handleReviewAdded });
  };

  const handleReviewAdded = (newReview) => {
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Ionicons key={i} name="star" size={16} color="#FFD700" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<Ionicons key={i} name="star-half" size={16} color="#FFD700" />);
      } else {
        stars.push(<Ionicons key={i} name="star-outline" size={16} color="#FFD700" />);
      }
    }
    return stars;
  };

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': 'sunny',
      '01n': 'moon',
      '02d': 'partly-sunny',
      '02n': 'cloudy-night',
      '03d': 'cloud',
      '03n': 'cloud',
      '04d': 'cloudy',
      '04n': 'cloudy',
      '09d': 'rainy',
      '09n': 'rainy',
      '10d': 'rainy',
      '10n': 'rainy',
      '11d': 'thunderstorm',
      '11n': 'thunderstorm',
      '13d': 'snow',
      '13n': 'snow',
      '50d': 'water',
      '50n': 'water'
    };
    return iconMap[iconCode] || 'partly-sunny';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Image with Gradient Overlay */}
      <View style={styles.imageContainer}>
        <Image 
          source={hotel.image} 
          style={styles.hotelImage}
          onLoadEnd={() => setImageLoading(false)}
        />
        {imageLoading && (
          <View style={styles.imageLoading}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
        
        {/* Gradient Overlay */}
        <View style={styles.gradientOverlay} />
        
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Favorite Button */}
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Content */}
        <View style={styles.content}>
          {/* Hotel Header */}
          <View style={styles.hotelHeader}>
            <Text style={styles.hotelName}>{hotel.name}</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.location}>{hotel.location}</Text>
            </View>
          </View>

          {/* Rating and Price */}
          <View style={styles.ratingPriceContainer}>
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {renderStars(hotel.rating)}
              </View>
              <Text style={styles.rating}>{hotel.rating}/5</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${hotel.price}</Text>
              <Text style={styles.priceLabel}>/night</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Hotel</Text>
            <Text style={styles.description}>{hotel.description}</Text>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="sparkles-outline" size={20} color="#000" />
              <Text style={styles.sectionTitle}>Amenities</Text>
            </View>
            <View style={styles.amenitiesContainer}>
              {hotel.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityTag}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Weather Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="partly-sunny-outline" size={20} color="#000" />
              <Text style={styles.sectionTitle}>Current Weather</Text>
            </View>
            {weatherLoading ? (
              <View style={styles.weatherLoading}>
                <ActivityIndicator size="small" color="#000" />
                <Text style={styles.weatherLoadingText}>Loading weather...</Text>
              </View>
            ) : hotelWeather ? (
              <View style={styles.weatherCard}>
                <View style={styles.weatherMain}>
                  <Ionicons 
                    name={getWeatherIcon(hotelWeather.icon)} 
                    size={48} 
                    color="#000" 
                  />
                  <View style={styles.weatherTempContainer}>
                    <Text style={styles.weatherTemp}>{hotelWeather.temperature}°C</Text>
                    <Text style={styles.weatherDesc}>
                      {hotelWeather.description}
                    </Text>
                  </View>
                </View>
                <View style={styles.weatherDetails}>
                  <View style={styles.weatherDetail}>
                    <Ionicons name="thermometer-outline" size={16} color="#666" />
                    <Text style={styles.weatherDetailText}>Feels like: {hotelWeather.feels_like}°C</Text>
                  </View>
                  <View style={styles.weatherDetail}>
                    <Ionicons name="water-outline" size={16} color="#666" />
                    <Text style={styles.weatherDetailText}>Humidity: {hotelWeather.humidity}%</Text>
                  </View>
                  <View style={styles.weatherDetail}>
                    <Ionicons name="speedometer-outline" size={16} color="#666" />
                    <Text style={styles.weatherDetailText}>Wind: {hotelWeather.windSpeed} km/h</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.weatherUnavailable}>
                <Ionicons name="cloud-offline-outline" size={32} color="#ccc" />
                <Text style={styles.weatherUnavailableText}>Weather unavailable</Text>
              </View>
            )}
          </View>

          {/* Reviews Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#000" />
              <View style={styles.reviewsHeader}>
                <Text style={styles.sectionTitle}>
                  Guest Reviews ({reviews.length})
                </Text>
                <TouchableOpacity style={styles.addReviewButton} onPress={handleAddReview}>
                  <Ionicons name="add-circle" size={20} color="#000" />
                  <Text style={styles.addReviewText}>Add Review</Text>
                </TouchableOpacity>
              </View>
            </View>

            {reviews.length === 0 ? (
              <View style={styles.noReviews}>
                <Ionicons name="chatbubble-outline" size={48} color="#ccc" />
                <Text style={styles.noReviewsText}>No reviews yet</Text>
                <Text style={styles.noReviewsSubtext}>Be the first to review this hotel</Text>
              </View>
            ) : (
              <View style={styles.reviewsList}>
                {reviews.slice(0, 2).map((review) => (
                  <View key={review.id} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <Image source={review.userImage} style={styles.reviewerImage} />
                      <View style={styles.reviewerInfo}>
                        <Text style={styles.reviewerName}>{review.userName}</Text>
                        <View style={styles.reviewStars}>
                          {renderStars(review.rating)}
                        </View>
                      </View>
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                    <Text style={styles.reviewText}>{review.comment}</Text>
                  </View>
                ))}
                
                {reviews.length > 2 && (
                  <TouchableOpacity 
                    style={styles.viewAllReviews}
                    onPress={() => navigation.navigate('AllReviews', { reviews })}
                  >
                    <Text style={styles.viewAllReviewsText}>
                      View all {reviews.length} reviews
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color="#000" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Book Now Button */}
      <View style={styles.footer}>
        <View style={styles.priceFooter}>
          <View>
            <Text style={styles.footerPrice}>${hotel.price}</Text>
            <Text style={styles.footerPriceLabel}>per night</Text>
          </View>
          <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
            <Ionicons name="calendar" size={20} color="#fff" />
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  imageContainer: {
    height: 350,
    position: 'relative',
  },
  hotelImage: {
    width: '100%',
    height: '100%',
  },
  imageLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.3))',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  hotelHeader: {
    marginBottom: 16,
  },
  hotelName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginLeft: 6,
  },
  ratingPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    gap: 6,
  },
  amenityText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  weatherLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  weatherLoadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  weatherCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherTempContainer: {
    marginLeft: 16,
  },
  weatherTemp: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  weatherDesc: {
    fontSize: 16,
    color: '#666',
    textTransform: 'capitalize',
  },
  weatherDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
    gap: 8,
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weatherDetailText: {
    fontSize: 14,
    color: '#666',
  },
  weatherUnavailable: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  weatherUnavailableText: {
    color: '#999',
    fontSize: 14,
    marginTop: 8,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  addReviewText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  noReviews: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  noReviewsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 4,
  },
  noReviewsSubtext: {
    fontSize: 14,
    color: '#999',
  },
  reviewsList: {
    gap: 16,
  },
  reviewItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  reviewStars: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  viewAllReviews: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    gap: 4,
  },
  viewAllReviewsText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  priceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  footerPriceLabel: {
    fontSize: 14,
    color: '#666',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});