import { useState, useEffect } from 'react'

function TaskModal({ task }) {
  return (
    <>
      <div className="modal-meta">
        <span className={`badge ${task.type}`} style={{ fontSize: 11, padding: '3px 8px' }}>{task.type}</span>
        <span className={`badge ${task.priority}`} style={{ fontSize: 11, padding: '3px 8px' }}>{task.priority}</span>
        <span className="tag"><span className={`status-dot ${task.status}`}></span>{task.status}</span>
      </div>
      <hr className="modal-divider" />
      <div className="modal-row">
        <span className="modal-row-label">ID</span>
        <span className="modal-row-value" style={{ fontFamily: 'monospace', fontSize: 12 }}>{task.id}</span>
      </div>
      <div className="modal-row">
        <span className="modal-row-label">Status</span>
        <span className="modal-row-value">{task.status}</span>
      </div>
      <div className="modal-row">
        <span className="modal-row-label">Type</span>
        <span className="modal-row-value">{task.type}</span>
      </div>
      <div className="modal-row">
        <span className="modal-row-label">Priority</span>
        <span className="modal-row-value">{task.priority}</span>
      </div>
      <div className="modal-row">
        <span className="modal-row-label">Owner</span>
        <span className="modal-row-value">{task.owner}</span>
      </div>
      <div className="modal-row">
        <span className="modal-row-label">File</span>
        <span className="modal-row-value" style={{ fontFamily: 'monospace', fontSize: 11 }}>{task.file}</span>
      </div>
    </>
  )
}

export default function BacklogView({ onOpen }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/backlog')
      .then(r => r.json())
      .then(data => { setTasks(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading...</div>

  const cols = [
    { key: 'todo', label: '📋 Todo', color: 'var(--blue)' },
    { key: 'doing', label: '⚡ Doing', color: 'var(--yellow)' },
    { key: 'done', label: '✅ Done', color: 'var(--green)' }
  ]

  return (
    <div className="kanban">
      {cols.map(col => {
        const items = tasks.filter(t => t.status === col.key)
        return (
          <div key={col.key} className="kanban-col">
            <div className={`kanban-col-header ${col.key}`}>
              {col.label} <span className="count">{items.length}</span>
            </div>
            {items.length === 0 && <div className="empty" style={{ padding: '16px' }}>—</div>}
            {items.map(task => (
              <div
                key={task.id}
                className="card task-card"
                onClick={() => onOpen({
                  props: {
                    title: task.title,
                    subtitle: task.id,
                    children: <TaskModal task={task} />
                  }
                })}
              >
                <div className="task-id">{task.id}</div>
                <div className="task-title">{task.title}</div>
                <div className="task-meta">
                  <span className={`badge ${task.type}`}>{task.type}</span>
                  <span className={`badge ${task.priority}`}>{task.priority}</span>
                </div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
