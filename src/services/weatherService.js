import api from './api';

export const weatherService = {
  getCurrentWeather: async (cityId) => {
    try {
      const response = await api.get(`/weather/current/${cityId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  },

  getForecast: async (cityId, days = 5) => {
    try {
      // Make sure the URL matches your backend route exactly
      const response = await api.get(`/weather/forecast/${cityId}`, {
        params: { days: days }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast:', error);
      console.error('Request URL:', `/weather/forecast/${cityId}?days=${days}`);
      throw error;
    }
  },

  getHistoricalWeather: async (cityId, startDate, endDate) => {
    try {
      const response = await api.get(`/weather/historical/${cityId}`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching historical weather:', error);
      throw error;
    }
  },

  getStatistics: async (cityId, startDate, endDate) => {
    try {
      const response = await api.get(`/weather/statistics/${cityId}`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },

  fetchWeatherData: async (cityId) => {
    try {
      const response = await api.post(`/weather/fetch/${cityId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  },
};