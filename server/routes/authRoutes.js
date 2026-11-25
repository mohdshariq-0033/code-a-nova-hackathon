const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'code_a_nova_secret_key';

async function sendBrevoEmail({ to, subject, htmlContent }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL || process.env.EMAIL_USER;

  if (!apiKey || !senderEmail) {
    throw new Error('Missing BREVO_API_KEY or SENDER_EMAIL in environment variables.');
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: 'Code-a-Nova',
        email: senderEmail,
      },
      to: [{ email: to }],
      subject,
      htmlContent,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Brevo API failed with status ${response.status}`);
  }

  return data;
}

// 1. Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long and contain at least 1 capital letter and 1 special character.',
      });
    }

    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 15 * 60 * 1000; // 15 minutes valid

    const hashedPassword = await bcrypt.hash(password, 10);

    if (user) {
      user.fullName = fullName;
      user.password = hashedPassword;
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    } else {
      user = new User({
        fullName,
        email,
        password: hashedPassword,
        otp,
        otpExpires,
        isVerified: false,
      });
      await user.save();
    }

    await sendBrevoEmail({
      to: email,
      subject: 'Code-A-Nova Email Verification OTP',
      htmlContent: `<h3>Hello ${fullName},</h3><p>Your OTP for email verification is: <b>${otp}</b>. Valid for 15 minutes.</p>`,
    });

    res.status(200).json({ message: 'OTP sent to your email. Please verify to complete signup.' });
  } catch (err) {
    console.error('Signup OTP error:', err);
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

// 2. Verify OTP Route (For Signup)
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified.' });
    }

    if (!user.otp || user.otp.toString() !== otp.toString() || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Email verified successfully!',
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

// 3. Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password.' });

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first using OTP.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password.' });

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

// 4. Step 1: Send Forgot Password OTP
router.post('/forgot-password-otp', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email not found in our records.' });
    }

    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOtp = resetOtp;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes valid
    await user.save();

    await sendBrevoEmail({
      to: email,
      subject: 'Password Reset Verification OTP - Code-A-Nova',
      htmlContent: `<h3>Password Reset Request</h3><p>Your OTP to verify and reset password is: <b>${resetOtp}</b>. Valid for 15 minutes.</p>`,
    });

    res.status(200).json({ message: 'OTP sent to your email. Please verify to proceed.' });
  } catch (err) {
    console.error('Forgot password OTP error:', err);
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

// 5. Step 2: Verify Forgot Password OTP
router.post('/verify-forgot-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.resetPasswordOtp || user.resetPasswordOtp.toString() !== otp.toString() || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    res.status(200).json({ message: 'OTP verified successfully! Now you can change your password.' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

// 6. Step 3: Final Reset Password Route
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'New Password and Confirm Password do not match.' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long and contain at least 1 capital letter and 1 special character.',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.resetPasswordOtp || user.resetPasswordOtp.toString() !== otp.toString() || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: 'Session expired or Invalid OTP. Please try again.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully! Please login.' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

module.exports = router;