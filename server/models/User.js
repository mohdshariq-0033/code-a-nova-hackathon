const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  // Signup OTP fields
  otp: { 
    type: String 
  },
  otpExpires: { 
    type: Date 
  },
  // Forgot Password OTP fields (Ye zaroori hain!)
  resetPasswordOtp: { 
    type: String 
  },
  resetPasswordExpires: { 
    type: Date 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);