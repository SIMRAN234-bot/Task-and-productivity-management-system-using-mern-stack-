import React from 'react';
import { Calendar, CheckCircle2, Clock, Edit2, Tag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const TaskCard = ({ task, onDelete, onStatusChange }) => {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'completed';

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'var(--transition)',
        position: 'relative',
        borderLeft: `4px solid ${
          task.status === 'completed'
            ? 'var(--success)'
            : task.priority === 'high'
            ? 'var(--danger)'
            : task.priority === 'medium'
            ? 'var(--warning)'
            : 'var(--info)'
        }`,
      }}
    >
      <div>
        {/* Header badges */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span className={`badge badge-${task.status}`}>
              {task.status.replace('-', ' ')}
            </span>
            <span className={`badge badge-${task.priority}`}>
              {task.priority}
            </span>
          </div>

          {/* Quick status cycle button */}
          <button
            type="button"
            onClick={() => {
              const nextStatus =
                task.status === 'completed'
                  ? 'pending'
                  : task.status === 'pending'
                  ? 'in-progress'
                  : 'completed';
              onStatusChange(task._id, nextStatus);
            }}
            title={`Current: ${task.status}. Click to cycle status.`}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: task.status === 'completed' ? 'var(--success)' : 'var(--text-muted)',
              display: 'flex',
              padding: '2px',
            }}
          >
            <CheckCircle2 size={20} />
          </button>
        </div>

        {/* Task Title */}
        <h4
          style={{
            fontSize: '1.05rem',
            marginBottom: '0.5rem',
            textDecoration: task.status === 'completed' ? 'line-through' : 'none',
            color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-main)',
            wordBreak: 'break-word',
          }}
        >
          {task.title}
        </h4>

        {/* Task Description */}
        {task.description && (
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
              marginBottom: '1rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-word',
            }}
          >
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
            {task.tags.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.725rem',
                  background: 'var(--bg-muted)',
                  color: 'var(--text-muted)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer info & actions */}
      <div
        style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '0.85rem',
          marginTop: '0.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        {/* Due Date Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
          <Calendar size={14} color={isOverdue ? 'var(--danger)' : 'var(--text-muted)'} />
          {formattedDate ? (
            <span
              style={{
                color: isOverdue ? 'var(--danger)' : 'var(--text-muted)',
                fontWeight: isOverdue ? 600 : 400,
              }}
            >
              {formattedDate} {isOverdue && '(Overdue)'}
            </span>
          ) : (
            <span style={{ color: 'var(--text-subtle)' }}>No due date</span>
          )}
        </div>

        {/* Action icons */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <Link
            to={`/tasks/${task._id}/edit`}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.3rem 0.5rem' }}
            title="Edit task"
          >
            <Edit2 size={14} />
          </Link>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.3rem 0.5rem', color: 'var(--danger)' }}
            onClick={() => onDelete(task)}
            title="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
