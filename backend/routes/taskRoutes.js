const express = require('express');
const router = express.Router();
const { createTask, getProjectTasks, getMyTasks, getTask, updateTask, deleteTask, getDashboardStats } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/my', getMyTasks);
router.route('/').post(createTask);
router.get('/project/:projectId', getProjectTasks);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;
