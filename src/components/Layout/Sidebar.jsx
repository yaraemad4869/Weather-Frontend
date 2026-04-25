import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiMapPin, 
  FiCloud, 
  FiBarChart2, 
  FiSettings,
  FiWind,
  FiThermometer,
  FiDroplet
} from 'react-icons/fi';

const navItems = [
  { path: '/', icon: FiHome, label: 'Dashboard', color: 'text-primary-500' },
  { path: '/cities', icon: FiMapPin, label: 'Cities', color: 'text-green-500' },
  { path: '/weather', icon: FiCloud, label: 'Weather', color: 'text-blue-500' },
  { path: '/statistics', icon: FiBarChart2, label: 'Statistics', color: 'text-purple-500' },
  { path: '/settings', icon: FiSettings, label: 'Settings', color: 'text-gray-500' },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed md:relative z-40 w-72 h-full bg-white dark:bg-dark-200 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-primary-600 to-primary-500">
                <div className="flex items-center space-x-2">
                  <FiWind className="h-8 w-8 text-white animate-pulse-slow" />
                  <span className="text-white font-bold text-xl">Wearter</span>
                  <span className="text-white/80 text-sm">Weather Project</span>
                </div>
              </div>
              
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 shadow-md'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-100'
                      }`
                    }
                  >
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                    <span className="font-medium">{item.label}</span>
                    {item.label === 'Statistics' && (
                      <span className="ml-auto text-xs bg-primary-100 dark:bg-primary-900/40 text-primary-600 px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>
              
              <div className="p-4 border-t border-gray-200 dark:border-dark-100">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-4 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiThermometer className="h-5 w-5" />
                    <span className="font-semibold">Weather Stats</span>
                  </div>
                  <div className="text-2xl font-bold">24°C</div>
                  <div className="text-sm opacity-90">Partly Cloudy</div>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="flex items-center">
                      <FiDroplet className="mr-1" /> 65%
                    </span>
                    <span className="flex items-center">
                      <FiWind className="mr-1" /> 12 km/h
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;