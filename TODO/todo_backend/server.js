const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://todo-app-jet-two-66.vercel.app'
  ],
  credentials: true
}));
app.options('*', cors());

app.use(express.json());

const connectDB = require('./connectDB');
connectDB();

app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

app.listen(5000, () => console.log('Server listening on port: 5000'));
