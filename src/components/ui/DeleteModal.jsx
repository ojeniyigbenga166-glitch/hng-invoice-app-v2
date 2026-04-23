import { useContext, useEffect, useRef } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

export default function DeleteModal({ invoiceId, onConfirm, onCancel }) {
  const confirmRef = useRef(null);
  const cancelRef = useRef(null);
  const overlayRef = useRef(null);

  // Focus first button when modal opens
  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
      // Focus trap: Tab cycling
      if (e.key === 'Tab') {
        const focusable = [cancelRef.current, confirmRef.current].filter(Boolean);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  // Click outside to close
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onCancel();
    }
  };

  return (
    <div
      className="delete-modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <div className="delete-modal">
        <h2 id="delete-modal-title">Confirm Deletion</h2>
        <p id="delete-modal-description">
          Are you sure you want to delete invoice <strong>#{invoiceId}</strong>? This action cannot be undone.
        </p>
        <div className="delete-modal-actions">
          <button
            ref={cancelRef}
            className="btn-cancel-delete"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            className="btn-confirm-delete"
            onClick={onConfirm}
            type="button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
