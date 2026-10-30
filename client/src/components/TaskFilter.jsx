import React, { useRef } from 'react';
import { Search, X, Filter, RotateCcw } from 'lucide-react';

const TaskFilter = ({ filters, setFilters, onReset }) => {
  const searchInputRef = useRef(null);

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleClearSearch = () => {
    setFilters((prev) => ({ ...prev, search: '', page: 1 }));
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div
      className="card"
      style={{
        padding: '1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
      }}
    >
      {/* Search Input */}
      <div style={{ position: 'relative', flex: '1 1 260px' }}>
        <Search
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
          ref={searchInputRef}
          type="text"
          placeholder="Search by title, description or tag..."
          className="form-control"
          style={{ paddingLeft: '2.5rem', paddingRight: filters.search ? '2.5rem' : '1rem' }}
          value={filters.search || ''}
          onChange={handleSearchChange}
        />
        {filters.search && (
          <button
            type="button"
            onClick={handleClearSearch}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
            }}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Status Filter */}
      <div style={{ flex: '0 1 160px' }}>
        <select
          className="form-control"
          value={filters.status || 'all'}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }))}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Priority Filter */}
      <div style={{ flex: '0 1 160px' }}>
        <select
          className="form-control"
          value={filters.priority || 'all'}
          onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value, page: 1 }))}
        >
          <option value="all">All Priorities</option>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>

      {/* Sort By */}
      <input aria-label="Due from" type="date" className="form-control date-filter" value={filters.dueFrom || ''} onChange={e=>setFilters(p=>({...p,dueFrom:e.target.value,page:1}))}/>
      <input aria-label="Due to" type="date" className="form-control date-filter" value={filters.dueTo || ''} onChange={e=>setFilters(p=>({...p,dueTo:e.target.value,page:1}))}/>
      {/* Sort By */}
      <div style={{ flex: '0 1 180px' }}>
        <select
          className="form-control"
          value={`${filters.sortBy || 'createdAt'}-${filters.order || 'desc'}`}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split('-');
            setFilters((prev) => ({ ...prev, sortBy, order, page: 1 }));
          }}
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="dueDate-asc">Due Soonest</option>
          <option value="title-asc">Title (A-Z)</option>
        </select>
      </div>

      {/* Reset Button */}
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={onReset}
        title="Reset all filters"
        style={{ height: '42px', padding: '0 0.85rem' }}
      >
        <RotateCcw size={16} />
        Reset
      </button>
    </div>
  );
};

export default TaskFilter;
