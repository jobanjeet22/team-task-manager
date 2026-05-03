import { format, isAfter, parseISO } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '—';
  try { return format(parseISO(date), 'MMM dd, yyyy'); }
  catch { return '—'; }
};

export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'done') return false;
  return isAfter(new Date(), parseISO(dueDate));
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const statusLabel = (status) => {
  const map = { 'todo': 'To Do', 'in-progress': 'In Progress', 'done': 'Done' };
  return map[status] || status;
};

export const priorityColor = (priority) => {
  const map = { high: 'badge-high', medium: 'badge-medium', low: 'badge-low' };
  return map[priority] || 'badge-medium';
};

export const statusClass = (status) => {
  const map = { todo: 'badge-todo', 'in-progress': 'badge-in-progress', done: 'badge-done' };
  return map[status] || 'badge-todo';
};
