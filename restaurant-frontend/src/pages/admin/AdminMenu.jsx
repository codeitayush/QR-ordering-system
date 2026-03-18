import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { menuAPI } from '../../services/api'
import { theme } from '../../theme/colors'

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    isAvailable: true
  })
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { logout } = useAdminAuth()

  useEffect(() => {
    fetchMenu()
  }, [])

  const fetchMenu = async () => {
    try {
      const response = await menuAPI.getMenu()
      setMenuItems(response.data.data)
      setError('')
    } catch (err) {
      setError('Failed to fetch menu items')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      isAvailable: true
    })
    setEditingItem(null)
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price)
      }

      if (editingItem) {
        await menuAPI.updateMenuItem(editingItem._id, data)
      } else {
        await menuAPI.createMenuItem(data)
      }

      fetchMenu()
      resetForm()
    } catch (err) {
      setError('Failed to save menu item')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      image: item.image || '',
      isAvailable: item.isAvailable
    })
    setEditingItem(item)
    setShowForm(true)
  }

  const handleDelete = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      await menuAPI.deleteMenuItem(itemId)
      fetchMenu()
    } catch (err) {
      setError('Failed to delete menu item')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const groupedItems = menuItems.reduce((groups, item) => {
    const category = item.category || 'Other'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(item)
    return groups
  }, {})

  if (loading) {
    return (
      <div className="admin-menu">
        <div className="loading">Loading menu...</div>
      </div>
    )
  }

  return (
    <div className="admin-menu">
      <div className="menu-header">
        <div className="header-left">
          <button onClick={() => navigate('/admin/dashboard')} className="back-btn">
            ← Dashboard
          </button>
          <h1>Menu Management</h1>
        </div>
        <div className="header-actions">
          <button onClick={() => setShowForm(true)} className="add-btn">
            + Add Item
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h2>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
            
            <form onSubmit={handleSubmit} className="menu-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="Optional"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  placeholder="Optional"
                />
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                  />
                  Available
                </label>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={resetForm} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="submit-btn">
                  {submitting ? 'Saving...' : (editingItem ? 'Update' : 'Add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="menu-content">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="category-section">
            <h2 className="category-title">{category}</h2>
            <div className="items-grid">
              {items.map(item => (
                <div key={item._id} className="menu-item-card">
                  <div className="item-header">
                    <h3>{item.name}</h3>
                    <div className="item-status">
                      <span className={`status-indicator ${item.isAvailable ? 'available' : 'unavailable'}`}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                  
                  {item.description && (
                    <p className="item-description">{item.description}</p>
                  )}
                  
                  <div className="item-details">
                    <span className="item-price">₹{item.price}</span>
                    <span className="item-category">{item.category}</span>
                  </div>
                  
                  <div className="item-actions">
                    <button onClick={() => handleEdit(item)} className="edit-btn">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .admin-menu {
          padding: 1rem;
          min-height: 100vh;
          background-color: ${theme.background};
        }

        .menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1rem;
          background: ${theme.cardBackground};
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .back-btn {
          background-color: ${theme.text};
          opacity: 0.7;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .menu-header h1 {
          color: ${theme.text};
          font-size: 1.8rem;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .add-btn, .logout-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .add-btn {
          background-color: ${theme.primary};
          color: white;
        }

        .add-btn:hover {
          background-color: #FF5A8C;
        }

        .logout-btn {
          background-color: #e74c3c;
          color: white;
        }

        .logout-btn:hover {
          background-color: #c0392b;
        }

        .loading {
          text-align: center;
          padding: 3rem;
          color: ${theme.text};
        }

        .error-message {
          background-color: #fdf2f2;
          color: #e74c3c;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          border: 1px solid #f5c6cb;
        }

        .form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .form-container {
          background: ${theme.cardBackground};
          padding: 2rem;
          border-radius: 12px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .form-container h2 {
          color: ${theme.text};
          margin-bottom: 1.5rem;
        }

        .menu-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
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

        .form-group input,
        .form-group textarea {
          padding: 12px;
          border: 2px solid rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          font-size: 1rem;
        }

        .form-group textarea {
          resize: vertical;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          width: auto;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1rem;
        }

        .cancel-btn, .submit-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
        }

        .cancel-btn {
          background-color: ${theme.text};
          opacity: 0.7;
          color: white;
        }

        .submit-btn {
          background-color: ${theme.secondary};
          color: white;
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .menu-content {
          margin-bottom: 2rem;
        }

        .category-section {
          margin-bottom: 2rem;
        }

        .category-title {
          color: ${theme.text};
          font-size: 1.4rem;
          margin-bottom: 1rem;
          padding-left: 0.5rem;
          border-left: 4px solid ${theme.secondary};
        }

        .items-grid {
          display: grid;
          gap: 1rem;
        }

        .menu-item-card {
          background: ${theme.cardBackground};
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .item-header h3 {
          color: ${theme.text};
          font-size: 1.2rem;
          margin: 0;
        }

        .status-indicator {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-indicator.available {
          background-color: #e8f8f5;
          color: #27ae60;
        }

        .status-indicator.unavailable {
          background-color: #fdf2f2;
          color: #e74c3c;
        }

        .item-description {
          color: ${theme.text};
          opacity: 0.7;
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        .item-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .item-price {
          font-size: 1.2rem;
          font-weight: 700;
          color: ${theme.primary};
        }

        .item-category {
          color: ${theme.text};
          opacity: 0.7;
          font-size: 0.9rem;
        }

        .item-actions {
          display: flex;
          gap: 0.5rem;
        }

        .edit-btn, .delete-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .edit-btn {
          background-color: ${theme.secondary};
          color: white;
        }

        .edit-btn:hover {
          background-color: #8FC4D8;
        }

        .delete-btn {
          background-color: #e74c3c;
          color: white;
        }

        .delete-btn:hover {
          background-color: #c0392b;
        }

        @media (min-width: 768px) {
          .admin-menu {
            padding: 2rem;
          }

          .menu-header {
            padding: 2rem;
          }

          .menu-header h1 {
            font-size: 2.2rem;
          }

          .form-row {
            grid-template-columns: 1fr 1fr;
          }

          .items-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          }
        }

        @media (max-width: 767px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .menu-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .header-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>
    </div>
  )
}

export default AdminMenu
