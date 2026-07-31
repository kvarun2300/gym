import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

const ConfirmDialog = ({ open, onClose, onConfirm, title = 'Are you sure?', description, loading = false }) => {
  return (
    <Modal open={open} onClose={onClose} title="" maxWidth="max-w-sm">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger/15 text-danger">
          <AlertTriangle size={22} />
        </div>
        <h3 className="font-display text-lg font-bold text-white">{title}</h3>
        {description && <p className="mt-2 text-sm text-white/50">{description}</p>}
        <div className="mt-7 flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1 !py-2.5 text-xs">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-danger px-4 py-2.5 font-accent text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
