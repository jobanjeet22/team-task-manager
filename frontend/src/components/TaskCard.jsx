import { formatDate, priorityColor, isOverdue } from '../utils/helpers';
import { getInitials } from '../utils/helpers';

const priorityStyle = (p) => ({
  fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 20,
  background: p === 'high' ? '#fff0f0' : p === 'medium' ? '#fff8ec' : '#ecfdf5',
  color: p === 'high' ? '#ef4444' : p === 'medium' ? '#f59e0b' : '#10b981',
});

const TaskCard = ({ task, onStatusChange, onDelete, canDelete }) => {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div style={{
      background: '#fff',
      border: '1.5px solid var(--border)',
      borderRadius: 14,
      padding: '16px',
      transition: 'border-color 0.15s, transform 0.15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a9fd4'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Title + Priority */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-1)', lineHeight: 1.4, flex: 1 }}>
          {task.title}
        </h4>
        <span style={priorityStyle(task.priority)}>{task.priority}</span>
      </div>

      {/* Description */}
      {task.description && (
        <p style={{
          fontSize: 12, color: 'var(--txt-3)', marginBottom: 12,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {task.description}
        </p>
      )}

      {/* Status + Project */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <select
          value={task.status}
          onChange={e => onStatusChange && onStatusChange(task._id, e.target.value)}
          style={{
            fontSize: 12, background: '#f0f4ff',
            border: '1.5px solid var(--border)', borderRadius: 8,
            padding: '4px 8px', color: 'var(--txt-2)',
            cursor: 'pointer', outline: 'none', fontFamily: 'inherit',
          }}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        {task.project?.name && (
          <span style={{
            fontSize: 11, background: '#EBF3FE',
            color: '#1a9fd4', padding: '3px 8px',
            borderRadius: 8, fontWeight: 500,
          }}>
            {task.project.name}
          </span>
        )}
      </div>

      {/* Footer: Assigned + Due + Delete */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {task.assignedTo ? (
            <>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: '#EBF3FE', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700, color: '#1a9fd4',
              }}>
                {getInitials(task.assignedTo.name)}
              </div>
              <span style={{ fontSize: 11, color: 'var(--txt-3)' }}>{task.assignedTo.name}</span>
            </>
          ) : (
            <span style={{ fontSize: 11, color: 'var(--txt-4)' }}>Unassigned</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {task.dueDate && (
            <span style={{ fontSize: 11, color: overdue ? '#ef4444' : 'var(--txt-4)', fontWeight: overdue ? 600 : 400 }}>
              {overdue ? '⚠ ' : ''}{formatDate(task.dueDate)}
            </span>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete && onDelete(task._id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--txt-4)', fontSize: 14, padding: '0 2px',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-4)'}
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;