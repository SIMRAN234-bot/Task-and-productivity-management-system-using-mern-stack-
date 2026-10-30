const Task = require('../models/Task');
const Notification = require('../models/Notification');

exports.getNotifications = async (req, res, next) => {
  try {
    const now = new Date(); const horizon = new Date(now); horizon.setDate(horizon.getDate() + 7);
    const dueTasks = await Task.find({ user: req.user._id, status: { $ne: 'completed' }, dueDate: { $ne: null, $lte: horizon } }).select('_id dueDate');
    for (const task of dueTasks) {
      await Notification.updateOne({ user: req.user._id, task: task._id, kind: task.dueDate < now ? 'overdue' : 'upcoming' }, { $setOnInsert: { user: req.user._id, task: task._id, kind: task.dueDate < now ? 'overdue' : 'upcoming' } }, { upsert: true });
    }
    const notifications = await Notification.find({ user: req.user._id }).sort({ read: 1, createdAt: -1 }).limit(30).populate('task', 'title dueDate status priority');
    res.json({ success: true, notifications, unreadCount: notifications.filter((item) => !item.read).length });
  } catch (error) { next(error); }
};

exports.markRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { read: true }, { new: true });
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, notification });
  } catch (error) { next(error); }
};
