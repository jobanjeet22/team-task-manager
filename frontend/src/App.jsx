import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';
import api from './api/axios';
import toast from 'react-hot-toast';

// Global notifications store — lives outside components so any component can push to it
let _pushNotif = null;
export const pushNotification = (msg, type = 'info') => {
  if (_pushNotif) _pushNotif({ msg, type, time: new Date() });
};

const NewTaskModal = ({ onClose, onCreated }) => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '', project: '', status: 'todo' });
  const [creating, setCreating] = useState(false);

  useState(() => {
    api.get('/projects').then(res => setProjects(res.data.projects || [])).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.project) return toast.error('Please select a project');
    setCreating(true);
    try {
      const payload = { ...form };
      if (!payload.dueDate) delete payload.dueDate;
      const { data } = await api.post('/tasks', payload);
      const taskTitle = data.task?.title || form.title;
      const projectName = projects.find(p => p._id === form.project)?.name || 'project';
      toast.success('Task created!');
      pushNotification(`✅ Task "${taskTitle}" created in ${projectName}`, 'success');
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 480, border: '1.5px solid var(--border)', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--txt-1)', marginBottom: 20 }}>New Task</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Task title *</label>
            <input type="text" className="input" placeholder="e.g. Design homepage mockup"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={3} style={{ resize: 'none' }}
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="label">Project *</label>
            <select className="input" value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} required>
              <option value="">Select a project</option>
              {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="label">Priority</label>
              <select className="input" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Due date</label>
            <input type="date" className="input" value={form.dueDate}
              onChange={e => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, background: 'var(--bg)', color: 'var(--txt-2)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '10px 0', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={creating}
              style={{ flex: 1, background: '#1a9fd4', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 0', fontSize: 13, fontWeight: 600, cursor: creating ? 'not-allowed' : 'pointer', opacity: creating ? 0.7 : 1 }}>
              {creating ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const timeAgo = (date) => {
  const diff = Math.floor((new Date() - new Date(date)) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const NotifDropdown = ({ notifications, onClose, onClear }) => {
  const navigate = useNavigate();
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 98 }} onClick={onClose} />
      <div style={{
        position: 'absolute', top: 44, right: 0,
        background: '#fff', border: '1.5px solid var(--border)',
        borderRadius: 14, width: 300, zIndex: 99,
        boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-1)' }}>
            Notifications {notifications.length > 0 && <span style={{ background: '#1a9fd4', color: '#fff', fontSize: 10, borderRadius: 10, padding: '1px 6px', marginLeft: 4 }}>{notifications.length}</span>}
          </p>
          {notifications.length > 0 && (
            <button onClick={onClear} style={{ fontSize: 11, color: 'var(--txt-3)', background: 'none', border: 'none', cursor: 'pointer' }}>
              Clear all
            </button>
          )}
        </div>

        {/* List */}
        <div style={{ maxHeight: 280, overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔔</div>
              <p style={{ fontSize: 12, color: 'var(--txt-3)' }}>No notifications yet</p>
              <p style={{ fontSize: 11, color: 'var(--txt-4)', marginTop: 4 }}>Actions like creating tasks or updating status will appear here</p>
            </div>
          ) : (
            notifications.map((n, i) => (
              <div key={i} style={{
                padding: '10px 16px',
                borderBottom: i < notifications.length - 1 ? '1px solid var(--border2)' : 'none',
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <div style={{ fontSize: 16, marginTop: 1, flexShrink: 0 }}>
                  {n.msg.startsWith('✅') ? '✅' : n.msg.startsWith('🔄') ? '🔄' : n.msg.startsWith('🗑') ? '🗑️' : n.msg.startsWith('📁') ? '📁' : '🔔'}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, color: 'var(--txt-2)', lineHeight: 1.4 }}>{n.msg.replace(/^[^\s]+\s/, '')}</p>
                  <p style={{ fontSize: 10, color: 'var(--txt-4)', marginTop: 3 }}>{timeAgo(n.time)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border2)' }}>
          <button
            onClick={() => { navigate('/tasks'); onClose(); }}
            style={{ width: '100%', background: '#1a9fd4', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 0', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            View My Tasks
          </button>
        </div>
      </div>
    </>
  );
};

const Layout = ({ children }) => {
  const { user } = useAuth();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Register the global push function
  _pushNotif = useCallback((notif) => {
    setNotifications(prev => [notif, ...prev].slice(0, 20));
  }, []);

  const unreadCount = notifications.length;

  if (!user) return children;
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <div className="app-topbar">
          <div className="app-topbar-right">
            <input className="app-search" placeholder="Search tasks or projects..." />

            {/* Bell */}
            <div className="notif-wrap" style={{ position: 'relative' }}>
              <button
                className="app-notif-btn"
                title="Notifications"
                onClick={() => setShowNotif(p => !p)}
              >
                <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {unreadCount > 0 && <span className="notif-dot" />}
              {showNotif && (
                <NotifDropdown
                  notifications={notifications}
                  onClose={() => setShowNotif(false)}
                  onClear={() => setNotifications([])}
                />
              )}
            </div>

            {/* New Task */}
            <button className="app-new-btn" onClick={() => setShowTaskModal(true)}>
              + New Task
            </button>
          </div>
        </div>
        <main className="app-content">{children}</main>
      </div>

      {showTaskModal && (
        <NewTaskModal
          onClose={() => setShowTaskModal(false)}
          onCreated={() => {}}
        />
      )}
    </div>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#fff', color: '#1e2d4a', border: '1.5px solid #e0e8f8', borderRadius: '12px', fontSize: '13px' },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </AuthProvider>
  </BrowserRouter>
);

export default App;