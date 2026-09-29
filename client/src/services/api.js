import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sportshub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handler
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'An unexpected server error occurred.';
    return Promise.reject(new Error(message));
  }
);

// Service API Methods
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  me: () => API.get('/auth/me')
};

export const sportsAPI = {
  getAll: (params) => API.get('/sports', { params }),
  getById: (id) => API.get(`/sports/${id}`),
  create: (data) => API.post('/sports', data),
  update: (id, data) => API.put(`/sports/${id}`, data),
  delete: (id) => API.delete(`/sports/${id}`)
};

export const teamsAPI = {
  getAll: (params) => API.get('/teams', { params }),
  getById: (id) => API.get(`/teams/${id}`),
  create: (data) => API.post('/teams', data),
  update: (id, data) => API.put(`/teams/${id}`, data),
  delete: (id) => API.delete(`/teams/${id}`)
};

export const playersAPI = {
  getAll: (params) => API.get('/players', { params }),
  getById: (id) => API.get(`/players/${id}`),
  create: (data) => API.post('/players', data),
  update: (id, data) => API.put(`/players/${id}`, data),
  delete: (id) => API.delete(`/players/${id}`)
};

export const coachesAPI = {
  getAll: (params) => API.get('/coaches', { params }),
  getById: (id) => API.get(`/coaches/${id}`),
  create: (data) => API.post('/coaches', data),
  update: (id, data) => API.put(`/coaches/${id}`, data),
  delete: (id) => API.delete(`/coaches/${id}`)
};

export const tournamentsAPI = {
  getAll: (params) => API.get('/tournaments', { params }),
  getById: (id) => API.get(`/tournaments/${id}`),
  create: (data) => API.post('/tournaments', data),
  update: (id, data) => API.put(`/tournaments/${id}`, data),
  delete: (id) => API.delete(`/tournaments/${id}`)
};

export const venuesAPI = {
  getAll: (params) => API.get('/venues', { params }),
  getById: (id) => API.get(`/venues/${id}`),
  create: (data) => API.post('/venues', data),
  update: (id, data) => API.put(`/venues/${id}`, data),
  delete: (id) => API.delete(`/venues/${id}`)
};

export const matchesAPI = {
  getAll: (params) => API.get('/matches', { params }),
  getById: (id) => API.get(`/matches/${id}`),
  create: (data) => API.post('/matches', data),
  update: (id, data) => API.put(`/matches/${id}`, data),
  delete: (id) => API.delete(`/matches/${id}`)
};

export const statsAPI = {
  getDashboard: () => API.get('/stats/dashboard'),
  getPlayerStats: (params) => API.get('/stats/players', { params }),
  createPlayerStat: (data) => API.post('/stats/players', data),
  updatePlayerStat: (id, data) => API.put(`/stats/players/${id}`, data),
  deletePlayerStat: (id) => API.delete(`/stats/players/${id}`)
};

export const usersAPI = {
  getAll: () => API.get('/users'),
  updateRole: (id, role) => API.put(`/users/${id}/role`, { role }),
  delete: (id) => API.delete(`/users/${id}`)
};

export default API;
