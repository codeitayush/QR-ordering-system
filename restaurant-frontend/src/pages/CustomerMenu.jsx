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
  const [activeCategory, setActiveCategory] = useState('')
  const categoryRefs = useRef({})
  const observerRefs = useRef({})

  const tableNumber = searchParams.get('table')

  // ✅ SAVE TABLE NUMBER
  useEffect(() => {
    if (tableNumber) {
      localStorage.setItem('tableNumber', tableNumber)
    }
  }, [tableNumber])

  // ✅ FETCH MENU
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true)

        const response = await menuAPI.getMenu()
        const backendData = response?.data?.data

        if (backendData && backendData.length > 0) {
          setMenuItems(backendData)
        } else {
          setMenuItems(menuData)
        }
      } catch (err) {
        console.error('Menu fetch error:', err)
        setMenuItems(menuData)
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [])

  // ✅ DEFAULT CATEGORY
  useEffect(() => {
    if (menuItems.length > 0 && !activeCategory) {
      const categories = [...new Set(menuItems.map(item => item.category || 'Other'))]
      if (categories.length > 0) {
        setActiveCategory(categories[0])
      }
    }
  }, [menuItems, activeCategory])

  // ✅ SCROLL OBSERVER
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const category = entry.target.dataset.category
            if (category) setActiveCategory(category)
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

  // ✅ GROUP BY CATEGORY
  const groupedItems = menuItems.reduce((groups, item) => {
    const category = item.category || 'Other'
    if (!groups[category]) groups[category] = []
    groups[category].push(item)
    return groups
  }, {})

  const categories = Object.keys(groupedItems)

  const handleCategoryClick = (category) => {
    setActiveCategory(category)

    setTimeout(() => {
      const el = categoryRefs.current[category]
      if (el) {
        const navHeight = document.querySelector('.category-navigation')?.offsetHeight || 0
        const headerHeight = document.querySelector('.menu-header')?.offsetHeight || 0

        const offset = navHeight + headerHeight + 10
        const top = el.getBoundingClientRect().top + window.pageYOffset

        window.scrollTo({
          top: top - offset,
          behavior: 'smooth'
        })
      }
    }, 100)
  }

  // ❌ NO TABLE
  if (!tableNumber) return <TableError />

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="customer-menu">
        <div className="loading">
          <h1>Loading menu...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="customer-menu">

      {/* HEADER */}
      <div className="menu-header">
        <h1>Restaurant Menu</h1>
        <p className="table-info">Table {tableNumber}</p>
      </div>

      {/* CATEGORY NAV */}
      <CategoryNavigation
        categories={categories}
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
      />

      {/* MENU */}
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
                <MenuItem
                  key={item._id || item.name}
                  item={item}   // 🔥 IMPORTANT (full object)
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <CartButton />

      {/* STYLES */}
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

        .loading {
          text-align: center;
          padding: 3rem;
        }
      `}</style>
    </div>
  )
}

export default CustomerMenu