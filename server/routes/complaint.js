const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// --- API Endpoint to Create a Complaint ---
router.post('/file', async (req, res) => {
  try {
    const { fullName, mobile, address, category, description } = req.body;
    const randomTicketId = `C-${Math.floor(10000 + Math.random() * 90000)}`;

    const newComplaint = new Complaint({
      complaintId: randomTicketId,
      fullName,
      mobile,
      address,
      category,
      description,
      history: [{ status: 'Complaint Submitted', details: 'Initial complaint filed by the citizen.' }]
    });

    await newComplaint.save();

    res.status(201).json({
      message: `Success! Your complaint has been filed. Your tracking ID is ${randomTicketId}`,
      complaintId: randomTicketId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting complaint.' });
  }
});

// --- API Endpoint to Track a Complaint ---
router.get('/track/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ complaintId: req.params.id });
    if (complaint) {
      res.status(200).json(complaint);
    } else {
      res.status(404).json({ message: 'Complaint not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;