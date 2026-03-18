import { useRef } from 'react'
import { theme } from '../theme/colors'

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
          top: 0;
          z-index: 1000;
          background: ${theme.background};
          padding: 12px 0 6px;
          margin-bottom: 6px;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .tabs {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 0 16px;
          scroll-behavior: smooth;
          scroll-snap-type: x mandatory;
        }

        .tabs::-webkit-scrollbar {
          display: none;
        }

        .tab {
          flex-shrink: 0;
          scroll-snap-align: center;

          font-size: 0.9rem;
          font-weight: 500;
          color: #666;

          background: rgba(0,0,0,0.03);
          border: none;
          border-radius: 18px;

          padding: 8px 14px;
          cursor: pointer;
          white-space: nowrap;

          transition: all 0.2s ease;
        }

        .tab:hover {
          background: rgba(0,0,0,0.06);
        }

        .tab.active {
          background: rgba(255, 120, 172, 0.12);
          color: ${theme.primary};
          font-weight: 600;
        }

        .tab.active::after {
          content: "";
          display: block;
          height: 3px;
          width: 60%;
          margin: 6px auto 0;
          background: ${theme.primary};
          border-radius: 2px;
        }

        .tab:active {
          transform: scale(0.94);
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