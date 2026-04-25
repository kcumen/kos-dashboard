import { useState } from 'react'
import ServerList from './components/ServerList.jsx'
import ProductView from './components/ProductView.jsx'
import Modal from './components/Modal.jsx'

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState('global')
  const [modal, setModal] = useState(null)

  return (
    <div className="layout">
      <ServerList selected={selectedProduct} onSelect={setSelectedProduct} />
      <main className="main">
        <ProductView product={selectedProduct} onOpen={setModal} />
      </main>
      {modal && <Modal {...modal.props} onClose={() => setModal(null)} />}
    </div>
  )
}
