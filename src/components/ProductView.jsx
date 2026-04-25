import { useState, useEffect } from 'react'
import BacklogView from '../views/BacklogView.jsx'
import PlansView from '../views/PlansView.jsx'
import InboxView from '../views/InboxView.jsx'
import MarkdownContent from './MarkdownContent.jsx'

// Generate a stable emoji from a string
function nameToEmoji(name) {
  const emojis = ['📦', '🛒', '🎯', '⚡', '🚀', '💼', '🌐', '📱', '🔧', '📊', '🎨', '💡', '🔒', '📈', '🛠️']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return emojis[Math.abs(hash) % emojis.length]
}

function cleanName(id) {
  return id.replace('product/', '')
}

function OverviewTab({ data }) {
  const [expanded, setExpanded] = useState(false)
  const readme = data.readmeContent

  return (
    <div className="overview-tab">
      {/* Purpose */}
      {data.purpose && (
        <div className="overview-section">
          <div className="overview-label">Purpose</div>
          <p className="overview-purpose">{data.purpose}</p>
        </div>
      )}

      {/* Meta row */}
      <div className="overview-meta-row">
        {data.lifecycle && (
          <div className="overview-meta-item">
            <span className="overview-meta-label">Lifecycle</span>
            <span className={`badge ${data.lifecycle}`}>{data.lifecycle}</span>
          </div>
        )}
        {data.status && (
          <div className="overview-meta-item">
            <span className="overview-meta-label">Status</span>
            <span className={`status-dot ${data.status}`} style={{ marginRight: 4 }}></span>
            <span className="overview-meta-value">{data.status}</span>
          </div>
        )}
        {data.owner && (
          <div className="overview-meta-item">
            <span className="overview-meta-label">Owner</span>
            <span className="overview-meta-value">{data.owner}</span>
          </div>
        )}
        {data.domain && (
          <div className="overview-meta-item">
            <span className="overview-meta-label">Domain</span>
            <span className="overview-meta-value">{data.domain}</span>
          </div>
        )}
      </div>

      {/* Stack */}
      {data.stack && data.stack.length > 0 && (
        <div className="overview-section">
          <div className="overview-label">Stack</div>
          <div className="overview-stack">
            {data.stack.map(s => (
              <span key={s} className="badge">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {data.links && Object.keys(data.links).length > 0 && (
        <div className="overview-section">
          <div className="overview-label">Links</div>
          <div className="overview-links">
            {Object.entries(data.links).map(([k, v]) => (
              <a key={k} href={v} target="_blank" rel="noopener noreferrer" className="overview-link">
                {k}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* External repo */}
      {data['external-repo'] && (
        <div className="overview-section">
          <div className="overview-label">Repository</div>
          <a
            href={`https://github.com/${data['external-repo']}`}
            target="_blank"
            rel="noopener noreferrer"
            className="overview-link"
          >
            github.com/{data['external-repo']}
          </a>
        </div>
      )}

      {/* README */}
      {readme && (
        <div className="overview-section">
          <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setExpanded(!expanded)}>
            {expanded ? '▲ Hide README' : '▼ View README'}
          </button>
          {expanded && <MarkdownContent content={readme} />}
        </div>
      )}
    </div>
  )
}

export default function ProductView({ product, onOpen }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [productData, setProductData] = useState(null)

  useEffect(() => {
    if (!product) return
    if (product === 'global') {
      setProductData({ id: 'global', name: 'KOS Framework', emoji: '⚡' })
      setActiveTab('overview')
      document.title = 'KOS Dashboard'
      return
    }
    fetch('/api/products')
      .then(r => r.json())
      .then(products => {
        const p = products.find(pr => cleanName(pr.id) === product)
        if (p) {
          setProductData(p)
          document.title = `${cleanName(p.id)} — KOS Dashboard`
        }
      })
      .catch(() => setProductData(null))
  }, [product])

  if (!productData) {
    return <div className="loading">Loading...</div>
  }

  const isGlobal = product === 'global'
  const displayName = isGlobal ? 'KOS Framework' : (cleanName(productData.id))
  const displayEmoji = isGlobal ? '⚡' : (productData.emoji || nameToEmoji(displayName))

  const GLOBAL_TABS = [
    { key: 'overview', label: '🏠 Overview' }
  ]

  const PRODUCT_TABS = [
    { key: 'overview', label: '🏠 Overview' },
    { key: 'backlog',  label: '📋 Backlog' },
    { key: 'plans',    label: '📝 Plans' },
    { key: 'inbox',    label: '📥 Inbox' }
  ]

  const tabs = isGlobal ? GLOBAL_TABS : PRODUCT_TABS

  return (
    <div className="product-view">
      <div className="product-view-topbar">
        <div className="product-view-header">
          <span className="product-view-emoji">{displayEmoji}</span>
          <span className="product-view-title">{displayName}</span>
        </div>
        <div className="product-view-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="product-view-content">
        {isGlobal ? (
          <>
            <div className="global-intro">
              <p>Selecciona un producto en la barra lateral para ver su información y progreso.</p>
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
            {activeTab === 'overview' && <OverviewTab data={productData} />}
            {activeTab === 'backlog' && <BacklogView onOpen={onOpen} product={product} />}
            {activeTab === 'plans'   && <PlansView   onOpen={onOpen} product={product} />}
            {activeTab === 'inbox'   && <InboxView   onOpen={onOpen} product={product} />}
          </>
        )}
      </div>
    </div>
  )
}
