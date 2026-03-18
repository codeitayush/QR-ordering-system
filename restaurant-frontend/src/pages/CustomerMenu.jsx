import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { menuAPI } from '../services/api'
import MenuItem from '../components/MenuItem'
import CartButton from '../components/CartButton'
import CategoryNavigation from '../components/CategoryNavigation'
import TableError from '../components/TableError'
import { theme } from '../theme/colors'
import menuData from '../data/menuData.json'

const CustomerMenu = () => {
  const [searchParams] = useSearchParams()
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('')
  const categoryRefs = useRef({})
  const observerRefs = useRef({})
  
  const tableNumber = searchParams.get('table')

  // ✅ FIX: SAVE TABLE NUMBER FOR PHONE NAVIGATION
  useEffect(() => {
    if (tableNumber) {
      localStorage.setItem('tableNumber', tableNumber)
      console.log("Saved tableNumber:", tableNumber)
    }
  }, [tableNumber])

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true)

        const response = await menuAPI.getMenu()
        const backendData = response?.data?.data

        if (false) {
          setMenuItems(backendData)
        } else {
          setMenuItems(menuData)
        }

        setError(null)
      } catch (err) {
        setMenuItems(menuData)
        setError(null)
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [])

  useEffect(() => {
    if (menuItems.length > 0 && !activeCategory) {
      const categories = [...new Set(menuItems.map(item => item.category || 'Other'))]
      if (categories.length > 0) {
        setActiveCategory(categories[0])
      }
    }
  }, [menuItems, activeCategory])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const category = entry.target.dataset.category
            if (category) {
              setActiveCategory(category)
            }
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: '-100px 0px -60% 0px'
      }
    )

    Object.values(observerRefs.current).forEach(ref => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [menuItems])

  const groupedItems = menuItems.reduce((groups, item) => {
    const category = item.category || 'Other'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(item)
    return groups
  }, {})

  const categories = Object.keys(groupedItems)

  const handleCategoryClick = (category) => {
  setActiveCategory(category)

  setTimeout(() => {
    const categoryElement = categoryRefs.current[category]
    if (categoryElement) {
      const navHeight = document.querySelector('.category-navigation')?.offsetHeight || 0
      const headerHeight = document.querySelector('.menu-header')?.offsetHeight || 0

      const totalOffset = navHeight + headerHeight + 10

      const elementPosition =
        categoryElement.getBoundingClientRect().top + window.pageYOffset

      const offsetPosition = elementPosition - totalOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }, 100)
}

  if (!tableNumber) return <TableError />

  if (loading) {
    return (
      <div className="customer-menu">
        <div className="loading">
          <h1>Loading menu...</h1>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="customer-menu">
        <div className="error">
          <h1>Error</h1>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="customer-menu">
      <div className="menu-header">
        <h1>Restaurant Menu</h1>
        <p className="table-info">Table {tableNumber}</p>
      </div>

      <CategoryNavigation
        categories={categories}
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
      />

      <div className="menu-content">
        {categories.map(category => (
          <div 
            key={category} 
            className="category-section"
            ref={el => {
              categoryRefs.current[category] = el
              observerRefs.current[category] = el
            }}
            data-category={category}
          >
            <h2 className="category-title">{category}</h2>

            <div className="items-grid">
              {groupedItems[category].map(item => (
                <MenuItem key={item._id || item.name} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <CartButton />

      <style jsx>{`
        .customer-menu {
          padding-bottom: 100px;
          background-color: ${theme.background};
          min-height: 100vh;
        }

        .menu-header {
          text-align: center;
          margin-bottom: 1rem;
          padding: 1rem;
        }

        .menu-header h1 {
          font-size: 1.8rem;
          color: ${theme.text};
        }

        .table-info {
          color: ${theme.text};
          opacity: 0.7;
        }

        .menu-content {
          padding: 0 1rem;
        }

        .category-section {
          margin-bottom: 3rem;
           scroll-margin-top: 140px;
        }

        .category-title {
          font-size: 1.4rem;
          margin-bottom: 1rem;
          padding: 0.8rem 1rem;
          background: ${theme.secondary};
          color: white;
          border-radius: 10px;
        }

        .items-grid {
          display: grid;
          gap: 1rem;
        }
      `}</style>
    </div>
  )
}

export default CustomerMenu