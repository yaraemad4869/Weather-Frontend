import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Select from 'react-select';
import {
  FiBarChart2,
  FiCalendar,
  FiDownload,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiAlertCircle,
  FiRefreshCw
} from 'react-icons/fi';
import { Line, Bar } from 'react-chartjs-2';
import { format, subDays, subMonths } from 'date-fns';
import { cityService } from '../services/cityService';
import { weatherService } from '../services/weatherService';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { formatTemperature, formatHumidity } from '../utils/helpers';
import toast from 'react-hot-toast';

const Statistics = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [period, setPeriod] = useState('week');
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 7),
    endDate: new Date()
  });

  const { data: cities, isLoading: citiesLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: cityService.getAllCities
  });

  const {
    data: statistics,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['statistics', selectedCity?.id, dateRange],
    queryFn: () => weatherService.getStatistics(
      selectedCity.id,
      format(dateRange.startDate, 'yyyy-MM-dd'),
      format(dateRange.endDate, 'yyyy-MM-dd')
    ),
    enabled: !!selectedCity,
  });

  const {
    data: historical,
    isLoading: historicalLoading,
    error: historicalError,
    refetch: refetchHistorical
  } = useQuery({
    queryKey: ['historical', selectedCity?.id, dateRange],
    queryFn: () => weatherService.getHistoricalWeather(
      selectedCity.id,
      format(dateRange.startDate, 'yyyy-MM-dd'),
      format(dateRange.endDate, 'yyyy-MM-dd')
    ),
    enabled: !!selectedCity,
  });

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    const now = new Date();
    switch (newPeriod) {
      case 'week':
        setDateRange({ startDate: subDays(now, 7), endDate: now });
        break;
      case 'month':
        setDateRange({ startDate: subDays(now, 30), endDate: now });
        break;
      case 'quarter':
        setDateRange({ startDate: subMonths(now, 3), endDate: now });
        break;
      default:
        break;
    }
  };

  const handleRefresh = () => {
    if (selectedCity) {
      refetchStats();
      refetchHistorical();
      toast.success('Refreshing statistics...');
    }
  };

  const exportData = () => {
    if (!historical || historical.length === 0) {
      toast.error('No data to export');
      return;
    }
    const csv = convertToCSV(historical);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weather_data_${selectedCity?.name}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    toast.success('Data exported successfully');
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    const headers = ['Date', 'Temperature (°C)', 'Feels Like (°C)', 'Humidity (%)', 'Wind Speed (km/h)', 'Precipitation (mm)'];
    const rows = data.map(item => [
      format(new Date(item.timestamp), 'yyyy-MM-dd HH:mm'),
      item.temperature,
      item.feelsLike,
      item.humidity,
      item.windSpeed,
      item.precipitation
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const cityOptions = cities?.map(city => ({
    value: city.id,
    label: `${city.name}, ${city.country}`,
    city: city
  }));

  const temperatureChartData = {
    labels: historical?.map(h => format(new Date(h.timestamp), 'MMM dd')) || [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: historical?.map(h => h.temperature) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Feels Like (°C)',
        data: historical?.map(h => h.feelsLike) || [],
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const humidityChartData = {
    labels: historical?.map(h => format(new Date(h.timestamp), 'MMM dd')) || [],
    datasets: [
      {
        label: 'Humidity (%)',
        data: historical?.map(h => h.humidity) || [],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#9ca3af',
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (citiesLoading) return <LoadingSpinner />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Weather Statistics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Advanced analytics and historical data insights
          </p>
        </div>
        {selectedCity && (
          <div className="flex space-x-2">
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition shadow-lg"
            >
              <FiRefreshCw className="h-5 w-5" />
              <span>Refresh</span>
            </button>
            {historical && historical.length > 0 && (
              <button
                onClick={exportData}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-lg"
              >
                <FiDownload className="h-5 w-5" />
                <span>Export CSV</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-lg">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select City
          </label>
          <Select
            options={cityOptions}
            onChange={(option) => setSelectedCity(option?.city)}
            placeholder="Search for a city..."
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        <div className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-lg">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Time Period
          </label>
          <div className="flex space-x-2">
            {['week', 'month', 'quarter'].map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                className={`flex-1 px-4 py-2 rounded-lg transition ${period === p
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>{format(dateRange.startDate, 'MMM dd, yyyy')}</span>
            <FiCalendar className="h-4 w-4" />
            <span>{format(dateRange.endDate, 'MMM dd, yyyy')}</span>
          </div>
        </div>
      </div>

      {selectedCity && (
        <>
          {statsLoading ? (
            <LoadingSpinner />
          ) : statsError ? (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8 text-center">
              <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
                Error Loading Statistics
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {statsError.response?.data?.message || statsError.message}
              </p>
            </div>
          ) : statistics ? (
            <>
              {/* Show warning if no data */}
              {statistics.totalRecords === 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-4 text-center">
                  <p className="text-yellow-700 dark:text-yellow-400">
                    No weather data available for the selected period.
                    Please go to the Weather page and fetch data for this city first.
                  </p>
                </div>
              )}

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Average Temperature</p>
                      <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                        {formatTemperature(statistics.averageTemperature)}
                      </p>
                    </div>
                    <div className="bg-blue-500/20 p-3 rounded-full">
                      <FiTrendingUp className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Max Temperature</p>
                      <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                        {formatTemperature(statistics.maxTemperature)}
                      </p>
                    </div>
                    <div className="bg-red-500/20 p-3 rounded-full">
                      <FiTrendingUp className="h-6 w-6 text-red-500" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Min Temperature</p>
                      <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                        {formatTemperature(statistics.minTemperature)}
                      </p>
                    </div>
                    <div className="bg-green-500/20 p-3 rounded-full">
                      <FiTrendingDown className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Average Humidity</p>
                      <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                        {formatHumidity(statistics.averageHumidity)}
                      </p>
                    </div>
                    <div className="bg-purple-500/20 p-3 rounded-full">
                      <FiActivity className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Charts - Update this section */}
              {historical && historical.length > 0 ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-lg"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Temperature Trends
                      </h2>
                      {historical.length === 1 && (
                        <span className="text-xs text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded">
                          Need more data for trend line
                        </span>
                      )}
                    </div>
                    <div className="h-96">
                      {historical.length >= 2 ? (
                        <Line data={temperatureChartData} options={chartOptions} />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <FiBarChart2 className="h-16 w-16 text-gray-300 mb-4" />
                          <p className="text-gray-500 text-center">
                            Not enough data points for trend line.<br />
                            <span className="text-sm">Fetch more weather data to see temperature trends.</span>
                          </p>
                          {historical.length === 1 && (
                            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <p className="text-sm text-blue-600 dark:text-blue-400">
                                Current temperature: <strong>{historical[0]?.temperature}°C</strong>
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Recorded on: {format(new Date(historical[0]?.timestamp), 'PPPP')}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-lg"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Humidity Analysis
                      </h2>
                      {historical.length === 1 && (
                        <span className="text-xs text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded">
                          Need more data for analysis
                        </span>
                      )}
                    </div>
                    <div className="h-96">
                      {historical.length >= 2 ? (
                        <Bar data={humidityChartData} options={chartOptions} />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <FiBarChart2 className="h-16 w-16 text-gray-300 mb-4" />
                          <p className="text-gray-500 text-center">
                            Not enough data points for chart.<br />
                            <span className="text-sm">Fetch more weather data to see humidity trends.</span>
                          </p>
                          {historical.length === 1 && (
                            <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                              <p className="text-sm text-purple-600 dark:text-purple-400">
                                Current humidity: <strong>{historical[0]?.humidity}%</strong>
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Recorded on: {format(new Date(historical[0]?.timestamp), 'PPPP')}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </>
              ) : (
                <div className="bg-white dark:bg-dark-200 rounded-2xl p-12 text-center">
                  <FiBarChart2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    No Chart Data Available
                  </h3>
                  <p className="text-gray-500">
                    Please fetch weather data for this city first using the Weather page.
                  </p>
                </div>
              )}

              {/* Summary Statistics */}
              {statistics.totalRecords > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-lg"
                >
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Summary Statistics
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-dark-100 rounded-lg">
                      <p className="text-sm text-gray-500">Total Records</p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-white">{statistics.totalRecords}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-dark-100 rounded-lg">
                      <p className="text-sm text-gray-500">Most Common Condition</p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-white">{statistics.mostCommonCondition || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-dark-100 rounded-lg">
                      <p className="text-sm text-gray-500">Total Precipitation</p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-white">{statistics.totalPrecipitation.toFixed(2)} mm</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-dark-100 rounded-lg">
                      <p className="text-sm text-gray-500">Average Wind Speed</p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-white">{statistics.averageWindSpeed.toFixed(1)} km/h</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Add after the summary statistics section */}
              {statistics.totalRecords > 0 && statistics.totalRecords < 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 text-center border border-blue-200 dark:border-blue-800"
                >
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400 mb-2">
                    Limited Data Available
                  </h3>
                  <p className="text-blue-600 dark:text-blue-300 mb-4">
                    You only have {statistics.totalRecords} weather record(s). For better insights and charts, fetch more weather data.
                  </p>
                  <button
                    onClick={() => window.location.href = '/weather'}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
                  >
                    Go to Weather Page to Fetch More Data
                  </button>
                </motion.div>
              )}
            </>
          ) : null}
        </>
      )}

      {!selectedCity && (
        <div className="bg-white dark:bg-dark-200 rounded-2xl p-12 text-center">
          <FiBarChart2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Select a City to View Statistics
          </h3>
          <p className="text-gray-500">
            Choose a city from the dropdown above to see weather statistics and charts.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Statistics;