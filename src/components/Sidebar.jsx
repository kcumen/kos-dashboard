export default function Sidebar({ current, onNavigate, stats }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">⚡ KOS Dashboard</div>
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-label">Views</div>
          <div className={`nav-item ${current === 'products' ? 'active' : ''}`} onClick={() => onNavigate('products')}>
            🗂️ Products
            <span className="count">{stats?.products ?? '–'}</span>
          </div>
          <div className={`nav-item ${current === 'inbox' ? 'active' : ''}`} onClick={() => onNavigate('inbox')}>
            📥 Inbox
            <span className="count">{stats?.inbox ?? '–'}</span>
          </div>
          <div className={`nav-item ${current === 'backlog' ? 'active' : ''}`} onClick={() => onNavigate('backlog')}>
            📋 Backlog
            <span className="count">{stats?.tasks?.total ?? '–'}</span>
          </div>
          <div className={`nav-item ${current === 'plans' ? 'active' : ''}`} onClick={() => onNavigate('plans')}>
            📝 Plans
          </div>
        </div>
      </nav>
    </aside>
  )
}
