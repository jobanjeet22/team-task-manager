import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProjectCard from '../components/ProjectCard';
import toast from 'react-hot-toast';

const COLORS = ['#4f6ef7', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', deadline: '', color: '#4f6ef7' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data.projects);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { data } = await api.post('/projects', form);
      setProjects(prev => [data.project, ...prev]);
      setShowModal(false);
      setForm({ name: '', description: '', deadline: '', color: '#4f6ef7' });
      toast.success('Project created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
      <div style={{ width: 32, height: 32, border: '3px solid #e0e8f8', borderTopColor: '#1a9fd4', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--txt-1)' }}>Projects</h1>
          <p style={{ color: 'var(--txt-3)', marginTop: 4, fontSize: 13 }}>
            {projects.length} project{projects.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: '#1a9fd4',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '9px 18px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + New Project
        </button>
      </div>

      {projects.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {projects.map(p => <ProjectCard key={p._id} project={p} />)}
        </div>
      ) : (
        <div style={{
          background: '#fff',
          border: '1.5px solid var(--border)',
          borderRadius: 14,
          padding: '64px 24px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--txt-1)', marginBottom: 8 }}>No projects yet</h2>
          <p style={{ color: 'var(--txt-3)', fontSize: 13, marginBottom: 20 }}>Create your first project to start managing tasks.</p>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: '#1a9fd4',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '9px 18px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Create Project
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 50, padding: 16,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: '#fff', borderRadius: 16, padding: 24,
              width: '100%', maxWidth: 440,
              border: '1.5px solid var(--border)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--txt-1)', marginBottom: 20 }}>New Project</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="label">Project name *</label>
                <input type="text" className="input" placeholder="e.g. Website Redesign"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input resize-none" rows={3} placeholder="What's this project about?"
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <label className="label">Deadline</label>
                <input type="date" className="input" value={form.deadline}
                  onChange={e => setForm({ ...form, deadline: e.target.value })} />
              </div>
              <div>
                <label className="label">Color</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {COLORS.map(c => (
                    <button type="button" key={c}
                      onClick={() => setForm({ ...form, color: c })}
                      style={{
                        width: 32, height: 32, borderRadius: 8,
                        backgroundColor: c, border: 'none', cursor: 'pointer',
                        outline: form.color === c ? '3px solid #1a9fd4' : 'none',
                        outlineOffset: 2,
                        transform: form.color === c ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.15s',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1, background: 'var(--bg)', color: 'var(--txt-2)',
                    border: '1.5px solid var(--border)', borderRadius: 10,
                    padding: '10px 0', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    flex: 1, background: '#1a9fd4', color: '#fff',
                    border: 'none', borderRadius: 10,
                    padding: '10px 0', fontSize: 13, fontWeight: 600,
                    cursor: creating ? 'not-allowed' : 'pointer',
                    opacity: creating ? 0.7 : 1,
                  }}
                >
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;