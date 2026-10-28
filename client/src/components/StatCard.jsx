import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'var(--primary)', subtitle }) => {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: `${color}18`, // 10% opacity tint
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={26} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </p>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.2rem 0 0' }}>
          {value}
        </h3>
        {subtitle && (
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
