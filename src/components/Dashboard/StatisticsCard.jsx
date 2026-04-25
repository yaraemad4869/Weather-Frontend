import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const StatisticsCard = ({ title, value, icon: Icon, color, change, changeType }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change && (
            <div className="flex items-center mt-2">
              {changeType === 'up' ? (
                <FiTrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <FiTrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${changeType === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`bg-gradient-to-r ${color} p-4 rounded-2xl`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatisticsCard;