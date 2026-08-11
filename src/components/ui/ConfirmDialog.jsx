import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Are you sure?', message, confirmLabel = 'Delete', loading }) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center gap-3 py-2">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
          <AlertTriangle size={22} />
        </div>
        <h3 className="text-base font-semibold text-luxora-text">{title}</h3>
        {message && <p className="text-sm text-luxora-muted">{message}</p>}
        <div className="flex gap-3 mt-4 w-full">
          <button className="btn-outline flex-1" onClick={onClose}>Cancel</button>
          <button className="btn-danger flex-1" onClick={onConfirm} disabled={loading}>
            {loading ? 'Please wait…' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
