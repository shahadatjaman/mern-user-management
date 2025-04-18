const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  action: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Activity', activitySchema);
