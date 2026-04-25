import { useState, useEffect } from 'react'
import BacklogView from '../views/BacklogView.jsx'
import PlansView from '../views/PlansView.jsx'
import InboxView from '../views/InboxView.jsx'
import MarkdownContent from './MarkdownContent.jsx'

const TABS = [
  { key: 'backlog', label: '📋 Backlog' },
  { key: 'plans',   label: '📝 Plans' },
  { key: 'inbox',   label: '📥 Inbox' }
]

function ProductDetail({ product }) {
  const [expanded, setExpanded] = useState(false)
  const readme = product.readmeContent

  return (
    <>
      <div className="product-detail-header">
        <div className="product-detail-meta">
          <span className="product-detail-emoji">{product.emoji || '📦'}</span>
          <div>
            <div className="product-detail-name">{product.name || product.id}</div>
            {product.purpose && <div className="product-detail-purpose">{product.purpose}</div>}
          </div>
        </div>
        <div className="product-detail-badges">
          {product.status && <span className={`status-dot ${product.status}`} style={{ marginRight: 8 }}>{product.status}</span>}
          {product.lifecycle && <span className="badge">{product.lifecycle}</span>}
          {product.domain && <span className="badge">{product.domain}</span>}
        </div>
      </div>

      {product.stack && (
        <div className="product-detail-section">
          <div className="product-detail-label">Stack</div>
          <div className="product-detail-stack">
            {product.stack.map(s => <span key={s} className="badge">{s}</span>)}
          </div>
        </div>
      )}

      {product.links && Object.keys(product.links).length > 0 && (
        <div className="product-detail-section">
          <div className="product-detail-label">Links</div>
          <div className="product-detail-links">
            {Object.entries(product.links).map(([k, v]) => (
              <a key={k} href={v} target="_blank" rel="noopener noreferrer" className="product-link">
                {k}
              </a>
            ))}
          </div>
        </div>
      )}

      {readme && (
        <div className="product-detail-section">
          <button className="btn-ghost" style={{ marginBottom: 8, fontSize: 12 }} onClick={() => setExpanded(!expanded)}>
            {expanded ? '▲ Hide README' : '▼ View README'}
          </button>
          {expanded && <MarkdownContent content={readme} />}
        </div>
      )}
    </>
  )
}

export default function ProductView({ product, onOpen }) {
  const [activeTab, setActiveTab] = useState('backlog')
  const [productData, setProductData] = useState(null)

  useEffect(() => {
    if (!product) return
    if (product === 'global') {
      setProductData({ id: 'global', name: 'KOS Framework', emoji: '⚡' })
      return
    }
    fetch(`/api/products`)
      .then(r => r.json())
      .then(products => {
        const p = products.find(pr => pr.id === product)
        if (p) setProductData(p)
      })
      .catch(() => setProductData(null))
  }, [product])

  if (!productData) {
    return <div className="loading">Loading...</div>
  }

  const isGlobal = product === 'global'

  return (
    <div className="product-view">
      <div className="product-view-topbar">
        <div className="product-view-header">
          <span className="product-view-emoji">{productData.emoji || '📦'}</span>
          <span className="product-view-title">{productData.name || productData.id}</span>
        </div>
        {!isGlobal && (
          <div className="product-view-tabs">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="product-view-content">
        {isGlobal ? (
          <>
            <div className="global-intro">
              <p>Vista global de KOS Framework. Selecciona un producto para ver su backlog, planes e inbox.</p>
            </div>
            <div className="global-all-views">
              <div className="global-section">
                <h3 className="global-section-title">📋 Backlog Global</h3>
                <BacklogView onOpen={onOpen} />
              </div>
              <div className="global-section">
                <h3 className="global-section-title">📝 Planes</h3>
                <PlansView onOpen={onOpen} />
              </div>
              <div className="global-section">
                <h3 className="global-section-title">📥 Inbox</h3>
                <InboxView onOpen={onOpen} />
              </div>
            </div>
          </>
        ) : (
          <>
            {activeTab === 'backlog' && <BacklogView onOpen={onOpen} product={product} />}
            {activeTab === 'plans'   && <PlansView   onOpen={onOpen} product={product} />}
            {activeTab === 'inbox'   && <InboxView   onOpen={onOpen} product={product} />}
          </>
        )}
      </div>
    </div>
  )
}
