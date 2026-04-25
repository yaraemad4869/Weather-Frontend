import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Select from 'react-select';
import {
  FiCloud,
  FiThermometer,
  FiWind,
  FiDroplet,
  FiSun,
  FiRefreshCw,
  FiMapPin,
  FiAlertCircle
} from 'react-icons/fi';
import { format } from 'date-fns';
import { cityService } from '../services/cityService';
import { weatherService } from '../services/weatherService';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { formatTemperature, formatWindSpeed, formatHumidity, formatPressure, getWeatherIcon } from '../utils/helpers';
import toast from 'react-hot-toast';

const Weather = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [forecastDays, setForecastDays] = useState(5);
  const queryClient = useQueryClient();

  // First, get all cities
  const { data: cities, isLoading: citiesLoading, error: citiesError } = useQuery({
    queryKey: ['cities'],
    queryFn: cityService.getAllCities,
    retry: 1
  });

  // Only fetch current weather when a city is selected
  const {
    data: currentWeather,
    isLoading: currentLoading,
    error: currentError,
    refetch: refetchCurrent
  } = useQuery({
    queryKey: ['current-weather', selectedCity?.id],
    queryFn: () => {
      if (!selectedCity?.id) return null;
      return weatherService.getCurrentWeather(selectedCity.id);
    },
    enabled: !!selectedCity?.id,
    retry: 1,
  });

  // Only fetch forecast when a city is selected
  const {
    data: forecast,
    isLoading: forecastLoading,
    error: forecastError
  } = useQuery({
    queryKey: ['forecast', selectedCity?.id, forecastDays],
    queryFn: () => {
      if (!selectedCity?.id) return null;
      return weatherService.getForecast(selectedCity.id, forecastDays);
    },
    enabled: !!selectedCity?.id,
    retry: 1,
  });

  const fetchMutation = useMutation({
    mutationFn: (cityId) => weatherService.fetchWeatherData(cityId),
    onSuccess: () => {
      toast.success('Weather data fetched successfully');
      // Refetch both current and forecast data
      refetchCurrent();
      queryClient.invalidateQueries(['forecast', selectedCity?.id]);
    },
    onError: (error) => {
      console.error('Fetch error details:', error);
      toast.error(`Failed to fetch weather data: ${error.response?.data?.message || error.message}`);
    }
  });

  const handleFetchWeather = () => {
    if (selectedCity) {
      fetchMutation.mutate(selectedCity.id);
    }
  };

  const cityOptions = cities?.map(city => ({
    value: city.id,
    label: `${city.name}, ${city.country}`,
    city: city
  }));

  if (citiesLoading) return <LoadingSpinner />;
  if (citiesError) {
    return (
      <div className="text-center py-12">
        <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">Failed to load cities. Please check if the API is running.</p>
        <p className="text-sm text-gray-500 mt-2">API URL: https://localhost:7007/api/cities</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Weather Monitor</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time weather data for your monitored cities
          </p>
        </div>
        {selectedCity && (
          <button
            onClick={handleFetchWeather}
            disabled={fetchMutation.isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-lg disabled:opacity-50"
          >
            {fetchMutation.isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <FiRefreshCw className="h-5 w-5" />
            )}
            <span>{fetchMutation.isLoading ? 'Fetching...' : 'Fetch Latest'}</span>
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select City
        </label>
        <Select
          options={cityOptions}
          onChange={(option) => {
            setSelectedCity(option?.city);
            // Clear any previous errors when selecting new city
            queryClient.resetQueries(['current-weather']);
            queryClient.resetQueries(['forecast']);
          }}
          placeholder="Search for a city..."
          className="react-select-container"
          classNamePrefix="react-select"
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: '#0ea5e9',
            },
          })}
        />
      </div>

      {selectedCity && (
        <>
          {/* Current Weather Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 shadow-2xl text-white"
          >
            {currentLoading ? (
              <LoadingSpinner />
            ) : currentError ? (
              <div className="text-center py-8">
                <FiAlertCircle className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
                <h3 className="text-xl font-semibold mb-2">Unable to load weather data</h3>
                <p className="text-blue-100 mb-4">
                  {currentError.response?.status === 404
                    ? 'No weather data available for this city yet. Click "Fetch Latest" to get data.'
                    : `Error: ${currentError.message}`}
                </p>
                <button
                  onClick={handleFetchWeather}
                  disabled={fetchMutation.isLoading}
                  className="px-6 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
                >
                  Fetch Weather Data
                </button>
              </div>
            ) : currentWeather ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FiMapPin className="h-6 w-6" />
                    <h2 className="text-3xl font-bold">{currentWeather.cityName}</h2>
                  </div>
                  <p className="text-blue-100">{currentWeather.country}</p>
                  <div className="flex items-center space-x-2 mt-4">
                    <span className="text-6xl">{getWeatherIcon(currentWeather.weatherCondition)}</span>
                    <span className="text-2xl">{currentWeather.weatherCondition}</span>
                  </div>
                  <p className="text-blue-100 text-sm mt-2">
                    Last updated: {format(new Date(currentWeather.timestamp), 'PPpp')}
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <FiThermometer className="h-12 w-12" />
                    <span className="text-8xl font-bold">{Math.round(currentWeather.temperature)}°</span>
                  </div>
                  <p className="text-blue-100 mt-2">Feels like {Math.round(currentWeather.feelsLike)}°</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <FiDroplet className="h-5 w-5" />
                      <div>
                        <p className="text-sm opacity-90">Humidity</p>
                        <p className="text-2xl font-semibold">{formatHumidity(currentWeather.humidity)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <FiWind className="h-5 w-5" />
                      <div>
                        <p className="text-sm opacity-90">Wind Speed</p>
                        <p className="text-2xl font-semibold">{formatWindSpeed(currentWeather.windSpeed)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <FiSun className="h-5 w-5" />
                      <div>
                        <p className="text-sm opacity-90">Pressure</p>
                        <p className="text-2xl font-semibold">{formatPressure(currentWeather.pressure)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <FiCloud className="h-5 w-5" />
                      <div>
                        <p className="text-sm opacity-90">Precipitation</p>
                        <p className="text-2xl font-semibold">{currentWeather.precipitation} mm</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-xl">No weather data available for {selectedCity.name}</p>
                <button
                  onClick={handleFetchWeather}
                  disabled={fetchMutation.isLoading}
                  className="mt-4 px-6 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
                >
                  {fetchMutation.isLoading ? 'Fetching...' : 'Fetch Weather Data'}
                </button>
              </div>
            )}
          </motion.div>

          {/* Forecast Section */}
          {currentWeather && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {forecastDays}-Day Forecast
                </h2>
                <select
                  value={forecastDays}
                  onChange={(e) => setForecastDays(Number(e.target.value))}
                  className="px-3 py-2 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-dark-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={3}>3 Days</option>
                  <option value={5}>5 Days</option>
                  <option value={7}>7 Days</option>
                  <option value={10}>10 Days</option>
                </select>
              </div>

              {forecastLoading ? (
                <LoadingSpinner />
              ) : forecastError ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Unable to load forecast data.</p>
                  <p className="text-sm mt-2">Error: {forecastError.message}</p>
                </div>
              ) : forecast && forecast.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {forecast.slice(0, forecastDays).map((day, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-dark-100 dark:to-dark-100 rounded-xl p-4 text-center"
                    >
                      <p className="font-semibold text-gray-700 dark:text-gray-300">
                        {format(new Date(day.timestamp), 'EEE, MMM d')}
                      </p>
                      <div className="text-4xl my-3">{getWeatherIcon(day.weatherCondition)}</div>
                      <p className="text-2xl font-bold text-gray-800 dark:text-white">
                        {Math.round(day.temperature)}°
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {day.weatherCondition}
                      </p>
                      <div className="flex justify-between text-xs mt-3 pt-3 border-t border-gray-200 dark:border-dark-100">
                        <span className="flex items-center text-gray-600 dark:text-gray-400">
                          <FiDroplet className="mr-1" /> {day.humidity}%
                        </span>
                        <span className="flex items-center text-gray-600 dark:text-gray-400">
                          <FiWind className="mr-1" /> {day.windSpeed}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No forecast data available. Please fetch weather data first.
                </div>
              )}
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Weather;