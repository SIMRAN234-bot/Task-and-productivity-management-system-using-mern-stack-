import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ListTodo,
  Plus,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import EmptyState from '../components/EmptyState';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await taskService.getTaskStats();
      setStats(res.stats);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load dashboard statistics. Please ensure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading productivity insights..." />;
  }

  const {
    totalTasks = 0,
    completedTasks = 0,
    pendingTasks = 0,
    inProgressTasks = 0,
    overdueTasks = 0,
    completionRate = 0,
    priorityBreakdown = { low: 0, medium: 0, high: 0 },
    recentActivity = [],
    weeklyCompletion = [], monthlyProductivity = [], upcomingTasks = [],
  } = stats || {};

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Hello, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="page-subtitle">
            Here is your daily task and productivity summary.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/tasks/new" className="btn btn-primary">
            <Plus size={18} />
            Create Task
          </Link>
          <Link to="/tasks" className="btn btn-secondary">
            View All Tasks
          </Link>
        </div>
      </div>

      <AlertMessage type="error" message={error} onClose={() => setError('')} />

      {/* Primary Metrics Grid */}
      <div className="grid-stats">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          icon={ListTodo}
          color="var(--primary)"
          subtitle="All recorded tasks"
        />
        <StatCard
          title="Completed"
          value={completedTasks}
          icon={CheckCircle2}
          color="var(--success)"
          subtitle={`${completionRate}% completion rate`}
        />
        <StatCard
          title="In Progress"
          value={inProgressTasks}
          icon={Clock}
          color="var(--info)"
          subtitle="Actively working"
        />
        <StatCard
          title="Overdue Tasks"
          value={overdueTasks}
          icon={AlertTriangle}
          color="var(--danger)"
          subtitle="Requires attention"
        />
      </div>

      {/* Progress & Breakdown Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Productivity Completion Rate */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <TrendingUp size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem' }}>Productivity Score</h3>
          </div>

          <div style={{ margin: '1.25rem 0' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: '0.5rem',
              }}
            >
              <span>Overall Completion</span>
              <span>{completionRate}%</span>
            </div>
            {/* Progress track */}
            <div
              style={{
                width: '100%',
                height: '10px',
                backgroundColor: 'var(--bg-muted)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${completionRate}%`,
                  height: '100%',
                  backgroundColor:
                    completionRate >= 75
                      ? 'var(--success)'
                      : completionRate >= 40
                      ? 'var(--primary)'
                      : 'var(--warning)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.6s ease-in-out',
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.75rem',
              background: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Pending: </span>
              <strong>{pendingTasks}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>In-Progress: </span>
              <strong>{inProgressTasks}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Completed: </span>
              <strong>{completedTasks}</strong>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Priority Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* High */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--danger)' }} />
                  High Priority
                </span>
                <span>{priorityBreakdown.high}</span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-muted)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: 'var(--danger)',
                    width: totalTasks > 0 ? `${(priorityBreakdown.high / totalTasks) * 100}%` : '0%',
                  }}
                />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning)' }} />
                  Medium Priority
                </span>
                <span>{priorityBreakdown.medium}</span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-muted)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: 'var(--warning)',
                    width: totalTasks > 0 ? `${(priorityBreakdown.medium / totalTasks) * 100}%` : '0%',
                  }}
                />
              </div>
            </div>

            {/* Low */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#64748b' }} />
                  Low Priority
                </span>
                <span>{priorityBreakdown.low}</span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-muted)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: '#64748b',
                    width: totalTasks > 0 ? `${(priorityBreakdown.low / totalTasks) * 100}%` : '0%',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table / List */}
      <div className="analytics-grid"><section className="card"><h3>Weekly task completion</h3><p className="page-subtitle">Tasks completed over the last seven days</p><div className="chart-frame"><ResponsiveContainer width="100%" height="100%"><BarChart data={weeklyCompletion}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="_id" tickFormatter={v=>new Date(`${v}T00:00:00`).toLocaleDateString(undefined,{weekday:'short'})}/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="count" fill="#4f46e5" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div></section><section className="card"><h3>Monthly productivity</h3><p className="page-subtitle">Completed tasks this month</p><div className="chart-frame"><ResponsiveContainer width="100%" height="100%"><AreaChart data={monthlyProductivity}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="_id" tickFormatter={v=>new Date(`${v}T00:00:00`).getDate()}/><YAxis allowDecimals={false}/><Tooltip/><Area dataKey="count" stroke="#4f46e5" fill="#c7d2fe"/></AreaChart></ResponsiveContainer></div></section></div>
      <section className="card upcoming-panel"><div className="page-header"><div><h3>Upcoming deadlines</h3><p className="page-subtitle">Your next tasks that need attention</p></div><Link to="/calendar">Open calendar →</Link></div>{upcomingTasks.length ? upcomingTasks.map(t=><Link key={t._id} className="deadline-row" to={`/tasks/${t._id}/edit`}><span className={`badge badge-${t.priority}`}>{t.priority}</span><strong>{t.title}</strong><span>{new Date(t.dueDate).toLocaleDateString()}</span></Link>) : <p className="page-subtitle">Nothing due soon. You’re all caught up.</p>}</section>
      {/* Recent Activity Table / List */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
          }}
        >
          <h3 style={{ fontSize: '1.2rem' }}>Recently Updated Tasks</h3>
          <Link
            to="/tasks"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: 'var(--primary)',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {recentActivity.length === 0 ? (
          <EmptyState
            title="No tasks created yet"
            description="Start building your productive workflow by creating your very first task."
            actionLink="/tasks/new"
            actionText="Create First Task"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentActivity.map((task) => (
              <div
                key={task._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: 'var(--radius-md)',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className={`badge badge-${task.status}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{task.title}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                  <Link
                    to={`/tasks/${task._id}/edit`}
                    className="btn btn-secondary btn-sm"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
