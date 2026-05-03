const Project = require('../models/Project');

// Check if user is admin of a specific project
const isProjectAdmin = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId || req.body.project);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const isOwner = project.owner.toString() === req.user._id.toString();
    const memberEntry = project.members.find(m => m.user.toString() === req.user._id.toString());
    const isAdmin = memberEntry && memberEntry.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Access denied: Admins only' });
    }

    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check if user is a member of the project
const isProjectMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId || req.body.project);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const isOwner = project.owner.toString() === req.user._id.toString();
    const isMember = project.members.some(m => m.user.toString() === req.user._id.toString());

    if (!isOwner && !isMember) {
      return res.status(403).json({ success: false, message: 'Access denied: Not a project member' });
    }

    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Global admin check
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied: Admins only' });
  }
  next();
};

module.exports = { isProjectAdmin, isProjectMember, isAdmin };
