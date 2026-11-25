const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function sendOtpEmail({ toEmail, otp }) {
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
      to: [{ email: toEmail }],
      subject: 'Code-a-Nova - Password Reset OTP',
      htmlContent: `<h3>Password Reset Request</h3><p>Your OTP for resetting password is: <b>${otp}</b>. It is valid for 10 minutes.</p>`,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Email API failed with status ${response.status}`);
  }

  return data;
}

/**
 * @desc    Send password reset OTP to user email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address.',
      });
    }

    // Generate a secure 6-digit random OTP
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP and expiration time (10 minutes from now)
    user.resetPasswordOtp = resetOtp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send OTP via Brevo HTTPS API
    await sendOtpEmail({ toEmail: user.email, otp: resetOtp });

    return res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your email.',
    });
  } catch (error) {
    console.error('Forgot password mail error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to send password reset OTP.',
    });
  }
};

/**
 * @desc    Verify OTP and update new password
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP.',
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear reset OTP fields
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully! You can now login.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};