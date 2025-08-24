// Get all complaints (for admin/testing)
router.get('/all', async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('user', 'username email');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});
const express = require('express');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

const router = express.Router();

// Middleware to check if user is logged in (expects userId in req.body or req.headers)
function requireLogin(req, res, next) {
  const userId = req.body.userId || req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ message: 'Login required.' });
  req.userId = userId;
  next();
}

// File a new complaint
router.post('/file', requireLogin, async (req, res) => {
  try {
    const { category, address, description } = req.body;
    if (!category || !address || !description) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    const complaint = new Complaint({
      user: user._id,
      category,
      address,
      description,
      history: [{ status: 'Submitted', details: 'Complaint submitted by user.' }]
    });
    await complaint.save();
    res.status(201).json({
      message: 'Complaint filed successfully.',
      complaintId: complaint._id,
      complaint
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
