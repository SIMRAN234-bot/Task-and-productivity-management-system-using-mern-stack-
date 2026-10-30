import React from 'react';
import { NavLink } from 'react-router-dom';
import { CheckSquare, LayoutDashboard, ListTodo, PlusCircle, User, X, CalendarDays, Kanban } from 'lucide-react';

const Sidebar = ({ isOpen, isCollapsed, onClose }) => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tasks', label: 'All Tasks', icon: ListTodo },
    { to: '/calendar', label: 'Calendar', icon: CalendarDays },
    { to: '/board', label: 'Kanban Board', icon: Kanban },
    { to: '/tasks/new', label: 'Add Task', icon: PlusCircle },
    { to: '/profile', label: 'User Profile', icon: User },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            zIndex: 40,
            display: 'block',
          }}
        />
      )}

      {/* Sidebar container */}
      <aside
        style={{
          width: isCollapsed ? '78px' : '260px',
          background: '#ffffff',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          position: isOpen ? 'fixed' : 'relative',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 45,
          transform: isOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.25s ease-in-out',
          height: '100vh',
          flexShrink: 0,
        }}
        className={`${isOpen ? 'sidebar-open' : 'sidebar-desktop'} ${isCollapsed ? 'sidebar-collapsed' : ''}`}
      >
        {/* Brand header */}
        <div
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                background: 'var(--primary)',
                color: 'white',
                borderRadius: 'var(--radius-sm)',
                padding: '6px',
                display: 'flex',
              }}
            >
              <CheckSquare size={18} />
            </div>
            <span className="sidebar-brand-name" style={{ fontSize: '1.15rem', fontWeight: 800 }}>TaskFlow</span>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="sidebar-close-btn"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
            }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation links */}
        <nav style={{ padding: '1.25rem 0.85rem', flex: 1 }}>
          <p className="sidebar-section-title"
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-subtle)',
              padding: '0 0.75rem 0.5rem',
            }}
          >
            Navigation
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    // Close sidebar on mobile item click
                    if (window.innerWidth < 1024) onClose();
                  }}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    fontSize: '0.925rem',
                    fontWeight: 600,
                    transition: 'var(--transition)',
                    backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  })}
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </nav>

      </aside>
    </>
  );
};

export default Sidebar;
