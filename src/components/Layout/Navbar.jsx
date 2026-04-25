import React from 'react';
import { FiMenu, FiBell, FiUser, FiSearch, FiSun, FiMoon } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Navbar = ({ sidebarOpen, setSidebarOpen, darkMode, setDarkMode }) => {
  return (
    <nav className="bg-white dark:bg-dark-200 shadow-lg sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-100 focus:outline-none transition-colors"
            >
              <FiMenu className="h-6 w-6" />
            </button>

            <div className="hidden md:block ml-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search cities..."
                  className="w-96 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-dark-100 dark:bg-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
                <FiSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-100 transition-colors"
            >
              {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;