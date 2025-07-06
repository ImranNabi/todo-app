const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'X7k9P2vQ8mL5jR3wY6zA1xC4bN0eT8hU';
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '792939813993-sqkfg66c57aidn506fof74gshuad3ldp.apps.googleusercontent.com'; // Replace with your actual client ID
const client = new OAuth2Client(CLIENT_ID);

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ email, password: hashedPassword });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email 
      } 
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Failed to signup' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = await UserModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email 
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Failed to login' });
  }
});

router.post('/google-login', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Google ID token is required' });
    }

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, sub: googleId, name } = payload;

    if (!email) {
      return res.status(400).json({ error: 'Email not provided by Google' });
    }

    // Check if user exists with Google ID
    let user = await UserModel.findOne({ googleId });
    
    if (!user) {
      // Check if user exists with email
      user = await UserModel.findOne({ email });
      
      if (user) {
        // Link Google account to existing user
        user.googleId = googleId;
        await user.save();
      } else {
        // Create new user with Google account
        user = await UserModel.create({ 
          email, 
          googleId, 
          name: name || email.split('@')[0],
          password: 'google-auth-' + Math.random().toString(36).substring(7) // Random password for Google users
        });
      }
    }

    const jwtToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ 
      token: jwtToken, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name || email.split('@')[0] 
      } 
    });
    
  } catch (err) {
    console.error('Google Login Error:', err);
    res.status(500).json({ error: 'Failed to login with Google' });
  }
});

module.exports = router;