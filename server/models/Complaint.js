const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'Submitted' },
  history: [
    {
      date: { type: Date, default: Date.now },
      status: String,
      details: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
