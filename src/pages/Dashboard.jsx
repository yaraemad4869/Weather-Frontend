import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  FiMapPin, 
  FiCloud, 
  FiDatabase, 
  FiActivity,
  FiTrendingUp,
  FiDroplet
} from 'react-icons/fi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { cityService } from '../services/cityService';
import StatisticsCard from '../components/Dashboard/StatisticsCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { data: cities, isLoading: citiesLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: cityService.getAllCities
  });

  const { data: summary } = useQuery({
    queryKey: ['cities-summary'],
    queryFn: cityService.getSummary
  });

  const stats = [
    {
      title: 'Total Cities',
      value: summary?.totalCities || 0,
      icon: FiMapPin,
      color: 'from-blue-500 to-cyan-500',
      change: '+12%',
      changeType: 'up'
    },
    {
      title: 'Weather Records',
      value: summary?.totalWeatherRecords || 0,
      icon: FiDatabase,
      color: 'from-purple-500 to-pink-500',
      change: '+23%',
      changeType: 'up'
    },
    {
      title: 'Active Cities',
      value: summary?.activeCities || 0,
      icon: FiActivity,
      color: 'from-green-500 to-emerald-500',
      change: '+5%',
      changeType: 'up'
    },
    {
      title: 'Countries',
      value: summary?.countriesCount || 0,
      icon: FiCloud,
      color: 'from-orange-500 to-red-500',
      change: '+3',
      changeType: 'up'
    },
  ];

  const temperatureData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Average Temperature (°C)',
        data: [12, 14, 18, 22, 26, 30, 32, 31, 28, 23, 18, 14],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const conditionData = {
    labels: ['Clear', 'Clouds', 'Rain', 'Snow', 'Mist'],
    datasets: [
      {
        data: [45, 25, 20, 5, 5],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(107, 114, 128, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(255, 255, 255, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#9ca3af',
        },
      },
    },
  };

  if (citiesLoading) return <LoadingSpinner />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's your weather overview
          </p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-lg">
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatisticsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Temperature Trends
            </h2>
            <FiTrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-80">
            <Line data={temperatureData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Weather Conditions Distribution
            </h2>
            <FiDroplet className="h-5 w-5 text-blue-500" />
          </div>
          <div className="h-80 flex items-center justify-center">
            <Doughnut data={conditionData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      <div className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {cities?.slice(0, 5).map((city, index) => (
            <div key={city.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-100 rounded-lg">
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">{city.name}</p>
                <p className="text-sm text-gray-500">{city.country}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{city.weatherRecordsCount} records</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${city.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {city.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;