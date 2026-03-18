import axios from 'axios'

// 🔥 IMPORTANT: Replace with your actual local IP for mobile access
// Format: http://YOUR_LOCAL_IP:5000/api
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log("API URL:", API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
})

// 🔒 attach token ONLY if exists (admin)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Handle network errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    
    if (error.code === 'NETWORK_ERROR') {
      console.error('Network error - check if backend is running and accessible')
    }
    
    return Promise.reject(error)
  }
)

export const menuAPI = {
  getMenu: () => api.get('/menu'),
  createMenuItem: (data) => api.post('/menu', data),
  updateMenuItem: (id, data) => api.put(`/menu/${id}`, data),
  deleteMenuItem: (id) => api.delete(`/menu/${id}`)
}

export const orderAPI = {
  createOrder: (data) => api.post('/orders', data),
  getAllOrders: () => api.get('/orders'),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status })
}

export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials)
}

export default api