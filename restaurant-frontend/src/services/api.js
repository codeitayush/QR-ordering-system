import axios from 'axios'

// 🔥 IMPORTANT: use your current IP (not localhost)
const API_BASE_URL = 'http://172.20.10.4:5000/api'

console.log("API URL:", API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 🔒 attach token ONLY if exists (admin)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const menuAPI = {
  getMenu: () => api.get('/menu'),
  createMenuItem: (data) => api.post('/menu', data),
  updateMenuItem: (id, data) => api.put(`/menu/${id}`, data),
  deleteMenuItem: (id) => api.delete(`/menu/${id}`)
}

export const orderAPI = {
  createOrder: (data) => api.post('/orders', data), // ✅ PUBLIC
  getAllOrders: () => api.get('/orders'), // 🔒 ADMIN
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }) // 🔒 ADMIN
}

export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials)
}

export default api