import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  RefreshControl
} from 'react-native';
import { apiService } from '../services/apiService';
import WeatherWidget from '../components/WeatherWidget';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function RecommendedHotelsScreen({ navigation }) {
  const [recommendedHotels, setRecommendedHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecommendedData();
  }, []);

  const loadRecommendedData = async () => {
    setLoading(true);
    setError(null);

    try {
      const hotelsResult = await apiService.getRecommendedHotels();
      
      if (hotelsResult.success) {
        setRecommendedHotels(hotelsResult.data);
      } else {
        setError('Failed to load recommended hotels');
      }
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading recommended data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRecommendedData();
  };

  const handleHotelPress = (hotel) => {
    Alert.alert(
      'External Recommendation',
      `This is a recommended hotel from our partners.\n\n${hotel.name}\n\nIn a production app, this would redirect to booking details.`,
      [
        { text: 'OK', style: 'cancel' }
      ]
    );
  };

  const renderHotelCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.hotelCard}
      onPress={() => handleHotelPress(item)}
    >
      <Image 
        source={item.image} 
        style={styles.hotelImage}
        defaultSource={require('../../assets/06-Explore Page/image-1.png')}
      />
      
      <View style={styles.dealBadge}>
        <Ionicons name="pricetag" size={12} color="#fff" />
        <Text style={styles.dealText}>Special Deal</Text>
      </View>

      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.hotelCategory} numberOfLines={1}>{item.category}</Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.rating}>{item.rating.toFixed(1)}/5</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${item.price}</Text>
          <Text style={styles.priceLabel}>/night</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading deals...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadRecommendedData}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Special Deals</Text>
            <Text style={styles.headerSubtitle}>Limited time offers</Text>
          </View>
        </View>

        {/* Weather Widget Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="partly-sunny" size={24} color="#000" />
            <Text style={styles.sectionTitle}>Weather in South Africa</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Check current conditions before you book
          </Text>
          <WeatherWidget />
        </View>

        {/* Recommended Hotels */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="pricetag" size={24} color="#000" />
            <Text style={styles.sectionTitle}>Recommended For You</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Curated deals from our partners
          </Text>

          <FlatList
            data={recommendedHotels}
            renderItem={renderHotelCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.hotelsList}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  hotelsList: {
    paddingTop: 8,
  },
  hotelCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  hotelImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  dealBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dealText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  hotelInfo: {
    padding: 12,
  },
  hotelName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  hotelCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 4,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
  },
});