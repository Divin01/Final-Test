import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { apiService } from '../services/apiService';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function WeatherWidget() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState('Johannesburg');

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiService.getAllSACitiesWeather();
      if (result.success) {
        setWeatherData(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load weather data');
      console.error('Weather loading error:', err);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#000" />
        <Text style={styles.loadingText}>Loading weather...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="cloud-offline" size={32} color="#ccc" />
        <Text style={styles.errorText}>Weather unavailable</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadWeatherData}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!weatherData) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {Object.entries(weatherData).map(([city, data]) => {
          if (data.error) return null;
          
          return (
            <View key={city} style={styles.weatherCard}>
              <Text style={styles.cityName}>{city}</Text>
              <View style={styles.weatherMain}>
                <Ionicons 
                  name={getWeatherIcon(data.icon)} 
                  size={32} 
                  color="#000" 
                />
                <Text style={styles.temperature}>{data.temperature}°C</Text>
              </View>
              <Text style={styles.description}>
                {data.description}
              </Text>
              <View style={styles.weatherDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="water-outline" size={14} color="#666" />
                  <Text style={styles.detailText}>{data.humidity}%</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="speedometer-outline" size={14} color="#666" />
                  <Text style={styles.detailText}>{data.windSpeed} km/h</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  scrollContent: {
    paddingHorizontal: 4,
    gap: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  weatherCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  temperature: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  description: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 11,
    color: '#666',
  },
});