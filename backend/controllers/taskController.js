// const Task = require('../models/Task');
// const Project = require('../models/Project');

// // @desc    Create task
// // @route   POST /api/tasks
// const createTask = async (req, res) => {
//   try {
//     const { title, description, project, assignedTo, status, priority, dueDate, tags } = req.body;

//     const proj = await Project.findById(project);
//     if (!proj) return res.status(404).json({ success: false, message: 'Project not found' });

//     const isMember = proj.owner.toString() === req.user._id.toString() ||
//       proj.members.some(m => m.user.toString() === req.user._id.toString());
//     if (!isMember) return res.status(403).json({ success: false, message: 'Not a project member' });

//     const task = await Task.create({
//       title, description, project, assignedTo, status, priority, dueDate, tags,
//       createdBy: req.user._id
//     });

//     await task.populate([
//       { path: 'assignedTo', select: 'name email' },
//       { path: 'createdBy', select: 'name email' },
//       { path: 'project', select: 'name' }
//     ]);

//     res.status(201).json({ success: true, task });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // @desc    Get tasks for a project
// // @route   GET /api/tasks/project/:projectId
// const getProjectTasks = async (req, res) => {
//   try {
//     const { status, priority, assignedTo } = req.query;
//     const filter = { project: req.params.projectId };
//     if (status) filter.status = status;
//     if (priority) filter.priority = priority;
//     if (assignedTo) filter.assignedTo = assignedTo;

//     const tasks = await Task.find(filter)
//       .populate('assignedTo', 'name email')
//       .populate('createdBy', 'name email')
//       .sort('-createdAt');

//     res.json({ success: true, count: tasks.length, tasks });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // @desc    Get all tasks for current user (dashboard)
// // @route   GET /api/tasks/my
// const getMyTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find({ assignedTo: req.user._id })
//       .populate('project', 'name color')
//       .populate('createdBy', 'name')
//       .sort('-createdAt');

//     const now = new Date();
//     const overdue = tasks.filter(t => t.dueDate && t.status !== 'done' && new Date(t.dueDate) < now);
//     const todo = tasks.filter(t => t.status === 'todo');
//     const inProgress = tasks.filter(t => t.status === 'in-progress');
//     const done = tasks.filter(t => t.status === 'done');

//     res.json({ success: true, tasks, stats: { total: tasks.length, overdue: overdue.length, todo: todo.length, inProgress: inProgress.length, done: done.length } });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // @desc    Get single task
// // @route   GET /api/tasks/:id
// const getTask = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id)
//       .populate('assignedTo', 'name email')
//       .populate('createdBy', 'name email')
//       .populate('project', 'name color');

//     if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
//     res.json({ success: true, task });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // @desc    Update task
// // @route   PUT /api/tasks/:id
// const updateTask = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

//     const project = await Project.findById(task.project);
//     const isMember = project.owner.toString() === req.user._id.toString() ||
//       project.members.some(m => m.user.toString() === req.user._id.toString());
//     if (!isMember) return res.status(403).json({ success: false, message: 'Not authorized' });

//     const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
//       .populate('assignedTo', 'name email')
//       .populate('createdBy', 'name email')
//       .populate('project', 'name color');

//     res.json({ success: true, task: updated });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // @desc    Delete task
// // @route   DELETE /api/tasks/:id
// const deleteTask = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

//     const project = await Project.findById(task.project);
//     const isOwnerOrCreator = project.owner.toString() === req.user._id.toString() ||
//       task.createdBy.toString() === req.user._id.toString();
//     if (!isOwnerOrCreator) return res.status(403).json({ success: false, message: 'Not authorized to delete' });

//     await task.deleteOne();
//     res.json({ success: true, message: 'Task deleted' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // @desc    Get dashboard stats
// // @route   GET /api/tasks/dashboard
// const getDashboardStats = async (req, res) => {
//   try {
//     const Project = require('../models/Project');
//     const projects = await Project.find({
//       $or: [{ owner: req.user._id }, { 'members.user': req.user._id }]
//     });
//     const projectIds = projects.map(p => p._id);

//     const allTasks = await Task.find({ project: { $in: projectIds } })
//       .populate('project', 'name color')
//       .populate('assignedTo', 'name');

//     const now = new Date();
//     const stats = {
//       totalProjects: projects.length,
//       totalTasks: allTasks.length,
//       todo: allTasks.filter(t => t.status === 'todo').length,
//       inProgress: allTasks.filter(t => t.status === 'in-progress').length,
//       done: allTasks.filter(t => t.status === 'done').length,
//       overdue: allTasks.filter(t => t.dueDate && t.status !== 'done' && new Date(t.dueDate) < now).length,
//       recentTasks: allTasks.slice(0, 5),
//       projects
//     };

//     res.json({ success: true, stats });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = { createTask, getProjectTasks, getMyTasks, getTask, updateTask, deleteTask, getDashboardStats };

const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Create task
// @route   POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, status, priority, dueDate, tags } = req.body;

    const proj = await Project.findById(project);
    if (!proj) return res.status(404).json({ success: false, message: 'Project not found' });

    const isMember = proj.owner.toString() === req.user._id.toString() ||
      proj.members.some(m => m.user.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ success: false, message: 'Not a project member' });

    const task = await Task.create({
      title, description, project, assignedTo, status, priority, dueDate, tags,
      createdBy: req.user._id
    });

    await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'createdBy', select: 'name email' },
      { path: 'project', select: 'name' }
    ]);

    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get tasks for a project
// @route   GET /api/tasks/project/:projectId
const getProjectTasks = async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.query;
    const filter = { project: req.params.projectId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all tasks for current user
// @route   GET /api/tasks/my
const getMyTasks = async (req, res) => {
  try {
    // Include tasks assigned to user OR created by user
    const tasks = await Task.find({
      $or: [
        { assignedTo: req.user._id },
        { createdBy: req.user._id }
      ]
    })
      .populate('project', 'name color')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .sort('-createdAt');

    const now = new Date();

    // Deduplicate in case a task was both created by and assigned to same user
    const seen = new Set();
    const unique = tasks.filter(t => {
      if (seen.has(t._id.toString())) return false;
      seen.add(t._id.toString());
      return true;
    });

    const overdue = unique.filter(t => t.dueDate && t.status !== 'done' && new Date(t.dueDate) < now);
    const todo = unique.filter(t => t.status === 'todo');
    const inProgress = unique.filter(t => t.status === 'in-progress');
    const done = unique.filter(t => t.status === 'done');

    // Add isOverdue flag to each task
    const tasksWithOverdue = unique.map(t => ({
      ...t.toObject(),
      isOverdue: !!(t.dueDate && t.status !== 'done' && new Date(t.dueDate) < now)
    }));

    res.json({
      success: true,
      tasks: tasksWithOverdue,
      stats: {
        total: unique.length,
        overdue: overdue.length,
        todo: todo.length,
        inProgress: inProgress.length,
        done: done.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name color');

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const project = await Project.findById(task.project);
    const isMember = project.owner.toString() === req.user._id.toString() ||
      project.members.some(m => m.user.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ success: false, message: 'Not authorized' });

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name color');

    res.json({ success: true, task: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const project = await Project.findById(task.project);
    const isOwnerOrCreator = project.owner.toString() === req.user._id.toString() ||
      task.createdBy.toString() === req.user._id.toString();
    if (!isOwnerOrCreator) return res.status(403).json({ success: false, message: 'Not authorized to delete' });

    await task.deleteOne();
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/tasks/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const Project = require('../models/Project');
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { 'members.user': req.user._id }]
    });
    const projectIds = projects.map(p => p._id);

    const allTasks = await Task.find({ project: { $in: projectIds } })
      .populate('project', 'name color')
      .populate('assignedTo', 'name');

    const now = new Date();
    const stats = {
      totalProjects: projects.length,
      totalTasks: allTasks.length,
      todo: allTasks.filter(t => t.status === 'todo').length,
      inProgress: allTasks.filter(t => t.status === 'in-progress').length,
      done: allTasks.filter(t => t.status === 'done').length,
      overdue: allTasks.filter(t => t.dueDate && t.status !== 'done' && new Date(t.dueDate) < now).length,
      recentTasks: allTasks.slice(0, 5),
      projects
    };

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createTask, getProjectTasks, getMyTasks, getTask, updateTask, deleteTask, getDashboardStats };