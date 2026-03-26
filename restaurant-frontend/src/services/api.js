import axios from 'axios'

// 🔥 IMPORTANT: Use Vite environment variable for deployed backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

console.log("API URL:", API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000 // 60 second timeout for Render cold starts
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
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  getAnalytics: () => api.get('/orders/analytics')
}

export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials)
}

export default api