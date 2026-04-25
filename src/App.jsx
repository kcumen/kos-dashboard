import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Modal from './components/Modal.jsx'
import ProductsView from './views/ProductsView.jsx'
import BacklogView from './views/BacklogView.jsx'
import PlansView from './views/PlansView.jsx'
import InboxView from './views/InboxView.jsx'

const VIEWS = {
  products: ProductsView,
  inbox: InboxView,
  backlog: BacklogView,
  plans: PlansView
}

export default function App() {
  const [view, setView] = useState('products')
  const [stats, setStats] = useState(null)
  const [modal, setModal] = useState(null)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => setStats({ products: 0, inbox: 0, tasks: { total: 0, todo: 0, doing: 0, done: 0 } }))
  }, [])

  const ViewComponent = VIEWS[view] || ProductsView

  return (
    <div className="layout">
      <Sidebar current={view} onNavigate={setView} stats={stats} />
      <main className="main">
        <header className="topbar">
          <span className="topbar-title">⚡ KOS Dashboard</span>
          <div className="topbar-stats">
            <span className="stat-badge">Products: {stats?.products ?? '–'}</span>
            <span className="stat-badge">Inbox: {stats?.inbox ?? '–'}</span>
            <span className="stat-badge">Tasks: {stats?.tasks?.todo ?? '–'}/{stats?.tasks?.doing ?? '–'}/{stats?.tasks?.done ?? '–'}</span>
          </div>
        </header>
        <div className="content">
          <ViewComponent onOpen={setModal} />
        </div>
      </main>
      {modal && <Modal {...modal.props} onClose={() => setModal(null)} />}
    </div>
  )
}
