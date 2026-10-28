import React from 'react';
import { Link } from 'react-router-dom';
import { Home, HelpCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '440px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
          }}
        >
          <HelpCircle size={32} />
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, margin: 0, color: 'var(--primary)' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.5rem', margin: '0.5rem 0 1rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '0.95rem' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/dashboard" className="btn btn-primary">
          <Home size={18} />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
