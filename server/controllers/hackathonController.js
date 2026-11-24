const Registration = require('../models/Registration');
const { sendConfirmationEmail } = require('../config/mailer');

// 1. Register Hackathon (Safely check and handle old registrations)
const registerHackathon = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const existing = await Registration.findOne({ userId });
    if (existing) {
      return res.status(400).json({
        message: 'You have already registered for this hackathon. If you wish to submit a new entry, please delete your previous registration first.'
      });
    }

    const safeTeamMembers = Array.isArray(req.body.teamMembers) ? req.body.teamMembers : [];
    const recipientEmail = req.body.email || req.user?.email;

    const regData = {
      ...req.body,
      email: recipientEmail,
      teamMembers: safeTeamMembers,
      userId
    };

    const registration = await Registration.create(regData);

    // Send response immediately; dispatch confirmation email in background
    res.status(201).json({
      message: 'Hackathon Registration Successful!',
      registration
    });

    const targetMail = recipientEmail || registration.email;
    if (targetMail) {
      sendConfirmationEmail(targetMail, {
        ...req.body,
        email: targetMail,
        fullName: req.body.fullName || req.user?.fullName || 'Participant',
        teamMembers: safeTeamMembers
      }).catch((err) => {
        console.error('Confirmation email error:', err.message);
      });
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
  }
};

// 2. Get current user's registration entry
const getMyEntry = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const registration = await Registration.findOne({ userId });

    if (!registration) {
      return res.status(404).json({ message: 'No registration found' });
    }

    res.status(200).json({ registration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Delete current user's registration entry permanently
const deleteEntry = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const result = await Registration.deleteMany({ userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No registration found to delete' });
    }

    res.status(200).json({ message: 'Registration deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerHackathon, getMyEntry, deleteEntry };