import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// Import screens
import ExploreScreen from '../screens/ExploreScreen';
import RecommendedHotelsScreen from '../screens/RecommendedHotelsScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HotelDetailsScreen from '../screens/HotelDetailsScreen';
import BookingScreen from '../screens/BookingScreen';
import BookingSuccessScreen from '../screens/BookingSuccessScreen';
import AddReviewScreen from '../screens/AddReviewScreen';

const Tab = createBottomTabNavigator();
const ExploreStack = createStackNavigator();
const BookingsStack = createStackNavigator();

function ExploreStackNavigator() {
  return (
    <ExploreStack.Navigator screenOptions={{ headerShown: false }}>
      <ExploreStack.Screen name="ExploreMain" component={ExploreScreen} />
      <ExploreStack.Screen name="HotelDetails" component={HotelDetailsScreen} />
      <ExploreStack.Screen name="Booking" component={BookingScreen} />
      <ExploreStack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
      <ExploreStack.Screen name="AddReview" component={AddReviewScreen} />
    </ExploreStack.Navigator>
  );
}

function BookingsStackNavigator() {
  return (
    <BookingsStack.Navigator screenOptions={{ headerShown: false }}>
      <BookingsStack.Screen name="BookingsMain" component={MyBookingsScreen} />
      <BookingsStack.Screen name="HotelDetails" component={HotelDetailsScreen} />
    </BookingsStack.Navigator>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#999999',
      }}
    >
      <Tab.Screen 
        name="ExploreTab" 
        component={ExploreStackNavigator}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "search" : "search-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="DealsTab" 
        component={RecommendedHotelsScreen}
        options={{
          tabBarLabel: 'Deals',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "pricetag" : "pricetag-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="BookingsTab" 
        component={BookingsStackNavigator}
        options={{
          tabBarLabel: 'My Bookings',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}