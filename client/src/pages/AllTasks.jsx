import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, RefreshCw } from 'lucide-react';
import { taskService } from '../services/taskService';
import TaskCard from '../components/TaskCard';
import TaskFilter from '../components/TaskFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pagination & filter state
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 9,
  });

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 9,
  });

  // Modal delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await taskService.getTasks(filters);
      setTasks(res.tasks || []);
      setPagination({
        page: res.page,
        totalPages: res.totalPages,
        total: res.total,
        limit: filters.limit,
      });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load tasks. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      sortBy: 'createdAt',
      order: 'desc',
      page: 1,
      limit: 9,
    });
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );
      await taskService.updateTask(taskId, { status: newStatus });
      setSuccess(`Task marked as ${newStatus}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update task status');
      fetchTasks(); // Revert on failure
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await taskService.deleteTask(deleteTarget._id);
      setSuccess(`Task "${deleteTarget.title}" deleted successfully`);
      setDeleteTarget(null);
      setTimeout(() => setSuccess(''), 3000);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">All Tasks</h1>
          <p className="page-subtitle">
            Manage, filter, and organize your tasks ({pagination.total} total)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={fetchTasks}
            title="Refresh tasks"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <Link to="/tasks/new" className="btn btn-primary">
            <Plus size={18} />
            New Task
          </Link>
        </div>
      </div>

      <AlertMessage type="error" message={error} onClose={() => setError('')} />
      <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />

      {/* Filter and Search Bar */}
      <TaskFilter
        filters={filters}
        setFilters={setFilters}
        onReset={handleResetFilters}
      />

      {/* Task Content Area */}
      {loading ? (
        <LoadingSpinner text="Retrieving your tasks..." />
      ) : tasks.length === 0 ? (
        <EmptyState
          title={filters.search || filters.status !== 'all' || filters.priority !== 'all' ? 'No matching tasks' : 'No tasks created yet'}
          description={
            filters.search || filters.status !== 'all' || filters.priority !== 'all'
              ? 'Try modifying your search or filter options to find what you are looking for.'
              : 'Keep track of projects and deadlines by creating your first task.'
          }
          actionLink="/tasks/new"
          actionText="Create New Task"
        />
      ) : (
        <>
          <div className="grid-tasks">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDelete={(t) => setDeleteTarget(t)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>

          {/* Pagination Bar */}
          {pagination.totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '2.5rem',
              }}
            >
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={pagination.page <= 1}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                }
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Page <strong>{pagination.page}</strong> of{' '}
                <strong>{pagination.totalPages}</strong>
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                }
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        title="Confirm Task Deletion"
        onClose={() => setDeleteTarget(null)}
      >
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          Are you sure you want to permanently delete{' '}
          <strong style={{ color: 'var(--text-main)' }}>
            "{deleteTarget?.title}"
          </strong>
          ? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setDeleteTarget(null)}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={confirmDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AllTasks;
