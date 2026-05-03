// // import { useEffect, useState } from 'react';
// // import { Link } from 'react-router-dom';
// // import api from '../api/axios';
// // import { useAuth } from '../context/AuthContext';
// // import { formatDate, statusClass, priorityColor, isOverdue } from '../utils/helpers';
// // import toast from 'react-hot-toast';

// // const StatCard = ({ label, value, color, icon }) => (
// //   <div className="card p-5 flex items-center gap-4">
// //     <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
// //     <div>
// //       <p className="text-3xl font-bold">{value}</p>
// //       <p className="text-sm text-slate-400">{label}</p>
// //     </div>
// //   </div>
// // );

// // const Dashboard = () => {
// //   const { user } = useAuth();
// //   const [stats, setStats] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchStats = async () => {
// //       try {
// //         const { data } = await api.get('/tasks/dashboard');
// //         setStats(data.stats);
// //       } catch (err) {
// //         toast.error('Failed to load dashboard');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchStats();
// //   }, []);

// //   if (loading) return (
// //     <div className="flex items-center justify-center h-64">
// //       <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
// //     </div>
// //   );

// //   return (
// //     <div className="fade-in">
// //       <div className="mb-8">
// //         <h1 className="text-3xl font-bold">Good morning, {user?.name?.split(' ')[0]} 👋</h1>
// //         <p className="text-slate-400 mt-1">Here's what's happening with your projects today.</p>
// //       </div>

// //       {/* Stats Grid */}
// //       <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
// //         <StatCard label="Projects" value={stats?.totalProjects || 0} icon="📁" color="bg-brand-500/10" />
// //         <StatCard label="Total Tasks" value={stats?.totalTasks || 0} icon="📋" color="bg-slate-700" />
// //         <StatCard label="To Do" value={stats?.todo || 0} icon="⬜" color="bg-slate-700" />
// //         <StatCard label="In Progress" value={stats?.inProgress || 0} icon="🔄" color="bg-amber-500/10" />
// //         <StatCard label="Done" value={stats?.done || 0} icon="✅" color="bg-emerald-500/10" />
// //       </div>

// //       {/* Overdue Alert */}
// //       {stats?.overdue > 0 && (
// //         <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 flex items-center gap-3">
// //           <span className="text-2xl">⚠️</span>
// //           <div>
// //             <p className="font-semibold text-red-400">{stats.overdue} overdue task{stats.overdue > 1 ? 's' : ''}</p>
// //             <p className="text-sm text-red-400/70">Some tasks are past their due date and need attention.</p>
// //           </div>
// //         </div>
// //       )}

// //       <div className="grid lg:grid-cols-2 gap-6">
// //         {/* Recent Tasks */}
// //         <div className="card p-6">
// //           <h2 className="font-bold text-lg mb-4">Recent Tasks</h2>
// //           {stats?.recentTasks?.length > 0 ? (
// //             <div className="space-y-3">
// //               {stats.recentTasks.map(task => {
// //                 const overdue = isOverdue(task.dueDate, task.status);
// //                 return (
// //                   <div key={task._id} className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl">
// //                     <div className="flex-1 min-w-0">
// //                       <p className="text-sm font-medium truncate">{task.title}</p>
// //                       <p className="text-xs text-slate-500">{task.project?.name}</p>
// //                     </div>
// //                     <div className="flex items-center gap-2 shrink-0">
// //                       <span className={statusClass(task.status)}>{task.status}</span>
// //                       {overdue && <span className="text-red-400 text-xs">Overdue</span>}
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           ) : (
// //             <p className="text-slate-500 text-sm text-center py-8">No tasks yet. Create a project to get started!</p>
// //           )}
// //         </div>

// //         {/* Projects */}
// //         <div className="card p-6">
// //           <div className="flex items-center justify-between mb-4">
// //             <h2 className="font-bold text-lg">Your Projects</h2>
// //             <Link to="/projects" className="text-sm text-brand-400 hover:text-brand-300">View all →</Link>
// //           </div>
// //           {stats?.projects?.length > 0 ? (
// //             <div className="space-y-3">
// //               {stats.projects.slice(0, 5).map(project => (
// //                 <Link to={`/projects/${project._id}`} key={project._id}
// //                   className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors">
// //                   <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
// //                     style={{ backgroundColor: project.color || '#4f6ef7' }}>
// //                     {project.name[0].toUpperCase()}
// //                   </div>
// //                   <div className="flex-1 min-w-0">
// //                     <p className="text-sm font-medium truncate">{project.name}</p>
// //                     <p className="text-xs text-slate-500 capitalize">{project.status}</p>
// //                   </div>
// //                 </Link>
// //               ))}
// //             </div>
// //           ) : (
// //             <div className="text-center py-8">
// //               <p className="text-slate-500 text-sm mb-3">No projects yet</p>
// //               <Link to="/projects" className="btn-primary text-sm">Create Project</Link>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;


// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../api/axios';
// import { useAuth } from '../context/AuthContext';
// import { statusClass, isOverdue } from '../utils/helpers';
// import toast from 'react-hot-toast';

// const StatCard = ({ label, value, color, icon }) => (
//   <div className="card p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform">
//     <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${color}`}>{icon}</div>
//     <div>
//       <p className="text-3xl font-bold">{value}</p>
//       <p className="text-sm text-slate-400">{label}</p>
//     </div>
//   </div>
// );

// const getGreeting = () => {
//   const h = new Date().getHours();
//   if (h < 12) return 'Good morning';
//   if (h < 17) return 'Good afternoon';
//   return 'Good evening';
// };

// const Dashboard = () => {
//   const { user } = useAuth();
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const { data } = await api.get('/tasks/dashboard');
//         setStats(data.stats);
//       } catch {
//         toast.error('Failed to load dashboard');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStats();
//   }, []);

//   if (loading) return (
//     <div className="flex items-center justify-center h-64">
//       <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
//     </div>
//   );

//   return (
//     <div className="fade-in">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">{getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
//         <p className="text-slate-400 mt-1">Here's your task overview for today.</p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
//         <StatCard label="Projects" value={stats?.totalProjects ?? 0} icon="📁" color="bg-brand-500/10" />
//         <StatCard label="Total Tasks" value={stats?.totalTasks ?? 0} icon="📋" color="bg-slate-700" />
//         <StatCard label="To Do" value={stats?.todo ?? 0} icon="⬜" color="bg-slate-700" />
//         <StatCard label="In Progress" value={stats?.inProgress ?? 0} icon="🔄" color="bg-amber-500/10" />
//         <StatCard label="Done" value={stats?.done ?? 0} icon="✅" color="bg-emerald-500/10" />
//       </div>

//       {/* Overdue Alert */}
//       {stats?.overdue > 0 && (
//         <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 flex items-center gap-3">
//           <span className="text-2xl">⚠️</span>
//           <div>
//             <p className="font-semibold text-red-400">
//               {stats.overdue} overdue task{stats.overdue > 1 ? 's' : ''}
//             </p>
//             <p className="text-sm text-red-400/70">Some tasks are past their due date.</p>
//           </div>
//           <Link to="/tasks" className="ml-auto text-sm text-red-400 hover:text-red-300 underline shrink-0">
//             View →
//           </Link>
//         </div>
//       )}

//       <div className="grid lg:grid-cols-2 gap-6">
//         {/* Recent Tasks — display only, no click navigation */}
//         <div className="card p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="font-bold text-lg">Recent Tasks</h2>
//             <Link to="/tasks" className="text-sm text-brand-400 hover:text-brand-300">View all →</Link>
//           </div>

//           {stats?.recentTasks?.length > 0 ? (
//             <div className="space-y-3">
//               {stats.recentTasks.map(task => {
//                 const overdue = isOverdue(task.dueDate, task.status);
//                 return (
//                   <div
//                     key={task._id}
//                     className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl"
//                   >
//                     {/* Status dot */}
//                     <div className={`w-2 h-2 rounded-full shrink-0 ${
//                       task.status === 'done' ? 'bg-emerald-500'
//                       : task.status === 'in-progress' ? 'bg-amber-400'
//                       : 'bg-slate-500'
//                     }`} />

//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium truncate">{task.title}</p>
//                       <p className="text-xs text-slate-500 truncate">{task.project?.name || 'No project'}</p>
//                     </div>

//                     <div className="flex items-center gap-2 shrink-0">
//                       <span className={statusClass(task.status)}>{task.status}</span>
//                       {overdue && (
//                         <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
//                           Overdue
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="text-center py-10">
//               <p className="text-4xl mb-3">📭</p>
//               <p className="text-slate-500 text-sm">No tasks yet.</p>
//               <p className="text-slate-600 text-xs mt-1">Create a project and add tasks to get started.</p>
//             </div>
//           )}
//         </div>

//         {/* Your Projects */}
//         <div className="card p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="font-bold text-lg">Your Projects</h2>
//             <Link to="/projects" className="text-sm text-brand-400 hover:text-brand-300">View all →</Link>
//           </div>

//           {stats?.projects?.length > 0 ? (
//             <div className="space-y-3">
//               {stats.projects.slice(0, 5).map(project => (
//                 <Link
//                   to={`/projects/${project._id}`}
//                   key={project._id}
//                   className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors group"
//                 >
//                   <div
//                     className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
//                     style={{ backgroundColor: project.color || '#4f6ef7' }}
//                   >
//                     {project.name[0].toUpperCase()}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium truncate group-hover:text-brand-300 transition-colors">
//                       {project.name}
//                     </p>
//                     <p className="text-xs text-slate-500 capitalize">{project.status}</p>
//                   </div>
//                   <svg className="w-4 h-4 text-slate-600 group-hover:text-brand-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
//                   </svg>
//                 </Link>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-10">
//               <p className="text-4xl mb-3">📁</p>
//               <p className="text-slate-500 text-sm mb-3">No projects yet</p>
//               <Link to="/projects" className="btn-primary text-sm">Create your first project</Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { statusClass, isOverdue } from '../utils/helpers';
import toast from 'react-hot-toast';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const STAT_CARDS = [
  { key: 'totalProjects', label: 'Projects',    color: 'stat-blue',   icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="round"/></svg> },
  { key: 'totalTasks',    label: 'Total Tasks', color: 'stat-indigo', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" strokeLinecap="round"/></svg> },
  { key: 'todo',          label: 'To Do',       color: 'stat-violet', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><rect x="5" y="5" width="14" height="14" rx="2"/></svg> },
  { key: 'inProgress',    label: 'In Progress', color: 'stat-amber',  icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { key: 'done',          label: 'Done',        color: 'stat-emerald',icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

const PROJECT_COLORS = ['#1a9fd4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444'];

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/tasks/dashboard');
        setStats(data.stats);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="dash-loading">
      <div className="dash-spinner" />
    </div>
  );

  return (
    <div className="dash fade-in">
      {/* Greeting */}
      <div className="dash-greeting">
        <h1>{getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
        <p>Here's your task overview for today.</p>
      </div>

      {/* Stat Cards */}
      <div className="dash-stats">
        {STAT_CARDS.map(card => (
          <div key={card.key} className={`dash-stat ${card.color}`}>
            <div className="dash-stat-icon">{card.icon}</div>
            <div className="dash-stat-val">{stats?.[card.key] ?? 0}</div>
            <div className="dash-stat-lbl">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Overdue Alert */}
      {stats?.overdue > 0 && (
        <div className="dash-alert">
          <span>⚠️</span>
          <p className="dash-alert-txt">
            {stats.overdue} overdue task{stats.overdue > 1 ? 's' : ''} need your attention.
          </p>
          <Link to="/tasks" className="dash-alert-lnk">View tasks →</Link>
        </div>
      )}

      {/* Cards Row */}
      <div className="dash-row">
        {/* Recent Tasks */}
        <div className="dash-card">
          <div className="dash-card-hd">
            <h2 className="dash-card-title">Recent Tasks</h2>
            <Link to="/tasks" className="dash-card-lnk">View all →</Link>
          </div>

          {stats?.recentTasks?.length > 0 ? (
            <div className="dash-task-list">
              {stats.recentTasks.map(task => {
                const overdue = isOverdue(task.dueDate, task.status);
                const dotColor =
                  task.status === 'done' ? '#10b981'
                  : task.status === 'in-progress' ? '#f59e0b'
                  : overdue ? '#ef4444'
                  : '#a0b0c8';
                return (
                  <div key={task._id} className="dash-task-row">
                    <div className="dash-task-dot" style={{ background: dotColor }} />
                    <div className="dash-task-info">
                      <p className="dash-task-title">{task.title}</p>
                      <p className="dash-task-sub">{task.project?.name || 'No project'}</p>
                    </div>
                    <div className="dash-task-badges">
                      <span className={`dash-badge dash-badge-${task.status === 'in-progress' ? 'prog' : task.status === 'done' ? 'done' : 'todo'}`}>
                        {task.status === 'in-progress' ? 'In Progress' : task.status === 'done' ? 'Done' : 'To Do'}
                      </span>
                      {overdue && <span className="dash-badge dash-badge-over">Overdue</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="dash-empty">
              <p className="dash-empty-icon">📭</p>
              <p className="dash-empty-txt">No tasks yet.</p>
              <p className="dash-empty-sub">Create a project and add tasks to get started.</p>
            </div>
          )}
        </div>

        {/* Your Projects */}
        <div className="dash-card">
          <div className="dash-card-hd">
            <h2 className="dash-card-title">Your Projects</h2>
            <Link to="/projects" className="dash-card-lnk">View all →</Link>
          </div>

          {stats?.projects?.length > 0 ? (
            <div className="dash-proj-list">
              {stats.projects.slice(0, 5).map((project, i) => {
                const color = project.color || PROJECT_COLORS[i % PROJECT_COLORS.length];
                const total = project.taskCount || 0;
                const done = project.doneCount || 0;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <Link to={`/projects/${project._id}`} key={project._id} className="dash-proj-row">
                    <div className="dash-proj-avatar" style={{ background: color }}>
                      {project.name[0].toUpperCase()}
                    </div>
                    <div className="dash-proj-info">
                      <p className="dash-proj-name">{project.name}</p>
                      <p className="dash-proj-status">{project.status}</p>
                    </div>
                    <div className="dash-proj-progress">
                      <div className="dash-proj-bar-bg">
                        <div className="dash-proj-bar-fill" style={{ width: `${pct}%`, background: color }} />
                      </div>
                      <p className="dash-proj-pct">{pct}%</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="dash-empty">
              <p className="dash-empty-icon">📁</p>
              <p className="dash-empty-txt">No projects yet.</p>
              <Link to="/projects" className="dash-create-btn">Create your first project</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;