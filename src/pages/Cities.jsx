import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { cityService } from '../services/cityService';
import CityForm from '../components/Cities/CityForm';
import SearchBar from '../components/Common/SearchBar';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ConfirmDialog from '../components/Common/ConfirmDialog';

const Cities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, cityId: null });
  
  const queryClient = useQueryClient();

  const { data: citiesData, isLoading } = useQuery({
    queryKey: ['cities', searchTerm, currentPage],
    queryFn: () => cityService.searchCities({ 
      searchTerm: searchTerm || undefined, 
      page: currentPage, 
      pageSize: 12 
    })
  });

  const createMutation = useMutation({
    mutationFn: cityService.createCity,
    onSuccess: () => {
      queryClient.invalidateQueries(['cities']);
      toast.success('City created successfully');
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => cityService.updateCity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['cities']);
      toast.success('City updated successfully');
      setIsFormOpen(false);
      setEditingCity(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: cityService.deleteCity,
    onSuccess: () => {
      queryClient.invalidateQueries(['cities']);
      toast.success('City deleted successfully');
      setDeleteDialog({ isOpen: false, cityId: null });
    },
  });

  const handleSubmit = (data) => {
    if (editingCity) {
      updateMutation.mutate({ id: editingCity.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (city) => {
    setEditingCity(city);
    setIsFormOpen(true);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Cities Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your monitored cities worldwide
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-lg"
        >
          <FiPlus className="h-5 w-5" />
          <span>Add City</span>
        </button>
      </div>

      <div className="bg-white dark:bg-dark-200 rounded-2xl p-4 shadow-lg">
        <SearchBar 
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by city name or country..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {citiesData?.items.map((city, index) => (
          <motion.div
            key={city.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-lg card-hover"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {city.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">{city.country}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(city)}
                  className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                >
                  <FiEdit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteDialog({ isOpen: true, cityId: city.id })}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Coordinates:</span>
                <span className="font-mono text-gray-700 dark:text-gray-300">
                  {city.latitude}°, {city.longitude}°
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Timezone:</span>
                <span className="text-gray-700 dark:text-gray-300">{city.timezone || 'Auto'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Weather Records:</span>
                <span className="text-gray-700 dark:text-gray-300 font-semibold">
                  {city.weatherRecordsCount}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-100">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${city.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'}`}>
                  {city.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {citiesData && citiesData.totalCount > 0 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 dark:border-dark-100 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-dark-100 transition"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-gray-600 dark:text-gray-400">
            Page {currentPage} of {Math.ceil(citiesData.totalCount / 12)}
          </span>
          <button
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage >= Math.ceil(citiesData.totalCount / 12)}
            className="p-2 rounded-lg border border-gray-300 dark:border-dark-100 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-dark-100 transition"
          >
            <FiChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      <AnimatePresence>
        {isFormOpen && (
          <CityForm
            onSubmit={handleSubmit}
            onClose={() => {
              setIsFormOpen(false);
              setEditingCity(null);
            }}
            initialData={editingCity}
            isLoading={createMutation.isLoading || updateMutation.isLoading}
          />
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, cityId: null })}
        onConfirm={() => deleteMutation.mutate(deleteDialog.cityId)}
        title="Delete City"
        message="Are you sure you want to delete this city? This action cannot be undone."
        isLoading={deleteMutation.isLoading}
      />
    </motion.div>
  );
};

export default Cities;