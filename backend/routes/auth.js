const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const bcrypt = require('bcrypt');
const router = express.Router();

// Register route - Works for both normal users and admin
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('Registration attempt:', { name, email: email?.toLowerCase() });

    // Validate required fields
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

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      console.log('User already exists:', normalizedEmail);
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Determine if this user should be admin
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const isAdmin = normalizedEmail === adminEmail;

    console.log('Admin check:', { normalizedEmail, adminEmail, isAdmin });

    // Hash password with consistent salt rounds
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save user
    const user = new User({ 
      name: name.trim(), 
      email: normalizedEmail, 
      password: hashedPassword, 
      isAdmin 
    });
    
    const savedUser = await user.save();
    console.log('User registered successfully:', { 
      id: savedUser._id, 
      email: normalizedEmail, 
      isAdmin: savedUser.isAdmin 
    });

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

// Login route - Handles both normal users and admin
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email provided:', email);
    console.log('Password provided:', !!password);

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Normalize inputs
    email = email.toLowerCase().trim();
    password = password.trim();
    
    console.log('Normalized email:', email);

    // First, always try to find user in database
    const user = await User.findOne({ email });
    console.log('User lookup result:', {
      found: !!user,
      email: user?.email,
      isAdmin: user?.isAdmin,
      userId: user?._id?.toString()
    });

    if (user) {
      console.log('User found in database - verifying password');
      
      try {
        // Compare password with stored hash
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password validation result:', isPasswordValid);

        if (isPasswordValid) {
          console.log('✓ Password valid - generating token for user');
          
          // Generate JWT token
          const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
          );
          
          console.log('✓ Login successful for:', {
            id: user._id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin
          });

          return res.json({
            token,
            user: { 
              id: user._id, 
              name: user.name, 
              email: user.email, 
              isAdmin: user.isAdmin 
            }
          });
        } else {
          console.log('✗ Password invalid for existing user');
          return res.status(400).json({ message: 'Invalid email or password' });
        }
      } catch (bcryptError) {
        console.error('Password comparison error:', bcryptError);
        return res.status(500).json({ message: 'Error verifying password' });
      }
    }

    // If user not found in database, check if it's admin with env credentials
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    console.log('User not in database - checking admin env credentials');
    console.log('Admin email match:', email === adminEmail);
    console.log('Admin password available:', !!adminPassword);

    if (email === adminEmail && password === adminPassword && adminPassword) {
      console.log('Admin env credentials match - creating admin user in database');
      
      try {
        // Hash the admin password and create admin user
        const hashedAdminPassword = await bcrypt.hash(password, 10);
        const adminUser = new User({ 
          name: 'Admin', 
          email: adminEmail, 
          password: hashedAdminPassword, 
          isAdmin: true 
        });
        
        const savedAdmin = await adminUser.save();
        console.log('✓ Admin user created in database:', savedAdmin._id);

        // Generate token for admin
        const token = jwt.sign(
          { userId: savedAdmin._id }, 
          process.env.JWT_SECRET, 
          { expiresIn: '7d' }
        );
        
        return res.json({
          token,
          user: { 
            id: savedAdmin._id, 
            name: savedAdmin.name, 
            email: savedAdmin.email, 
            isAdmin: savedAdmin.isAdmin 
          }
        });
      } catch (adminError) {
        console.error('Error creating admin user:', adminError);
        
        // If admin already exists (duplicate error), find and login
        if (adminError.code === 11000) {
          console.log('Admin already exists, finding existing admin');
          try {
            const existingAdmin = await User.findOne({ email: adminEmail });
            if (existingAdmin) {
              const token = jwt.sign(
                { userId: existingAdmin._id }, 
                process.env.JWT_SECRET, 
                { expiresIn: '7d' }
              );
              
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
        
        return res.status(500).json({ message: 'Error processing admin login' });
      }
    }

    // No user found and not admin credentials
    console.log('✗ Login failed - user not found and not admin credentials');
    console.log('=== LOGIN ATTEMPT END ===');
    return res.status(400).json({ message: 'Invalid email or password' });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    console.log('Getting current user:', { 
      id: req.user._id, 
      email: req.user.email,
      isAdmin: req.user.isAdmin 
    });

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

// TEMPORARY: Password reset route for debugging (remove in production)
router.post('/reset-password-debug', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user password
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    
    console.log('Password reset for user:', user.email);
    
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

module.exports = router;