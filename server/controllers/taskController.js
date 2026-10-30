const mongoose = require('mongoose');
const Task = require('../models/Task');

/**
 * @desc    Get all tasks for authenticated user with search, filter, sort, pagination
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, dueFrom, dueTo, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;

    // Strict user scoping: user can only query their own tasks
    const query = { user: req.user._id };

    // Search filter across title, description, and tags
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
      ];
    }

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Priority filter
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    if (dueFrom || dueTo) {
      query.dueDate = {};
      if (dueFrom) query.dueDate.$gte = new Date(dueFrom);
      if (dueTo) { const end = new Date(dueTo); end.setHours(23,59,59,999); query.dueDate.$lte = end; }
    }

    // Pagination calculations
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sortField = ['createdAt', 'dueDate', 'priority', 'title'].includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortField]: sortOrder };

    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single task by ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied',
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, tags, subtasks } = req.body;

    // Process tags into an array
    let processedTags = [];
    if (Array.isArray(tags)) {
      processedTags = tags.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof tags === 'string' && tags.trim()) {
      processedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      tags: processedTags,
      subtasks: Array.isArray(subtasks) ? subtasks : [],
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied',
      });
    }

    const { title, description, status, priority, dueDate, tags, subtasks } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (subtasks !== undefined) task.subtasks = subtasks;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        task.tags = tags.map((t) => String(t).trim()).filter(Boolean);
      } else if (typeof tags === 'string') {
        task.tags = tags.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied',
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard statistics for authenticated user using MongoDB aggregation
 * @route   GET /api/tasks/stats
 * @access  Private
 */
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // Aggregation pipeline to calculate counts grouped by status and priority
    const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 6); weekStart.setHours(0,0,0,0);
    const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0);
    const [statusStats, priorityStats, overdueCount, totalCount, recentTasks, weekDone, monthDone, upcomingTasks] = await Promise.all([
      // Group by status
      Task.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      // Group by priority
      Task.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
      // Overdue tasks count (dueDate in the past and status is not completed)
      Task.countDocuments({
        user: userId,
        status: { $ne: 'completed' },
        dueDate: { $ne: null, $lt: now },
      }),
      // Total count
      Task.countDocuments({ user: userId }),
      // Last 5 recently updated tasks
      Task.find({ user: userId })
        .sort({ updatedAt: -1 })
        .limit(5)
        .select('title status priority dueDate updatedAt'),
      Task.aggregate([{ $match: { user: userId, status: 'completed', updatedAt: { $gte: weekStart } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } }, count: { $sum: 1 } } }]),
      Task.aggregate([{ $match: { user: userId, status: 'completed', updatedAt: { $gte: monthStart } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
      Task.find({ user: userId, status: { $ne: 'completed' }, dueDate: { $gte: now } }).sort({ dueDate: 1 }).limit(8).select('title status priority dueDate'),
    ]);

    // Map aggregated results into clear dictionary
    const statusMap = { pending: 0, 'in-progress': 0, completed: 0 };
    statusStats.forEach((item) => {
      if (item._id && statusMap.hasOwnProperty(item._id)) {
        statusMap[item._id] = item.count;
      }
    });

    const priorityMap = { low: 0, medium: 0, high: 0 };
    priorityStats.forEach((item) => {
      if (item._id && priorityMap.hasOwnProperty(item._id)) {
        priorityMap[item._id] = item.count;
      }
    });

    const completionRate = totalCount > 0
      ? Math.round((statusMap.completed / totalCount) * 100)
      : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalTasks: totalCount,
        completedTasks: statusMap.completed,
        pendingTasks: statusMap.pending,
        inProgressTasks: statusMap['in-progress'],
        overdueTasks: overdueCount,
        completionRate,
        priorityBreakdown: priorityMap,
        recentActivity: recentTasks,
        weeklyCompletion: weekDone,
        monthlyProductivity: monthDone,
        upcomingTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};
