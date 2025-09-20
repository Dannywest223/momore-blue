const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Make sure this is 'bcrypt' not 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      default: 1
    }
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {
  timestamps: true
});

// Pre-save hook to hash passwords
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    console.log('Password not modified, skipping hash');
    return next();
  }
  
  try {
    console.log('=== HASHING PASSWORD ===');
    console.log('Original password length:', this.password.length);
    console.log('User email:', this.email);
    
    // Check if password is already hashed
    const isAlreadyHashed = this.password.startsWith('$2b$') || this.password.startsWith('$2a$');
    if (isAlreadyHashed) {
      console.log('Password already hashed, skipping');
      return next();
    }
    
    // Generate salt and hash password
    const saltRounds = 10;
    console.log('Generating salt with rounds:', saltRounds);
    
    const salt = await bcrypt.genSalt(saltRounds);
    console.log('Salt generated:', salt);
    
    const hashedPassword = await bcrypt.hash(this.password, salt);
    console.log('Password hashed successfully');
    console.log('Hash prefix:', hashedPassword.substring(0, 10) + '...');
    console.log('Hash length:', hashedPassword.length);
    
    this.password = hashedPassword;
    console.log('=== HASHING COMPLETE ===');
    next();
  } catch (error) {
    console.error('❌ Password hashing error:', error);
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('=== COMPARING PASSWORD ===');
    console.log('Candidate password length:', candidatePassword?.length);
    console.log('Stored hash prefix:', this.password.substring(0, 10) + '...');
    console.log('Stored hash length:', this.password.length);
    console.log('Hash format check:', {
      startsWith2b: this.password.startsWith('$2b$'),
      startsWith2a: this.password.startsWith('$2a$'),
      isValidFormat: /^\$2[ab]\$\d{2}\$/.test(this.password)
    });
    
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password comparison result:', result);
    console.log('=== COMPARISON COMPLETE ===');
    
    return result;
  } catch (error) {
    console.error('❌ Password comparison error:', error);
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);