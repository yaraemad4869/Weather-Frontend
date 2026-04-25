import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUser, 
  FiBell, 
  FiShield, 
  FiDatabase,
  FiGlobe,
  FiSun,
  FiMoon,
  FiSave
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    emailAlerts: true,
    autoRefresh: 5,
    temperatureUnit: 'celsius',
    language: 'en',
    apiEndpoint: 'https://localhost:7087/api'
  });

  const handleSave = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    toast.success('Settings saved successfully');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold gradient-text">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Customize your application preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                <FiUser className="h-5 w-5 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                User Preferences
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Dark Mode</p>
                  <p className="text-sm text-gray-500">Switch between light and dark theme</p>
                </div>
                <button
                  onClick={() => setSettings({...settings, theme: settings.theme === 'dark' ? 'light' : 'dark'})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    settings.theme === 'dark' ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Temperature Unit</p>
                  <p className="text-sm text-gray-500">Choose Celsius or Fahrenheit</p>
                </div>
                <select
                  value={settings.temperatureUnit}
                  onChange={(e) => setSettings({...settings, temperatureUnit: e.target.value})}
                  className="px-3 py-1 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-dark-100 rounded-lg"
                >
                  <option value="celsius">Celsius (°C)</option>
                  <option value="fahrenheit">Fahrenheit (°F)</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Language</p>
                  <p className="text-sm text-gray-500">Select your preferred language</p>
                </div>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({...settings, language: e.target.value})}
                  className="px-3 py-1 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-dark-100 rounded-lg"
                >
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <FiBell className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Notifications
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Push Notifications</p>
                  <p className="text-sm text-gray-500">Receive weather alerts and updates</p>
                </div>
                <button
                  onClick={() => setSettings({...settings, notifications: !settings.notifications})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    settings.notifications ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Email Alerts</p>
                  <p className="text-sm text-gray-500">Get daily weather reports via email</p>
                </div>
                <button
                  onClick={() => setSettings({...settings, emailAlerts: !settings.emailAlerts})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    settings.emailAlerts ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.emailAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Auto Refresh (minutes)</p>
                <select
                  value={settings.autoRefresh}
                  onChange={(e) => setSettings({...settings, autoRefresh: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-dark-100 rounded-lg"
                >
                  <option value={1}>Every minute</option>
                  <option value={5}>Every 5 minutes</option>
                  <option value={15}>Every 15 minutes</option>
                  <option value={30}>Every 30 minutes</option>
                  <option value={60}>Every hour</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <FiShield className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Security
              </h2>
            </div>
            
            <div className="space-y-4">
              <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                Change Password
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 dark:border-dark-100 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-100 transition">
                Two-Factor Authentication
              </button>
              <button className="w-full px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition">
                Delete Account
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <FiDatabase className="h-5 w-5 text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Data Management
              </h2>
            </div>
            
            <div className="space-y-4">
              <button className="w-full px-4 py-2 bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 transition">
                Export All Data
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 transition">
                Clear Cache
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FiGlobe className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                API Configuration
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Endpoint
                </label>
                <input
                  type="text"
                  value={settings.apiEndpoint}
                  onChange={(e) => setSettings({...settings, apiEndpoint: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-dark-100 rounded-lg"
                />
              </div>
              <button
                onClick={handleSave}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                <FiSave className="h-4 w-4" />
                <span>Save Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;