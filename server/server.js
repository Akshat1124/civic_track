require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Backend is running');
});


// Auth routes
app.use('/api/auth', require('./routes/auth'));
// Complaint routes
app.use('/api/complaint', require('./routes/complaint'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
