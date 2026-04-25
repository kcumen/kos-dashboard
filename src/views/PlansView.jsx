import { useState, useEffect } from 'react';
import MarkdownContent from '../components/MarkdownContent';

const STATUS_LABELS = {
  draft: '📝 Draft',
  'in-review': '👀 In Review',
  approved: '✅ Approved',
  rejected: '❌ Rejected'
}

function PlanModal({ plan }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="modal-meta">
        <span className={`plan-status ${plan.status}`} style={{ fontSize: 11 }}>{STATUS_LABELS[plan.status] || plan.status}</span>
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
        <span className="modal-row-value">{plan.product}</span>
      </div>
      <div className="modal-row">
        <span className="modal-row-label">Date</span>
        <span className="modal-row-value">{plan.date}</span>
      </div>
      <div className="modal-row">
        <span className="modal-row-label">File</span>
        <span className="modal-row-value" style={{ fontFamily: 'monospace', fontSize: 11 }}>{plan.file}</span>
      </div>
      {expanded && plan.content && (
        <>
          <hr className="modal-divider" />
          <MarkdownContent content={plan.content} />
        </>
      )}
    </>
  )
}

export default function PlansView({ onOpen }) {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/plans')
      .then(r => r.json())
      .then(data => { setPlans(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading...</div>
  if (!plans.length) return <div className="empty">No plans yet</div>

  return (
    <div className="plans-list">
      {plans.map(plan => (
        <div
          key={plan.file}
          className="card plan-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpen({
              props: {
                title: plan.title,
                subtitle: `${plan.product} · ${plan.date}`,
                children: <PlanModal plan={plan} />
              }
            })}
        >
          <span className={`plan-status ${plan.status}`}>{STATUS_LABELS[plan.status] || plan.status}</span>
          <div style={{ flex: 1 }}>
            <div className="plan-title">{plan.title}</div>
            <div className="plan-meta">
              <span className="plan-product">{plan.product}</span>
              <span>{plan.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
