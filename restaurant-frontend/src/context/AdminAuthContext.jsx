import { createContext, useContext, useState, useEffect } from 'react'
import { adminAPI } from '../services/api'

const AdminAuthContext = createContext()

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setAdmin({ token })
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const response = await adminAPI.login(credentials)
      const { token, admin: adminData } = response.data.data
      
      localStorage.setItem('token', token)
      setAdmin({ ...adminData, token })
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setAdmin(null)
  }

  const value = {
    admin,
    login,
    logout,
    loading,
    isAuthenticated: !!admin
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
