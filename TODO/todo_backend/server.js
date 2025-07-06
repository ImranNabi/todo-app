const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/list')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

app.listen(5000, () => console.log('Server listening on port: 5000'));

module.exports = app;