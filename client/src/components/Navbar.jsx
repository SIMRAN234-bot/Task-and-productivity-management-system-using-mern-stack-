import React, { useState, useEffect } from 'react';
import { CheckSquare, LogOut, Menu, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [bellOpen, setBellOpen] = useState(false);
  useEffect(() => { if (isAuthenticated) taskService.getNotifications().then(r => setNotifications(r.notifications || [])).catch(() => {}); }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        background: '#ffffff',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {/* Brand / Logo + Sidebar toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated && (
            <button
              onClick={onToggleSidebar}
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.4rem', border: 'none' }}
              aria-label="Toggle navigation menu"
            >
              <Menu size={20} />
            </button>
          )}

          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              color: 'var(--text-main)',
            }}
          >
            <div
              style={{
                background: 'var(--primary)',
                color: 'white',
                borderRadius: 'var(--radius-sm)',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckSquare size={20} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Task<span style={{ color: 'var(--primary)' }}>Flow</span>
            </span>
          </Link>
        </div>

        {/* User Navigation & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ position: 'relative' }}><button className="btn btn-secondary btn-sm" aria-label="Notifications" onClick={() => setBellOpen(v => !v)}><Bell size={17}/>{notifications.some(n => !n.read) && <span className="notification-dot"/>}</button>{bellOpen && <div className="notification-menu"><strong>Deadlines</strong>{notifications.length ? notifications.map(n => <button key={n._id} className="notification-item" onClick={async () => { if (!n.read) { await taskService.markNotificationRead(n._id); setNotifications(xs => xs.map(x => x._id === n._id ? {...x, read:true} : x)); } if (n.task?._id) navigate(`/tasks/${n.task._id}/edit`); setBellOpen(false); }}><span className={`badge badge-${n.kind === 'overdue' ? 'high' : 'medium'}`}>{n.kind}</span><span>{n.task?.title || 'Task deadline'}</span></button>) : <small>No upcoming reminders</small>}</div>}</div>
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  color: 'var(--text-main)',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                  }}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <span
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    display: 'none',
                    maxWidth: '120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  className="nav-username"
                >
                  {user?.name}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                type="button"
                className="btn btn-secondary btn-sm"
                title="Log Out"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <LogOut size={16} />
                <span style={{ display: 'none' }} className="nav-logout-text">Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
