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
          max-width: 480px;
          margin: auto;
          background: #F2F0EA;
          min-height: 100vh;
        }

        .menu-header {
          position: fixed;
          top: 0;
          width: 100%;
          background: #ffffff;
          border-bottom: 1px solid #eee;
          z-index: 100;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: transform 0.25s ease;
        }

        .menu-header.hide {
          transform: translateY(-100%);
        }

        .menu-header.show {
          transform: translateY(0);
        }

        .header-inner {
          width: 100%;
          max-width: 480px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 8px 14px;
        }

        .header-inner img {
          width: 36px;
          height: 36px;
          border-radius: 8px;
        }

        .header-inner h1 {
          font-size: 17px;
          margin: 0;
          color: #222;
          font-weight: 600;
        }

        .header-inner p {
          font-size: 12px;
          margin: 0;
          color: #888;
        }

        .menu-content {
          padding-top: 100px;
          padding: 100px 12px 20px;
        }

        .category-section {
          margin-bottom: 20px;
        }

        .category-title {
          font-size: 18px;
          font-weight: 600;
          margin: 16px 0 8px;
          padding-left: 10px;
          position: relative;
          color: #333;
        }

        .category-title::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 18px;
          background: #ff4d8d;
          border-radius: 2px;
        }

        .items-grid {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
      `}</style>
    </div>
  )
}

export default CustomerMenu