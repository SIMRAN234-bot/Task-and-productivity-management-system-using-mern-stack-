import React, { useState } from 'react';
import { Calendar, KeyRound, Mail, Save, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/AlertMessage';

const UserProfile = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      return setError('Name cannot be empty');
    }

    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        return setError('New password must be at least 6 characters long');
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        return setError('New passwords do not match');
      }
      if (!formData.currentPassword) {
        return setError('Please provide your current password to set a new password');
      }
    }

    try {
      setSubmitting(true);
      await updateUser({
        name: formData.name.trim(),
        bio: formData.bio.trim(),
        avatar: formData.avatar.trim(),
        currentPassword: formData.currentPassword || undefined,
        newPassword: formData.newPassword || undefined,
      });

      setSuccess('Profile updated successfully!');
      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }));
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update profile. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formattedJoinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div className="page-container" style={{ maxWidth: '840px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">User Profile</h1>
          <p className="page-subtitle">
            Manage your personal settings, avatar, and security credentials
          </p>
        </div>
      </div>

      <AlertMessage type="error" message={error} onClose={() => setError('')} />
      <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Profile Card Summary */}
        <div className="card" style={{ textAlign: 'center', height: 'fit-content' }}>
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              marginBottom: '1rem',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt={formData.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              user?.name?.charAt(0).toUpperCase() || 'U'
            )}
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{user?.name}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            {user?.email}
          </p>

          <div
            style={{
              padding: '0.75rem',
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}
          >
            <Calendar size={14} /> Member since {formattedJoinDate}
          </div>
        </div>

        {/* Edit Form */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>
              Account Information
            </h3>

            {/* Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email (Readonly for account security) */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={user?.email || ''}
                disabled
                style={{ backgroundColor: 'var(--bg-muted)', cursor: 'not-allowed' }}
              />
              <small style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>
                Primary login email cannot be changed
              </small>
            </div>

            {/* Bio */}
            <div className="form-group">
              <label className="form-label" htmlFor="bio">
                Bio / Status
              </label>
              <textarea
                id="bio"
                name="bio"
                className="form-control"
                rows={3}
                placeholder="Share a short bio or productivity goal..."
                maxLength={250}
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            {/* Avatar URL */}
            <div className="form-group">
              <label className="form-label" htmlFor="avatar">
                Avatar Image URL (Optional)
              </label>
              <input
                id="avatar"
                name="avatar"
                type="url"
                className="form-control"
                placeholder="https://example.com/avatar.jpg"
                value={formData.avatar}
                onChange={handleChange}
              />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1.75rem 0' }} />

            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>
              Security & Password
            </h3>

            {/* Current Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="currentPassword">
                Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                className="form-control"
                placeholder="Enter current password to make security changes"
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </div>

            {/* New Password & Confirm */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
              }}
            >
              <div>
                <label className="form-label" htmlFor="newPassword">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  className="form-control"
                  placeholder="Minimum 6 characters"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="form-label" htmlFor="confirmNewPassword">
                  Confirm New Password
                </label>
                <input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type="password"
                  className="form-control"
                  placeholder="Re-type new password"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Submit */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '1.75rem',
                borderTop: '1px solid var(--border)',
                paddingTop: '1.25rem',
              }}
            >
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                <Save size={18} />
                {submitting ? 'Updating profile...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
