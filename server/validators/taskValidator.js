/**
 * Validation helper functions for task requests
 */

const validateTaskInput = (req, res, next) => {
  const { title, status, priority, dueDate } = req.body;
  const errors = [];

  // Title is required on creation; if provided on update, it must not be blank
  if (req.method === 'POST') {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Task title is required');
    }
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Task title cannot be empty');
    } else if (title.trim().length > 120) {
      errors.push('Task title cannot exceed 120 characters');
    }
  }

  const validStatuses = ['pending', 'in-progress', 'completed'];
  if (status !== undefined && !validStatuses.includes(status)) {
    errors.push(`Invalid status '${status}'. Must be one of: ${validStatuses.join(', ')}`);
  }

  const validPriorities = ['low', 'medium', 'high'];
  if (priority !== undefined && !validPriorities.includes(priority)) {
    errors.push(`Invalid priority '${priority}'. Must be one of: ${validPriorities.join(', ')}`);
  }

  if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      errors.push('Invalid due date format. Please provide a valid ISO date');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors,
    });
  }

  next();
};

module.exports = {
  validateTaskInput,
};
