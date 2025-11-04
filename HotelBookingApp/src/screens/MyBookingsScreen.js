// src/screens/MyBookingsScreen.js - UPDATED
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar
} from 'react-native';
import { useAuth } from '../utils/AuthContext';
import { bookingService } from '../services/firebaseService';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function MyBookingsScreen({ navigation }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      const unsubscribe = loadBookings();
      return unsubscribe;
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadBookings = () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribe = bookingService.getUserBookings(user.uid, (result) => {
      setLoading(false);
      setRefreshing(false);
      if (result.success) {
        setBookings(result.data);
      } else {
        console.error('Error loading bookings:', result.error);
        setBookings([]);
      }
    });

    return unsubscribe;
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderBookingItem = ({ item }) => (
    <TouchableOpacity style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <View style={styles.statusBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.statusText}>Confirmed</Text>
        </View>
        <Text style={styles.bookingId}>#{item.id.slice(-6).toUpperCase()}</Text>
      </View>

      <View style={styles.bookingContent}>
        <View style={styles.bookingInfo}>
          <Text style={styles.hotelName} numberOfLines={2}>{item.hotelName}</Text>
          
          <View style={styles.bookingDetail}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              {formatDate(item.checkIn)} - {formatDate(item.checkOut)}
            </Text>
          </View>

          <View style={styles.bookingDetail}>
            <Ionicons name="moon-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              {item.nights} night{item.nights !== 1 ? 's' : ''}
            </Text>
          </View>

          <View style={styles.bookingDetail}>
            <Ionicons name="home-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              {item.rooms} room{item.rooms !== 1 ? 's' : ''}
            </Text>
          </View>

          {item.guests && (
            <View style={styles.bookingDetail}>
              <Ionicons name="people-outline" size={16} color="#666" />
              <Text style={styles.detailText}>
                {item.guests} guest{item.guests !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.priceSection}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>${item.totalCost}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading your bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Bookings</Text>
          <Text style={styles.headerSubtitle}>
            {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
          </Text>
        </View>
      </View>

      {bookings.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={80} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No bookings yet</Text>
          <Text style={styles.emptyStateText}>
            Start exploring amazing hotels and book your first stay!
          </Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => navigation.navigate('ExploreTab')}
          >
            <Ionicons name="search" size={18} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.exploreButtonText}>Explore Hotels</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#000']} />
          }
        />
      )}
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
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
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
    elevation: 5,
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
  listContent: {
    padding: 16,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 4,
  },
  bookingId: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  bookingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookingInfo: {
    flex: 1,
  },
  hotelName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  bookingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  priceSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 12,
  },
  totalLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  exploreButton: {
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 8,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});