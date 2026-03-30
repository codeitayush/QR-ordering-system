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
          top: 68px;
          width: 100%;
          max-width: 100%;
          background: #ffffff;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          padding: 0;
          margin: 0;
          z-index: 90;
        }

        .tabs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 16px 16px;
          scroll-behavior: smooth;
        }

        .tabs::-webkit-scrollbar {
          display: none;
        }

        .tab {
          padding: 10px 20px;
          border-radius: 24px;
          background: #f5f5f5;
          border: none;
          font-size: 14px;
          color: #777;
          white-space: nowrap;
          font-weight: 600;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          outline: none;
          position: relative;
          flex-shrink: 0;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tab:hover {
          background: #ececec;
        }

        .tab:active {
          transform: scale(0.96);
        }

        .tab.active {
          background: #ff4d8d;
          color: white;
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(255, 77, 141, 0.25);
        }

        .tab.active:hover {
          transform: scale(1.03);
          box-shadow: 0 6px 16px rgba(255, 77, 141, 0.3);
        }

        .tab.active:active {
          transform: scale(1.01);
        }

        @media (min-width: 768px) {
          .tabs {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  )
}

export default CategoryNavigation