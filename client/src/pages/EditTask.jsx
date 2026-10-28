import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Tag } from 'lucide-react';
import { taskService } from '../services/taskService';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    tags: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const res = await taskService.getTaskById(id);
        const task = res.task;

        let formattedDueDate = '';
        if (task.dueDate) {
          const dateObj = new Date(task.dueDate);
          formattedDueDate = dateObj.toISOString().split('T')[0];
        }

        setFormData({
          title: task.title || '',
          description: task.description || '',
          status: task.status || 'pending',
          priority: task.priority || 'medium',
          dueDate: formattedDueDate,
          tags: Array.isArray(task.tags) ? task.tags.join(', ') : '',
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Failed to load task. It may have been deleted or you do not have permission to access it.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return setError('Please provide a title for the task');
    }

    try {
      setSubmitting(true);
      await taskService.updateTask(id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        tags: formData.tags,
      });

      navigate('/tasks');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to update task. Please verify your inputs.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Fetching task details..." />;
  }

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/tasks"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            textDecoration: 'none',
            marginBottom: '0.75rem',
          }}
        >
          <ArrowLeft size={16} /> Back to All Tasks
        </Link>
        <h1 className="page-title">Edit Task</h1>
        <p className="page-subtitle">
          Update task priority, progression status, and deadlines
        </p>
      </div>

      <AlertMessage type="error" message={error} onClose={() => setError('')} />

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Task Title <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-control"
              maxLength={120}
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows={4}
              maxLength={2000}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Status & Priority Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            {/* Status */}
            <div>
              <label className="form-label" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="form-label" htmlFor="priority">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                className="form-control"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="form-label" htmlFor="dueDate">
                Due Date
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                className="form-control"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label" htmlFor="tags">
              Tags
            </label>
            <div style={{ position: 'relative' }}>
              <Tag
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                id="tags"
                name="tags"
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Comma separated: frontend, api, urgent"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '1.75rem',
              borderTop: '1px solid var(--border)',
              paddingTop: '1.25rem',
            }}
          >
            <Link to="/tasks" className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              <Save size={18} />
              {submitting ? 'Saving changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;
