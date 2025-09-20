const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const bcrypt = require('bcrypt');
const router = express.Router();

// Login route with extensive debugging
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    
    console.log('=== LOGIN ATTEMPT DEBUG ===');
    console.log('Raw email:', JSON.stringify(email));
    console.log('Raw password length:', password?.length);
    console.log('Password provided:', !!password);

    // Validate required fields
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Normalize inputs
    email = email.toLowerCase().trim();
    password = password.trim();
    
    console.log('Normalized email:', JSON.stringify(email));
    console.log('Normalized password length:', password.length);

    // Find user in database with extensive logging
    console.log('🔍 Searching for user in database...');
    const user = await User.findOne({ email });
    
    console.log('Database query result:', {
      found: !!user,
      userId: user?._id?.toString(),
      email: user?.email,
      isAdmin: user?.isAdmin,
      hasPassword: !!user?.password,
      passwordHashLength: user?.password?.length,
      passwordHashPrefix: user?.password?.substring(0, 10) + '...'
    });

    if (!user) {
      console.log('❌ User not found in database');
      
      // Check admin env credentials
      const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
      const adminPassword = process.env.ADMIN_PASSWORD;
      
      console.log('Checking admin env credentials:', {
        adminEmail,
        adminPasswordExists: !!adminPassword,
        emailMatch: email === adminEmail,
        passwordMatch: password === adminPassword
      });

      if (email === adminEmail && password === adminPassword && adminPassword) {
        console.log('✅ Admin env credentials match - creating admin user');
        
        try {
          const adminUser = new User({ 
            name: 'Admin', 
            email: adminEmail, 
            password: adminPassword,
            isAdmin: true 
          });
          
          const savedAdmin = await adminUser.save();
          console.log('✅ Admin user created:', savedAdmin._id);

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
          console.error('❌ Admin creation error:', adminError);
          
          if (adminError.code === 11000) {
            console.log('Admin already exists, finding existing admin...');
            const existingAdmin = await User.findOne({ email: adminEmail });
            if (existingAdmin) {
              console.log('Found existing admin, verifying password...');
              
              // Try direct comparison first (for env password)
              if (password === adminPassword) {
                console.log('✅ Direct admin password match');
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
              
              // Try bcrypt comparison
              const isPasswordValid = await bcrypt.compare(password, existingAdmin.password);
              console.log('Bcrypt admin password check:', isPasswordValid);
              
              if (isPasswordValid) {
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
            }
          }
          
          return res.status(500).json({ message: 'Error processing admin login' });
        }
      }

      console.log('❌ No user found and not admin credentials');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // User found - verify password
    console.log('✅ User found in database, verifying password...');
    
    try {
      // Method 1: Try bcrypt.compare directly
      console.log('🔐 Attempting bcrypt.compare...');
      const directBcryptResult = await bcrypt.compare(password, user.password);
      console.log('Direct bcrypt.compare result:', directBcryptResult);

      // Method 2: Try user model's comparePassword method
      console.log('🔐 Attempting user.comparePassword...');
      const modelMethodResult = await user.comparePassword(password);
      console.log('Model comparePassword result:', modelMethodResult);

      // Method 3: Debug the hash
      console.log('🔍 Password hash analysis:', {
        hashLength: user.password.length,
        hashPrefix: user.password.substring(0, 7),
        isBcryptHash: user.password.startsWith('$2b$') || user.password.startsWith('$2a$'),
        saltRounds: user.password.split('$')[2]
      });

      // Method 4: Try creating a test hash
      console.log('🧪 Creating test hash with same password...');
      const testHash = await bcrypt.hash(password, 10);
      const testCompare = await bcrypt.compare(password, testHash);
      console.log('Test hash comparison:', {
        testHashPrefix: testHash.substring(0, 10) + '...',
        testCompareResult: testCompare
      });

      if (directBcryptResult || modelMethodResult) {
        console.log('✅ Password verification successful!');
        
        // Generate JWT token
        const token = jwt.sign(
          { userId: user._id }, 
          process.env.JWT_SECRET, 
          { expiresIn: '7d' }
        );
        
        console.log('✅ Login successful for user:', {
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
        console.log('❌ Password verification failed');
        console.log('Expected password hash:', user.password);
        console.log('Provided password length:', password.length);
        
        return res.status(400).json({ message: 'Invalid email or password' });
      }
    } catch (passwordError) {
      console.error('❌ Password verification error:', passwordError);
      return res.status(500).json({ message: 'Error verifying password' });
    }
    
  } catch (error) {
    console.error('❌ Login route error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Register route (keep your existing one, but ensure bcrypt consistency)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('=== REGISTRATION ATTEMPT ===');
    console.log('Name:', name);
    console.log('Email:', email?.toLowerCase());
    console.log('Password length:', password?.length);

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      console.log('❌ User already exists:', normalizedEmail);
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Determine if this user should be admin
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const isAdmin = normalizedEmail === adminEmail;

    console.log('Admin check:', { normalizedEmail, adminEmail, isAdmin });

    // Create user - let the model's pre-save hook handle password hashing
    console.log('🔐 Creating user with password hashing...');
    const user = new User({ 
      name: name.trim(), 
      email: normalizedEmail, 
      password: password, // Model will hash this
      isAdmin 
    });
    
    const savedUser = await user.save();
    
    console.log('✅ User created successfully:', { 
      id: savedUser._id, 
      email: normalizedEmail, 
      isAdmin: savedUser.isAdmin,
      passwordHashPrefix: savedUser.password.substring(0, 10) + '...'
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
    console.error('❌ Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Test password route for debugging
router.post('/test-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('=== PASSWORD TEST ===');
    console.log('User found:', user.email);
    console.log('Stored hash:', user.password);
    console.log('Password to test:', password);
    
    // Test direct bcrypt
    const directResult = await bcrypt.compare(password, user.password);
    console.log('Direct bcrypt result:', directResult);
    
    // Test model method
    const modelResult = await user.comparePassword(password);
    console.log('Model method result:', modelResult);
    
    // Create new hash with same password
    const newHash = await bcrypt.hash(password, 10);
    const newHashTest = await bcrypt.compare(password, newHash);
    console.log('New hash test:', newHashTest);
    console.log('New hash:', newHash);
    
    res.json({
      directBcryptResult: directResult,
      modelMethodResult: modelResult,
      newHashTest: newHashTest,
      storedHash: user.password,
      newHash: newHash
    });
    
  } catch (error) {
    console.error('Password test error:', error);
    res.status(500).json({ message: 'Error testing password' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

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