import api from './api';

export const cityService = {
  getAllCities: async () => {
    const response = await api.get('/cities');
    return response.data;
  },

  getCityById: async (id) => {
    const response = await api.get(`/cities/${id}`);
    return response.data;
  },

  createCity: async (cityData) => {
    const response = await api.post('/cities', cityData);
    return response.data;
  },

  updateCity: async (id, cityData) => {
    const response = await api.put(`/cities/${id}`, cityData);
    return response.data;
  },

  deleteCity: async (id) => {
    await api.delete(`/cities/${id}`);
  },

  searchCities: async (params) => {
    const response = await api.get('/cities/search', { params });
    return response.data;
  },

  getCountries: async () => {
    const response = await api.get('/cities/countries');
    return response.data;
  },

  bulkImport: async (cities) => {
    const response = await api.post('/cities/bulk', cities);
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get('/cities/statistics/summary');
    return response.data;
  },
};