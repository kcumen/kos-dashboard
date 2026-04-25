export default function Modal({ title, subtitle, children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-body">
          <div className="modal-header">
            <div>
              <div className="modal-title">{title}</div>
              {subtitle && <div className="modal-subtitle">{subtitle}</div>}
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
