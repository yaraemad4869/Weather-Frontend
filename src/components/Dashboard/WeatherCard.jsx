import React from 'react';
import { motion } from 'framer-motion';
import { FiCloud, FiThermometer, FiWind, FiDroplet } from 'react-icons/fi';
import { formatTemperature, formatWindSpeed, formatHumidity, getWeatherIcon } from '../../utils/helpers';

const WeatherCard = ({ city }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold">{city.name}</h3>
          <p className="text-blue-100 text-sm">{city.country}</p>
        </div>
        <div className="text-3xl">{getWeatherIcon('clear')}</div>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="text-center">
          <FiThermometer className="h-5 w-5 mx-auto mb-1" />
          <p className="text-sm">24°C</p>
        </div>
        <div className="text-center">
          <FiWind className="h-5 w-5 mx-auto mb-1" />
          <p className="text-sm">12 km/h</p>
        </div>
        <div className="text-center">
          <FiDroplet className="h-5 w-5 mx-auto mb-1" />
          <p className="text-sm">65%</p>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;