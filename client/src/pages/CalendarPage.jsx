import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../services/taskService';
import AlertMessage from '../components/AlertMessage';

export default function CalendarPage() {
  const [tasks, setTasks] = useState([]); const [cursor, setCursor] = useState(new Date()); const [mode, setMode] = useState('month'); const [error, setError] = useState('');
  useEffect(() => { taskService.getTasks({ limit: 100, sortBy: 'dueDate', order: 'asc' }).then(r => setTasks(r.tasks || [])).catch(e => setError(e.response?.data?.message || 'Could not load calendar')); }, []);
  const start = new Date(cursor.getFullYear(), cursor.getMonth(), 1); const gridStart = new Date(start); gridStart.setDate(1 - start.getDay());
  if (mode === 'week') { gridStart.setTime(cursor.getTime()); gridStart.setDate(cursor.getDate() - cursor.getDay()); gridStart.setHours(0,0,0,0); }
  const days = Array.from({ length: mode === 'month' ? 42 : mode === 'week' ? 7 : 1 }, (_, i) => { const d = new Date(gridStart); d.setDate(d.getDate() + i); return d; });
  if (mode === 'day') days[0] = new Date(cursor);
  const move = amount => setCursor(d => { const n = new Date(d); n.setDate(n.getDate() + (mode === 'month' ? amount * 30 : mode === 'week' ? amount * 7 : amount)); return n; });
  const localDate = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  return <div className="page-container"><div className="page-header"><div><h1 className="page-title">Calendar</h1><p className="page-subtitle">Your deadlines, mapped out.</p></div><div className="calendar-tools"><button className="btn btn-secondary" onClick={() => move(-1)}>‹</button><strong>{cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</strong><button className="btn btn-secondary" onClick={() => move(1)}>›</button>{['day','week','month'].map(x => <button key={x} className={`btn ${mode===x?'btn-primary':'btn-secondary'}`} onClick={() => setMode(x)}>{x}</button>)}</div></div><AlertMessage type="error" message={error}/><div className={`calendar-grid calendar-${mode}`}>{mode === 'month' && ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(x => <strong className="calendar-weekday" key={x}>{x}</strong>)}{days.map(day => { const key = day.toDateString(); const due = tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === key); return <section className={`calendar-day ${day.getMonth() !== cursor.getMonth() && mode==='month' ? 'muted':''}`} key={key}><header><button onClick={() => setCursor(day)}>{day.toLocaleDateString(undefined,{weekday:mode==='day'?'long':undefined,day:'numeric',month:mode==='day'?'long':undefined})}</button><Link to={`/tasks/new?dueDate=${localDate(day)}`} aria-label="Create task for date">+</Link></header>{due.map(t => <Link className={`calendar-task badge-${t.status}`} key={t._id} to={`/tasks/${t._id}/edit`}><span>{t.title}</span><small>{t.status.replace('-',' ')} · {t.priority}</small></Link>)}</section>; })}</div></div>;
}
