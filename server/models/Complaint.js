const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  address: String,
  category: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'Submitted' },
  history: [
    {
      date: { type: Date, default: Date.now },
      status: String,
      details: String,
    },
  ],
  dateSubmitted: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', complaintSchema);