import React from 'react';
import { FolderPlus, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No tasks found',
  description = 'You currently have no tasks matching this criteria.',
  actionLink,
  actionText = 'Create New Task',
}) => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border)',
        margin: '1.5rem 0',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>{title}</h3>
      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          maxWidth: '420px',
          margin: '0 auto 1.5rem',
        }}
      >
        {description}
      </p>
      {actionLink && (
        <Link to={actionLink} className="btn btn-primary btn-sm">
          <FolderPlus size={16} />
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
