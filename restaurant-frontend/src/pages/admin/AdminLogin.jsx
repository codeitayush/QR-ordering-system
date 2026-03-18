import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { theme } from '../../theme/colors'

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAdminAuth()

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(credentials)
    
    if (result.success) {
      navigate('/admin/dashboard')
    } else {
      setError(result.message)
    }
    
    setLoading(false)
  }

  return (
    <div className="admin-login">
      <div className="login-container">
        <h1>Admin Login</h1>
        <p>Restaurant Ordering System</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              placeholder="Enter username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            disabled={loading}
            className="login-btn"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
      
      <style jsx>{`
        .admin-login {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%);
          padding: 1rem;
        }
        
        .login-container {
          background: ${theme.cardBackground};
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }
        
        .login-container h1 {
          color: ${theme.text};
          text-align: center;
          margin-bottom: 0.5rem;
          font-size: 2rem;
        }
        
        .login-container > p {
          color: ${theme.text};
          opacity: 0.7;
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        .form-group label {
          color: ${theme.text};
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .form-group input {
          padding: 12px 16px;
          border: 2px solid rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: ${theme.primary};
        }
        
        .error-message {
          color: #e74c3c;
          background-color: #fdf2f2;
          padding: 12px;
          border-radius: 6px;
          text-align: center;
          border: 1px solid #f5c6cb;
        }
        
        .login-btn {
          background-color: ${theme.primary};
          color: white;
          border: none;
          padding: 14px 20px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        
        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        @media (min-width: 768px) {
          .login-container {
            padding: 3rem;
          }
        }
      `}</style>
    </div>
  )
}

export default AdminLogin
