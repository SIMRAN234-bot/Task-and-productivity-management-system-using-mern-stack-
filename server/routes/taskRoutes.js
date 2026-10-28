const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');
const { validateTaskInput } = require('../validators/taskValidator');
const { protect } = require('../middleware/authMiddleware');

// All task routes require authentication
router.use(protect);

/**
 * @route   GET /api/tasks/stats
 * @desc    Aggregate task statistics for current user
 * @access  Private
 * Note: Must be defined before `/:id` route to prevent matching collision
 */
router.get('/stats', getTaskStats);

/**
 * @route   GET /api/tasks
 * @desc    Get user's tasks with search, filtering, sorting, pagination
 * @access  Private
 *
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router
  .route('/')
  .get(getTasks)
  .post(validateTaskInput, createTask);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get single task details
 * @access  Private
 *
 * @route   PUT /api/tasks/:id
 * @desc    Update task details
 * @access  Private
 *
 * @route   DELETE /api/tasks/:id
 * @desc    Delete task
 * @access  Private
 */
router
  .route('/:id')
  .get(getTaskById)
  .put(validateTaskInput, updateTask)
  .delete(deleteTask);

module.exports = router;
