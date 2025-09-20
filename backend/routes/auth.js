const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const bcrypt = require('bcrypt');
const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('Registration attempt:', { name, email: email?.toLowerCase() });

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      console.log('User already exists:', normalizedEmail);
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Determine if this user is admin (normalize admin email too)
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const isAdmin = normalizedEmail === adminEmail;

    // Hash password
    const saltRounds = 12; // Increased from 10 for better security
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save user
    const user = new User({ 
      name: name.trim(), 
      email: normalizedEmail, 
      password: hashedPassword, 
      isAdmin 
    });
    
    const savedUser = await user.save();
    console.log('User registered successfully:', { id: savedUser._id, email: normalizedEmail, isAdmin });

    // Generate JWT token
    const token = jwt.sign(
      { userId: savedUser._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { 
        id: savedUser._id, 
        name: savedUser.name, 
        email: savedUser.email, 
        isAdmin: savedUser.isAdmin 
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Normalize email to lowercase and trim
    email = email.toLowerCase().trim();
    password = password.trim();
    
    console.log('Normalized email:', email);
    
    // Try to find user in database first
    const user = await User.findOne({ email });
    console.log('User found in database:', user ? 'Yes' : 'No');
    
    if (user) {
      // User exists in database - verify password
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match result:', isMatch);

      if (!isMatch) {
        console.log('Password incorrect for email:', email);
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Password matches - generate token and login
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      
      console.log('Login successful for user:', { id: user._id, email: user.email, isAdmin: user.isAdmin });

      return res.json({
        token,
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          isAdmin: user.isAdmin 
        }
      });
    }

    // User not in database - check if it's admin trying to login with env credentials
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    console.log('Checking admin credentials:', { 
      emailMatch: email === adminEmail,
      hasAdminPassword: !!adminPassword,
      providedEmail: email,
      adminEmail: adminEmail
    });

    if (email === adminEmail && password === adminPassword && adminPassword) {
      // Admin login with env credentials - create admin user if doesn't exist
      console.log('Admin login with env credentials');
      
      const hashedPassword = await bcrypt.hash(password, 12);
      const adminUser = new User({ 
        name: 'Admin', 
        email: adminEmail, 
        password: hashedPassword, 
        isAdmin: true 
      });
      
      const savedAdmin = await adminUser.save();
      console.log('Admin user created:', savedAdmin._id);

      const token = jwt.sign({ userId: savedAdmin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      
      return res.json({
        token,
        user: { 
          id: savedAdmin._id, 
          name: savedAdmin.name, 
          email: savedAdmin.email, 
          isAdmin: true 
        }
      });
    }

    // Neither regular user nor admin - invalid credentials
    console.log('No user found and not admin credentials for email:', email);
    return res.status(400).json({ message: 'Invalid email or password' });
    
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle duplicate key error (in case admin creation conflicts)
    if (error.code === 11000) {
      console.log('Duplicate key error during admin creation - trying to find existing admin');
      try {
        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL?.toLowerCase().trim() });
        if (existingAdmin) {
          const token = jwt.sign({ userId: existingAdmin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
          return res.json({
            token,
            user: { 
              id: existingAdmin._id, 
              name: existingAdmin.name, 
              email: existingAdmin.email, 
              isAdmin: existingAdmin.isAdmin 
            }
          });
        }
      } catch (findError) {
        console.error('Error finding existing admin:', findError);
      }
    }
    
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    console.log('Getting current user:', { id: req.user._id, email: req.user.email });

    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        isAdmin: req.user.isAdmin
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error getting user info' });
  }
});

module.exports = router;