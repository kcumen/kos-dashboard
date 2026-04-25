import { useState, useEffect } from 'react'
import MarkdownContent from '../components/MarkdownContent.jsx'

function InboxModal({ item }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <div className="modal-meta">
        <span className="status-pending">● {item.status}</span>
        <button
          className="btn-ghost"
          style={{ marginLeft: 'auto', fontSize: 12 }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? '▲ Hide content' : '▼ View content'}
        </button>
      </div>
      <hr className="modal-divider" />
      <div className="modal-row">
        <span className="modal-row-label">Product</span>
        <span className="modal-row-value">{item.product || '—'}</span>
      </div>
      <div className="modal-row">
        <span className="modal-row-label">File</span>
        <span className="modal-row-value" style={{ fontFamily: 'monospace', fontSize: 11 }}>{item.file}</span>
      </div>
      <div className="modal-row">
        <span className="modal-row-label">Date</span>
        <span className="modal-row-value">{item.date}</span>
      </div>
      {expanded && item.content && (
        <>
          <hr className="modal-divider" />
          <MarkdownContent content={item.content} />
        </>
      )}
    </>
  )
}

export default function InboxView({ onOpen, product }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const url = product ? `/api/inbox?product=${product}` : '/api/inbox'
    fetch(url)
      .then(r => r.json())
      .then(data => { setItems(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [product])

  if (loading) return <div className="loading">Loading...</div>
  if (!items.length) return <div className="empty">Inbox clean ✓</div>

  return (
    <div className="inbox-list">
      {items.map(item => (
        <div
          key={item.file}
          className="card inbox-item"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpen({
            props: {
              title: item.title,
              subtitle: item.file,
              children: <InboxModal item={item} />
            }
          })}
        >
          <span className="status-pending">● {item.status}</span>
          <div className="inbox-title">{item.title}</div>
          <div className="inbox-date">{item.date}</div>
        </div>
      ))}
    </div>
  )
}
