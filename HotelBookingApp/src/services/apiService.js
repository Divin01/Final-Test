const FAKE_STORE_API = 'https://fakestoreapi.com';
const OPENWEATHER_API = 'https://api.openweathermap.org/data/2.5';
const OPENWEATHER_API_KEY = 'b930a2668c53b3e0b66119a45d6e79be';

export const SOUTH_AFRICAN_CITIES = [
  'Johannesburg',
  'Pretoria', 
  'Cape Town'
];

export const apiService = {
  // Fake Store API 
  getRecommendedHotels: async () => {
    try {
      const response = await fetch(`${FAKE_STORE_API}/products?limit=15`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const products = await response.json();
      
      const recommendedHotels = products.map((product, index) => ({
        id: `recommended-${product.id}`,
        name: product.title.length > 20 ? product.title.substring(0, 20) + '...' : product.title,
        location: 'Various Locations',
        price: Math.round(product.price * 10) + 50,
        rating: (product.rating?.rate || 4) + 1,
        image: { uri: product.image },
        description: product.description,
        isRecommended: true,
        category: product.category
      }));

      return { success: true, data: recommendedHotels };
    } catch (error) {
      return { 
        success: false, 
        error: error.message,
        data: [] 
      };
    }
  },

  getWeather: async (city = 'Johannesburg') => {
    try {
      if (!OPENWEATHER_API_KEY) {
        throw new Error('OpenWeatherMap API key not configured');
      }

      const response = await fetch(
        `${OPENWEATHER_API}/weather?q=${city},ZA&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const weatherData = await response.json();
      
      return { 
        success: true, 
        data: {
          temperature: Math.round(weatherData.main.temp),
          feels_like: Math.round(weatherData.main.feels_like),
          description: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon,
          humidity: weatherData.main.humidity,
          windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert to km/h
          city: weatherData.name,
          country: weatherData.sys.country
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to get weather for ${city}: ${error.message}`
      };
    }
  },

  getAllSACitiesWeather: async () => {
    try {
      const weatherPromises = SOUTH_AFRICAN_CITIES.map(city => 
        apiService.getWeather(city)
      );
      
      const results = await Promise.all(weatherPromises);
      
      const weatherData = {};
      SOUTH_AFRICAN_CITIES.forEach((city, index) => {
        if (results[index].success) {
          weatherData[city] = results[index].data;
        } else {
          weatherData[city] = { error: results[index].error };
        }
      });

      return { success: true, data: weatherData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};