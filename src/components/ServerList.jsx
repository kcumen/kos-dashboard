import { useState, useEffect } from 'react'

// Generate a stable emoji from a string
function nameToEmoji(name) {
  const emojis = ['📦', '🛒', '🎯', '⚡', '🚀', '💼', '🌐', '📱', '🔧', '📊', '🎨', '💡', '🔒', '📈', '🛠️']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return emojis[Math.abs(hash) % emojis.length]
}

// Clean product id → display name
function cleanName(id) {
  return id.replace('product/', '')
}

function ServerIcon({ product, selected, onClick }) {
  const displayName = cleanName(product.id)
  const emoji = product.emoji || nameToEmoji(displayName)

  return (
    <div
      className={`server-icon ${selected ? 'selected' : ''}`}
      onClick={() => onClick(displayName)}
      title={displayName}
    >
      <span className="server-icon-emoji">{emoji}</span>
      {selected && <div className="server-icon-indicator" />}
    </div>
  )
}

export default function ServerList({ selected, onSelect }) {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(setProducts)
      .catch(() => setProducts([]))
  }, [])

  return (
    <aside className="server-list">
      <div className="server-list-icons">
        {/* KOS Framework — global view */}
        <div
          className={`server-icon ${selected === 'global' ? 'selected' : ''}`}
          onClick={() => onSelect('global')}
          title="KOS Framework"
        >
          <span className="server-icon-emoji">⚡</span>
          <div className="server-icon-indicator" />
        </div>

        <div className="server-divider" />

        {/* Product icons */}
        {products.map(p => (
          <ServerIcon
            key={p.id}
            product={p}
            selected={selected === cleanName(p.id)}
            onClick={onSelect}
          />
        ))}
      </div>
    </aside>
  )
}
