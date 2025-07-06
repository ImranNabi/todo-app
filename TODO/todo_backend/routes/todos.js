const express = require('express');
const jwt = require('jsonwebtoken');
const TodoModel = require('../models/Todo');

const router = express.Router();
const JWT_SECRET = 'X7k9P2vQ8mL5jR3wY6zA1xC4bN0eT8hU'; // Replace with environment variable in production

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.post('/add', authenticate, async (req, res) => {
  try {
    const { task } = req.body;
    if (!task || typeof task !== 'string' || task.trim() === '') {
      return res.status(400).json({ error: 'Task is required and must be a non-empty string' });
    }
    const result = await TodoModel.create({ task, userId: req.userId });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.get('/get', authenticate, async (req, res) => {
  try {
    const result = await TodoModel.find({ userId: req.userId });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.put('/edit/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await TodoModel.findOne({ _id: id, userId: req.userId });
    if (!todo) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }
    const result = await TodoModel.findByIdAndUpdate(id, { done: true }, { new: true });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to edit task' });
  }
});

router.put('/update/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { task } = req.body;
    if (!task || typeof task !== 'string' || task.trim() === '') {
      return res.status(400).json({ error: 'Task is required and must be a non-empty string' });
    }
    const todo = await TodoModel.findOne({ _id: id, userId: req.userId });
    if (!todo) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }
    const result = await TodoModel.findByIdAndUpdate(id, { task }, { new: true });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

router.delete('/delete/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await TodoModel.findOne({ _id: id, userId: req.userId });
    if (!todo) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }
    const result = await TodoModel.findByIdAndDelete(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;