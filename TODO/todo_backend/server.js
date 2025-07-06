const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const app = express();
app.use(cors({ origin: ['http://localhost:3000','https://todo-gl6pfnsoq-imrans-projects-25659def.vercel.app/login'] }));
app.use(express.json());
// console.log(process.env.MONGODB_URI);
// mongoose.connect('mongodb+srv://imrannabi2005:Imran@kce786@cluster0.s2pq9rc.mongodb.net/todo-app?retryWrites=true&w=majority')
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('MongoDB connection error:', err));
const connectDB = require('./connectDB');
connectDB();
  
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

app.listen(5000, () => console.log('Server listening on port: 5000'));

module.exports = app;