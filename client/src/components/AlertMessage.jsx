import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const AlertMessage = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const icons = {
    error: <AlertCircle size={18} />,
    success: <CheckCircle size={18} />,
    info: <Info size={18} />,
  };

  return (
    <div className={`alert alert-${type}`}>
      <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {icons[type] || icons.info}
      </span>
      <div style={{ flex: 1, wordBreak: 'break-word' }}>{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            padding: '2px',
          }}
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default AlertMessage;
