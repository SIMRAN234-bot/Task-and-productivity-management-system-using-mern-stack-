const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  kind: { type: String, enum: ['upcoming', 'overdue'], required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });
notificationSchema.index({ user: 1, task: 1, kind: 1 }, { unique: true });
module.exports = mongoose.model('Notification', notificationSchema);
