import { useEffect, useState } from 'react';
import api from '../api/axios';
import TaskCard from '../components/TaskCard';
import toast from 'react-hot-toast';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks/my');
      const taskList = res.data.tasks || [];
      setTasks(taskList);
      // Compute stats from task list directly so counts are always accurate
      setStats({
        total: taskList.length,
        todo: taskList.filter(t => t.status === 'todo').length,
        inProgress: taskList.filter(t => t.status === 'in-progress').length,
        done: taskList.filter(t => t.status === 'done').length,
        overdue: taskList.filter(t => t.isOverdue).length,
      });
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const { data: updated } = await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(prev => prev.map(t => t._id === taskId ? updated.task : t));
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filtered = filter === 'all' ? tasks
    : filter === 'overdue' ? tasks.filter(t => t.isOverdue)
    : tasks.filter(t => t.status === filter);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
      <div style={{ width: 32, height: 32, border: '3px solid #e0e8f8', borderTopColor: '#1a9fd4', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--txt-1)' }}>My Tasks</h1>
        <p style={{ color: 'var(--txt-3)', marginTop: 4, fontSize: 13 }}>Tasks assigned to you across all projects</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { key: 'all', label: 'All', value: stats.total },
          { key: 'todo', label: 'To Do', value: stats.todo },
          { key: 'in-progress', label: 'In Progress', value: stats.inProgress },
          { key: 'done', label: 'Done', value: stats.done },
          { key: 'overdue', label: 'Overdue', value: stats.overdue },
        ].map(s => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            style={{
              background: filter === s.key ? '#EBF3FE' : '#fff',
              border: filter === s.key ? '1.5px solid #1a9fd4' : '1.5px solid var(--border)',
              borderRadius: 14,
              padding: '16px 12px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <p style={{
              fontSize: 26,
              fontWeight: 600,
              color: s.key === 'overdue' && s.value > 0 ? '#ef4444' : 'var(--txt-1)',
              lineHeight: 1,
            }}>
              {s.value}
            </p>
            <p style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: 6 }}>{s.label}</p>
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {filtered.map(task => (
            <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />
          ))}
        </div>
      ) : (
        <div style={{
          background: '#fff',
          border: '1.5px solid var(--border)',
          borderRadius: 14,
          padding: '64px 24px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--txt-1)', marginBottom: 8 }}>No tasks here!</h2>
          <p style={{ color: 'var(--txt-3)', fontSize: 13 }}>
            {filter === 'overdue' ? "You're all caught up — no overdue tasks!" : "No tasks assigned to you yet."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Tasks;