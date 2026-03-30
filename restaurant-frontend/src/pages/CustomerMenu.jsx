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
        rootMargin: '-152px 0px -60% 0px'
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
        const headerHeight = 68
        const categoryHeight = 68
        const visualGap = 16

        const offset = headerHeight + categoryHeight + visualGap
        const y = el.getBoundingClientRect().top + window.pageYOffset - offset

        window.scrollTo({
          top: y,
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
        <div className="header-inner">
          <img src="/logo192.png" alt="Restaurant" />
          <div className="header-info">
            <h1>Restaurant Menu</h1>
            <p>Table {tableNumber}</p>
          </div>
        </div>
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
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0;
          background: #fafafa;
          min-height: 100vh;
        }

        .menu-header {
          position: fixed;
          top: 0;
          width: 100%;
          background: #ffffff;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          z-index: 100;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
        }

        .menu-header.hide {
          transform: translateY(-100%);
        }

        .menu-header.show {
          transform: translateY(0);
        }

        .header-inner {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 12px;
          padding: 12px 16px;
        }

        .header-inner img {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
        }

        .header-info {
          flex: 1;
        }

        .header-inner h1 {
          font-size: 20px;
          margin: 0 0 2px 0;
          color: #1a1a1a;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .header-inner p {
          font-size: 14px;
          margin: 0;
          color: #777;
          font-weight: 500;
        }

        .menu-content {
          padding-top: 104px;
          padding: 104px 0 100px;
        }

        .category-section {
          margin-bottom: 16px;
        }

        .category-title {
          font-size: 22px;
          font-weight: 700;
          margin: 0 0 12px 16px;
          color: #1a1a1a;
          letter-spacing: -0.03em;
          line-height: 1.2;
        }

        .items-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
      `}</style>
    </div>
  )
}

export default CustomerMenu