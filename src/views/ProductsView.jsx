import { useState, useEffect } from 'react'

const LIFECYCLE_COLORS = {
  active: { bg: 'rgba(74, 222, 128, 0.1)', color: '#4ade80' },
  inception: { bg: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24' },
  archived: { bg: 'rgba(248, 113, 113, 0.1)', color: '#f87171' }
}

function normalizeStack(stack) {
  if (!stack) return []
  if (Array.isArray(stack)) return stack
  return stack.split(',').map(s => s.trim())
}

function ProductModal({ product }) {
  const stack = normalizeStack(product.stack)
  const lc = LIFECYCLE_COLORS[product.lifecycle] || LIFECYCLE_COLORS.active

  return (
    <>
      <div className="modal-meta">
        <span className="tag" style={{ background: lc.bg, color: lc.color, borderColor: lc.color }}>
          {product.lifecycle || 'active'}
        </span>
        <span className="tag"><span className={`status-dot ${product.status}`}></span>{product.status}</span>
        {product.domain && <span className="tag">🌐 {product.domain}</span>}
        {product['external-repo'] && <span className="tag">📦 {product['external-repo']}</span>}
      </div>

      {product.purpose && (
        <>
          <div className="modal-section-title">Purpose</div>
          <div className="modal-section" style={{ color: 'var(--text)', fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
            {product.purpose}
          </div>
        </>
      )}

      {stack.length > 0 && (
        <>
          <div className="modal-section-title">Stack</div>
          <div className="modal-tags" style={{ marginBottom: 16 }}>
            {stack.map((s, i) => <span key={i} className="tag">{s}</span>)}
          </div>
        </>
      )}

      <hr className="modal-divider" />

      <div className="modal-row">
        <span className="modal-row-label">ID</span>
        <span className="modal-row-value" style={{ fontFamily: 'monospace', fontSize: 12 }}>{product.id}</span>
      </div>
      <div className="modal-row">
        <span className="modal-row-label">Owner</span>
        <span className="modal-row-value">{product.owner || '—'}</span>
      </div>
      <div className="modal-row">
        <span className="modal-row-label">Status</span>
        <span className="modal-row-value">{product.status || '—'}</span>
      </div>
      {product['external-url'] && (
        <div className="modal-row">
          <span className="modal-row-label">Repo</span>
          <span className="modal-row-value" style={{ fontFamily: 'monospace', fontSize: 12 }}>
            <a href={`https://${product['external-url']}`} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>
              {product['external-url']}
            </a>
          </span>
        </div>
      )}
    </>
  )
}

export default function ProductsView({ onOpen }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading...</div>
  if (!products.length) return <div className="empty">No products found</div>

  return (
    <div className="products-grid">
      {products.map(p => {
        const lc = LIFECYCLE_COLORS[p.lifecycle] || LIFECYCLE_COLORS.active
        return (
          <div
            key={p.id}
            className="card product-card"
            onClick={() => onOpen({
              props: {
                title: p.id.replace('product/', '').replace('/', ' / '),
                subtitle: p.purpose || '—',
                children: <ProductModal product={p} />
              }
            })}
          >
            <div className="product-header">
              <div>
                <div className="product-name">{p.id.replace('product/', '').replace('/', ' / ')}</div>
                <div className="product-id">{p.id}</div>
              </div>
              <span className="lifecycle-badge" style={{ background: lc.bg, color: lc.color, borderColor: lc.color }}>
                {p.lifecycle || 'active'}
              </span>
            </div>
            <div className="purpose">{p.purpose || '—'}</div>
            <div className="tags">
              {(Array.isArray(p.stack) ? p.stack : (p.stack || '').split(',').map(s => s.trim())).filter(Boolean).map((s, i) => <span key={i} className="tag">{s}</span>).slice(0, 4)}
            </div>
            <div className="footer">
              <span><span className={`status-dot ${p.status}`}></span>{p.status}</span>
              {p.domain && <span>🌐 {p.domain}</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
