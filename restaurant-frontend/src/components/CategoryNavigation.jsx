import { useRef } from 'react'

const CategoryNavigation = ({ categories, activeCategory, onCategoryClick }) => {
  const scrollRef = useRef(null)

  const handleClick = (category) => {
    onCategoryClick(category)

    if (scrollRef.current) {
      const elements = scrollRef.current.querySelectorAll('.tab')
      const el = Array.from(elements).find(
        e => e.textContent.trim() === category
      )

      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          inline: 'center'
        })
      }
    }
  }

  return (
    <div className="wrapper">
      <div className="tabs" ref={scrollRef}>
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => handleClick(cat)}
            className={`tab ${activeCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <style jsx>{`
        .wrapper {
          position: sticky;
          top: 60px;
          background: #ffffff;
          border-bottom: 1px solid #eee;
          padding: 6px 10px;
          margin: 0;
          z-index: 90;
        }

        .tabs {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding: 4px 2px;
        }

        .tabs::-webkit-scrollbar {
          display: none;
        }

        .tab {
          padding: 6px 12px;
          border-radius: 14px;
          background: #f1f1f1;
          border: none;
          font-size: 13px;
          color: #555;
          white-space: nowrap;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .tab.active {
          background: #ff4d8d;
          color: white;
          transform: scale(1.03);
        }

        @media (min-width: 768px) {
          .tabs {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}

export default CategoryNavigation