const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema({
  name: String,
  color: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Label', labelSchema);
