// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../api/axios';
// import { useAuth } from '../context/AuthContext';
// import TaskCard from '../components/TaskCard';
// import { formatDate, getInitials } from '../utils/helpers';
// import toast from 'react-hot-toast';

// const STATUSES = ['todo', 'in-progress', 'done'];
// const STATUS_LABELS = { 'todo': 'To Do', 'in-progress': 'In Progress', 'done': 'Done' };

// const ProjectDetail = () => {
//   const { id } = useParams();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [project, setProject] = useState(null);
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showTaskModal, setShowTaskModal] = useState(false);
//   const [showMemberModal, setShowMemberModal] = useState(false);
//   const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '', status: 'todo' });
//   const [memberEmail, setMemberEmail] = useState('');
//   const [memberRole, setMemberRole] = useState('member');
//   const [creating, setCreating] = useState(false);
//   const [filter, setFilter] = useState('all');

//   const isOwner = project?.owner?._id === user?._id || project?.owner === user?._id;

//   useEffect(() => {
//     fetchProject();
//     fetchTasks();
//   }, [id]);

//   const fetchProject = async () => {
//     try {
//       const { data } = await api.get(`/projects/${id}`);
//       setProject(data.project);
//     } catch (err) {
//       toast.error('Project not found');
//       navigate('/projects');
//     }
//   };

//   const fetchTasks = async () => {
//     try {
//       const { data } = await api.get(`/tasks/project/${id}`);
//       setTasks(data.tasks);
//     } catch (err) {
//       toast.error('Failed to load tasks');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateTask = async (e) => {
//     e.preventDefault();
//     setCreating(true);
//     try {
//       const payload = { ...taskForm, project: id };
//       if (!payload.assignedTo) delete payload.assignedTo;
//       if (!payload.dueDate) delete payload.dueDate;
//       const { data } = await api.post('/tasks', payload);
//       setTasks(prev => [data.task, ...prev]);
//       setShowTaskModal(false);
//       setTaskForm({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '', status: 'todo' });
//       toast.success('Task created!');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to create task');
//     } finally {
//       setCreating(false);
//     }
//   };

//   const handleStatusChange = async (taskId, newStatus) => {
//     try {
//       const { data } = await api.put(`/tasks/${taskId}`, { status: newStatus });
//       setTasks(prev => prev.map(t => t._id === taskId ? data.task : t));
//       toast.success('Status updated');
//     } catch (err) {
//       toast.error('Failed to update status');
//     }
//   };

//   const handleDeleteTask = async (taskId) => {
//     if (!window.confirm('Delete this task?')) return;
//     try {
//       await api.delete(`/tasks/${taskId}`);
//       setTasks(prev => prev.filter(t => t._id !== taskId));
//       toast.success('Task deleted');
//     } catch (err) {
//       toast.error('Failed to delete task');
//     }
//   };

//   const handleAddMember = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await api.post(`/projects/${id}/members`, { email: memberEmail, role: memberRole });
//       setProject(data.project);
//       setMemberEmail('');
//       setShowMemberModal(false);
//       toast.success('Member added!');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to add member');
//     }
//   };

//   const handleRemoveMember = async (userId) => {
//     if (!window.confirm('Remove this member?')) return;
//     try {
//       await api.delete(`/projects/${id}/members/${userId}`);
//       setProject(prev => ({ ...prev, members: prev.members.filter(m => m.user._id !== userId) }));
//       toast.success('Member removed');
//     } catch (err) {
//       toast.error('Failed to remove member');
//     }
//   };

//   const handleDeleteProject = async () => {
//     if (!window.confirm('Delete this project and ALL its tasks? This cannot be undone.')) return;
//     try {
//       await api.delete(`/projects/${id}`);
//       toast.success('Project deleted');
//       navigate('/projects');
//     } catch (err) {
//       toast.error('Failed to delete project');
//     }
//   };

//   const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

//   if (loading || !project) return (
//     <div className="flex items-center justify-center h-64">
//       <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
//     </div>
//   );

//   const tasksByStatus = STATUSES.reduce((acc, s) => {
//     acc[s] = tasks.filter(t => t.status === s);
//     return acc;
//   }, {});

//   return (
//     <div className="fade-in">
//       {/* Header */}
//       <div className="flex items-start justify-between mb-6 gap-4">
//         <div className="flex items-start gap-4">
//           <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0"
//             style={{ backgroundColor: project.color || '#4f6ef7' }}>
//             {project.name[0].toUpperCase()}
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold">{project.name}</h1>
//             {project.description && <p className="text-slate-400 mt-1 text-sm">{project.description}</p>}
//             <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
//               <span>Owner: {project.owner?.name}</span>
//               {project.deadline && <span>Due {formatDate(project.deadline)}</span>}
//               <span className="capitalize px-2 py-0.5 bg-slate-800 rounded-full">{project.status}</span>
//             </div>
//           </div>
//         </div>
//         <div className="flex gap-2 shrink-0">
//           <button onClick={() => setShowTaskModal(true)} className="btn-primary text-sm">+ Task</button>
//           {isOwner && (
//             <>
//               <button onClick={() => setShowMemberModal(true)} className="btn-secondary text-sm">+ Member</button>
//               <button onClick={handleDeleteProject} className="btn-danger text-sm">Delete</button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Stats row */}
//       <div className="grid grid-cols-3 gap-3 mb-6">
//         {STATUSES.map(s => (
//           <div key={s} className="card p-4 text-center">
//             <p className="text-2xl font-bold">{tasksByStatus[s]?.length || 0}</p>
//             <p className="text-xs text-slate-400 mt-1">{STATUS_LABELS[s]}</p>
//           </div>
//         ))}
//       </div>

//       {/* Members */}
//       <div className="card p-4 mb-6">
//         <div className="flex items-center justify-between mb-3">
//           <h3 className="font-semibold text-sm">Team Members</h3>
//           <span className="text-xs text-slate-500">{project.members?.length} member{project.members?.length !== 1 ? 's' : ''}</span>
//         </div>
//         <div className="flex flex-wrap gap-2">
//           {project.members?.map(m => (
//             <div key={m.user?._id} className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-2">
//               <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-400">
//                 {getInitials(m.user?.name)}
//               </div>
//               <span className="text-sm">{m.user?.name}</span>
//               <span className="text-xs text-slate-500 capitalize">({m.role})</span>
//               {isOwner && m.user?._id !== user?._id && (
//                 <button onClick={() => handleRemoveMember(m.user._id)} className="text-slate-600 hover:text-red-400 text-xs ml-1">✕</button>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Filter */}
//       <div className="flex gap-2 mb-4 flex-wrap">
//         {['all', ...STATUSES].map(f => (
//           <button key={f} onClick={() => setFilter(f)}
//             className={`text-sm px-4 py-2 rounded-xl font-medium transition-colors capitalize ${filter === f ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
//             {f === 'all' ? 'All' : STATUS_LABELS[f]} {f === 'all' ? `(${tasks.length})` : `(${tasksByStatus[f]?.length})`}
//           </button>
//         ))}
//       </div>

//       {/* Tasks */}
//       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {filteredTasks.length > 0 ? filteredTasks.map(task => (
//           <TaskCard key={task._id} task={task}
//             onStatusChange={handleStatusChange}
//             onDelete={handleDeleteTask}
//             canDelete={isOwner || task.createdBy?._id === user?._id} />
//         )) : (
//           <div className="col-span-3 card p-12 text-center">
//             <p className="text-slate-500">No tasks {filter !== 'all' ? `with status "${STATUS_LABELS[filter]}"` : 'yet'}</p>
//             <button onClick={() => setShowTaskModal(true)} className="btn-primary mt-4 text-sm">Create Task</button>
//           </div>
//         )}
//       </div>

//       {/* Task Modal */}
//       {showTaskModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowTaskModal(false)}>
//           <div className="card p-6 w-full max-w-lg fade-in max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
//             <h2 className="text-xl font-bold mb-6">New Task</h2>
//             <form onSubmit={handleCreateTask} className="space-y-4">
//               <div>
//                 <label className="label">Task title *</label>
//                 <input type="text" className="input" placeholder="e.g. Design homepage mockup"
//                   value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} required />
//               </div>
//               <div>
//                 <label className="label">Description</label>
//                 <textarea className="input resize-none" rows={3}
//                   value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="label">Priority</label>
//                   <select className="input" value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}>
//                     <option value="low">Low</option>
//                     <option value="medium">Medium</option>
//                     <option value="high">High</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="label">Status</label>
//                   <select className="input" value={taskForm.status} onChange={e => setTaskForm({ ...taskForm, status: e.target.value })}>
//                     <option value="todo">To Do</option>
//                     <option value="in-progress">In Progress</option>
//                     <option value="done">Done</option>
//                   </select>
//                 </div>
//               </div>
//               <div>
//                 <label className="label">Assign to (User ID or leave blank)</label>
//                 <select className="input" value={taskForm.assignedTo} onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })}>
//                   <option value="">Unassigned</option>
//                   {project.members?.map(m => (
//                     <option key={m.user?._id} value={m.user?._id}>{m.user?.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="label">Due date</label>
//                 <input type="date" className="input" value={taskForm.dueDate}
//                   onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
//               </div>
//               <div className="flex gap-3 pt-2">
//                 <button type="button" onClick={() => setShowTaskModal(false)} className="btn-secondary flex-1">Cancel</button>
//                 <button type="submit" className="btn-primary flex-1" disabled={creating}>
//                   {creating ? 'Creating...' : 'Create Task'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Member Modal */}
//       {showMemberModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowMemberModal(false)}>
//           <div className="card p-6 w-full max-w-md fade-in" onClick={e => e.stopPropagation()}>
//             <h2 className="text-xl font-bold mb-6">Add Team Member</h2>
//             <form onSubmit={handleAddMember} className="space-y-4">
//               <div>
//                 <label className="label">Member email *</label>
//                 <input type="email" className="input" placeholder="colleague@example.com"
//                   value={memberEmail} onChange={e => setMemberEmail(e.target.value)} required />
//               </div>
//               <div>
//                 <label className="label">Role</label>
//                 <select className="input" value={memberRole} onChange={e => setMemberRole(e.target.value)}>
//                   <option value="member">Member</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>
//               <div className="flex gap-3 pt-2">
//                 <button type="button" onClick={() => setShowMemberModal(false)} className="btn-secondary flex-1">Cancel</button>
//                 <button type="submit" className="btn-primary flex-1">Add Member</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectDetail;


import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import { formatDate, getInitials } from '../utils/helpers';
import toast from 'react-hot-toast';

const STATUSES = ['todo', 'in-progress', 'done'];
const STATUS_LABELS = { 'todo': 'To Do', 'in-progress': 'In Progress', 'done': 'Done' };

const btnPrimary = {
  background: '#1a6fd4',
  color: 'white',
  border: 'none',
  borderRadius: 8,
  padding: '7px 14px',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
};

const btnSecondary = {
  background: 'white',
  color: '#1a6fd4',
  border: '1.5px solid #1a6fd4',
  borderRadius: 8,
  padding: '6px 14px',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
};

const btnDanger = {
  background: '#FEF0F0',
  color: '#A32D2D',
  border: '1.5px solid #F09595',
  borderRadius: 8,
  padding: '6px 14px',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
};

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '', status: 'todo' });
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('member');
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState('all');

  const isOwner = project?.owner?._id === user?._id || project?.owner === user?._id;

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data.project);
    } catch (err) {
      toast.error('Project not found');
      navigate('/projects');
    }
  };

  const fetchTasks = async () => {
    try {
      const { data } = await api.get(`/tasks/project/${id}`);
      setTasks(data.tasks);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = { ...taskForm, project: id };
      if (!payload.assignedTo) delete payload.assignedTo;
      if (!payload.dueDate) delete payload.dueDate;
      const { data } = await api.post('/tasks', payload);
      setTasks(prev => [data.task, ...prev]);
      setShowTaskModal(false);
      setTaskForm({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '', status: 'todo' });
      toast.success('Task created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const { data } = await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(prev => prev.map(t => t._id === taskId ? data.task : t));
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t._id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/projects/${id}/members`, { email: memberEmail, role: memberRole });
      setProject(data.project);
      setMemberEmail('');
      setShowMemberModal(false);
      toast.success('Member added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      setProject(prev => ({ ...prev, members: prev.members.filter(m => m.user._id !== userId) }));
      toast.success('Member removed');
    } catch (err) {
      toast.error('Failed to remove member');
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Delete this project and ALL its tasks? This cannot be undone.')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      navigate('/projects');
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  if (loading || !project) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const tasksByStatus = STATUSES.reduce((acc, s) => {
    acc[s] = tasks.filter(t => t.status === s);
    return acc;
  }, {});

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0"
            style={{ backgroundColor: project.color || '#1a6fd4' }}
          >
            {project.name[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            {project.description && <p className="text-slate-400 mt-1 text-sm">{project.description}</p>}
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
              <span>Owner: {project.owner?.name}</span>
              {project.deadline && <span>Due {formatDate(project.deadline)}</span>}
              <span className="capitalize px-2 py-0.5 bg-slate-800 rounded-full">{project.status}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setShowTaskModal(true)} style={btnPrimary}>+ Task</button>
          {isOwner && (
            <>
              <button onClick={() => setShowMemberModal(true)} style={btnSecondary}>+ Member</button>
              <button onClick={handleDeleteProject} style={btnDanger}>Delete</button>
            </>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {STATUSES.map(s => (
          <div key={s} className="card p-4 text-center">
            <p className="text-2xl font-bold">{tasksByStatus[s]?.length || 0}</p>
            <p className="text-xs text-slate-400 mt-1">{STATUS_LABELS[s]}</p>
          </div>
        ))}
      </div>

      {/* Members */}
      <div className="card p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Team Members</h3>
          <span className="text-xs text-slate-500">{project.members?.length} member{project.members?.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.members?.map(m => (
            <div key={m.user?._id} className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-2">
              <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-400">
                {getInitials(m.user?.name)}
              </div>
              <span className="text-sm">{m.user?.name}</span>
              <span className="text-xs text-slate-500 capitalize">({m.role})</span>
              {isOwner && m.user?._id !== user?._id && (
                <button onClick={() => handleRemoveMember(m.user._id)} className="text-slate-600 hover:text-red-400 text-xs ml-1">✕</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', ...STATUSES].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              fontSize: 13,
              padding: '6px 14px',
              borderRadius: 10,
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s',
              background: filter === f ? '#1a6fd4' : '#1e2d4a',
              color: filter === f ? 'white' : '#94a3b8',
            }}
          >
            {f === 'all' ? 'All' : STATUS_LABELS[f]} {f === 'all' ? `(${tasks.length})` : `(${tasksByStatus[f]?.length})`}
          </button>
        ))}
      </div>

      {/* Tasks */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.length > 0 ? filteredTasks.map(task => (
          <TaskCard
            key={task._id}
            task={task}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteTask}
            canDelete={isOwner || task.createdBy?._id === user?._id}
          />
        )) : (
          <div className="col-span-3 card p-12 text-center">
            <p className="text-slate-500">No tasks {filter !== 'all' ? `with status "${STATUS_LABELS[filter]}"` : 'yet'}</p>
            <button onClick={() => setShowTaskModal(true)} style={{ ...btnPrimary, marginTop: 16 }}>Create Task</button>
          </div>
        )}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowTaskModal(false)}
        >
          <div className="card p-6 w-full max-w-lg fade-in max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-6">New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="label">Task title *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Design homepage mockup"
                  value={taskForm.title}
                  onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  className="input resize-none"
                  rows={3}
                  value={taskForm.description}
                  onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Priority</label>
                  <select className="input" value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="label">Status</label>
                  <select className="input" value={taskForm.status} onChange={e => setTaskForm({ ...taskForm, status: e.target.value })}>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Assign to</label>
                <select className="input" value={taskForm.assignedTo} onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })}>
                  <option value="">Unassigned</option>
                  {project.members?.map(m => (
                    <option key={m.user?._id} value={m.user?._id}>{m.user?.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Due date</label>
                <input
                  type="date"
                  className="input"
                  value={taskForm.dueDate}
                  onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowTaskModal(false)} style={{ ...btnSecondary, flex: 1 }}>Cancel</button>
                <button type="submit" style={{ ...btnPrimary, flex: 1, opacity: creating ? 0.7 : 1 }} disabled={creating}>
                  {creating ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowMemberModal(false)}
        >
          <div className="card p-6 w-full max-w-md fade-in" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-6">Add Team Member</h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="label">Member email *</label>
                <input
                  type="email"
                  className="input"
                  placeholder="colleague@example.com"
                  value={memberEmail}
                  onChange={e => setMemberEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">Role</label>
                <select className="input" value={memberRole} onChange={e => setMemberRole(e.target.value)}>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowMemberModal(false)} style={{ ...btnSecondary, flex: 1 }}>Cancel</button>
                <button type="submit" style={{ ...btnPrimary, flex: 1 }}>Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;