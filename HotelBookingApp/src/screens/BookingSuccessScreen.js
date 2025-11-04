// src/screens/BookingSuccessScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function BookingSuccessScreen({ route, navigation }) {
  const { booking } = route.params;

  const handleViewBookings = () => {
    // Navigate to the BookingsTab in the bottom tab navigator
    navigation.navigate('BookingsTab');
  };

  const handleBrowseHotels = () => {
    // Navigate back to Explore tab and reset the stack
    navigation.reset({
      index: 0,
      routes: [{ name: 'ExploreTab' }],
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f8ff" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Success Icon */}
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={60} color="#fff" />
        </View>

        {/* Success Message */}
        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Text style={styles.successMessage}>
          Your booking has been successfully confirmed. You will receive a confirmation email shortly.
        </Text>

        {/* Booking Details */}
        <View style={styles.bookingDetails}>
          <View style={styles.detailsHeader}>
            <Ionicons name="receipt-outline" size={24} color="#000" />
            <Text style={styles.detailsTitle}>Booking Details</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="business-outline" size={16} color="#666" />
              <Text style={styles.detailLabel}>Hotel</Text>
            </View>
            <Text style={styles.detailValue} numberOfLines={2}>{booking.hotelName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.detailLabel}>Check-in</Text>
            </View>
            <Text style={styles.detailValue}>{booking.checkIn}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.detailLabel}>Check-out</Text>
            </View>
            <Text style={styles.detailValue}>{booking.checkOut}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="moon-outline" size={16} color="#666" />
              <Text style={styles.detailLabel}>Duration</Text>
            </View>
            <Text style={styles.detailValue}>{booking.nights} night{booking.nights !== 1 ? 's' : ''}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="home-outline" size={16} color="#666" />
              <Text style={styles.detailLabel}>Rooms</Text>
            </View>
            <Text style={styles.detailValue}>{booking.rooms}</Text>
          </View>
          
          <View style={[styles.detailRow, styles.totalRow]}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="card-outline" size={16} color="#000" />
              <Text style={styles.totalLabel}>Total Amount</Text>
            </View>
            <Text style={styles.totalAmount}>${booking.totalCost}</Text>
          </View>
        </View>

        {/* Booking ID */}
        <View style={styles.bookingId}>
          <Ionicons name="qr-code-outline" size={20} color="#666" />
          <View style={styles.bookingIdText}>
            <Text style={styles.bookingIdLabel}>Booking Reference</Text>
            <Text style={styles.bookingIdValue}>#{booking.id.slice(-8).toUpperCase()}</Text>
          </View>
        </View>

        {/* Additional Info */}
        <View style={styles.additionalInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={20} color="#4CAF50" />
            <Text style={styles.infoText}>Free cancellation until 24 hours before check-in</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="help-circle-outline" size={20} color="#2196F3" />
            <Text style={styles.infoText}>Need help? Contact our support team</Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleBrowseHotels}
        >
          <Ionicons name="search" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Browse More Hotels</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleViewBookings}
        >
          <Ionicons name="calendar" size={20} color="#000" />
          <Text style={styles.secondaryButtonText}>View My Bookings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  bookingDetails: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  totalRow: {
    borderBottomWidth: 0,
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 8,
  },
  detailValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: 8,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  bookingId: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bookingIdText: {
    marginLeft: 12,
  },
  bookingIdLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  bookingIdValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  additionalInfo: {
    width: '100%',
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});