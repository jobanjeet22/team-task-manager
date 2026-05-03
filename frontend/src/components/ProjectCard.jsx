// import { Link } from 'react-router-dom';
// import { formatDate } from '../utils/helpers';
// import { getInitials } from '../utils/helpers';

// const statusBadge = {
//   active: 'bg-emerald-500/15 text-emerald-400',
//   completed: 'bg-brand-500/15 text-brand-400',
//   archived: 'bg-slate-700 text-slate-400'
// };

// const ProjectCard = ({ project }) => {
//   return (
//     <Link to={`/projects/${project._id}`} className="card p-5 hover:border-slate-700 transition-all duration-200 hover:-translate-y-0.5 block fade-in group">
//       <div className="flex items-start justify-between mb-3">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: project.color || '#4f6ef7' }}>
//             {project.name[0].toUpperCase()}
//           </div>
//           <div>
//             <h3 className="font-semibold text-slate-100 group-hover:text-white transition-colors">{project.name}</h3>
//             <p className="text-xs text-slate-500">by {project.owner?.name}</p>
//           </div>
//         </div>
//         <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusBadge[project.status]}`}>
//           {project.status}
//         </span>
//       </div>

//       {project.description && (
//         <p className="text-sm text-slate-400 mb-4 line-clamp-2">{project.description}</p>
//       )}

//       <div className="flex items-center justify-between text-xs text-slate-500">
//         <div className="flex -space-x-2">
//           {project.members?.slice(0, 4).map((m, i) => (
//             <div key={i} className="w-6 h-6 rounded-full bg-slate-700 border border-slate-900 flex items-center justify-center text-[10px] font-bold">
//               {getInitials(m.user?.name || '?')}
//             </div>
//           ))}
//           {project.members?.length > 4 && (
//             <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-900 flex items-center justify-center text-[10px]">
//               +{project.members.length - 4}
//             </div>
//           )}
//         </div>
//         {project.deadline && (
//           <span>Due {formatDate(project.deadline)}</span>
//         )}
//       </div>
//     </Link>
//   );
// };

// export default ProjectCard;


import { Link } from 'react-router-dom';
import { formatDate, getInitials } from '../utils/helpers';

const ProjectCard = ({ project }) => {
  return (
    <Link
      to={`/projects/${project._id}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: '#fff',
        border: '1.5px solid var(--border)',
        borderRadius: 14,
        padding: '18px 20px',
        cursor: 'pointer',
        transition: 'border-color 0.15s, transform 0.15s',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a9fd4'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: project.color || '#4f6ef7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 15, flexShrink: 0,
            }}>
              {project.name[0].toUpperCase()}
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--txt-1)', marginBottom: 2 }}>
                {project.name}
              </h3>
              <p style={{ fontSize: 11, color: 'var(--txt-4)' }}>by {project.owner?.name}</p>
            </div>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 500,
            padding: '3px 10px', borderRadius: 20,
            background: project.status === 'active' ? '#ecfdf5' : project.status === 'completed' ? '#EBF3FE' : '#f1f5f9',
            color: project.status === 'active' ? '#10b981' : project.status === 'completed' ? '#1a9fd4' : '#94a3b8',
            textTransform: 'capitalize', whiteSpace: 'nowrap',
          }}>
            {project.status}
          </span>
        </div>

        {/* Description */}
        {project.description && (
          <p style={{
            fontSize: 12, color: 'var(--txt-3)', marginBottom: 14,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {project.description}
          </p>
        )}

        {/* Bottom row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Member avatars */}
          <div style={{ display: 'flex' }}>
            {project.members?.slice(0, 4).map((m, i) => (
              <div key={i} style={{
                width: 26, height: 26, borderRadius: '50%',
                background: '#EBF3FE',
                border: '2px solid #fff',
                marginLeft: i === 0 ? 0 : -6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 600, color: '#1a9fd4',
              }}>
                {getInitials(m.user?.name || '?')}
              </div>
            ))}
            {project.members?.length > 4 && (
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: '#f1f5f9', border: '2px solid #fff',
                marginLeft: -6, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 10, color: 'var(--txt-3)',
              }}>
                +{project.members.length - 4}
              </div>
            )}
          </div>

          {project.deadline && (
            <span style={{ fontSize: 11, color: 'var(--txt-4)' }}>
              Due {formatDate(project.deadline)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;