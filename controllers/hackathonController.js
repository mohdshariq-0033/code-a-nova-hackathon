const Registration = require('../models/Registration');
const { sendConfirmationEmail } = require('../config/mailer');

// 1. Register Hackathon (Safely check and handle old registrations)
const registerHackathon = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    
    // Check if an entry already exists for this user
    const existing = await Registration.findOne({ userId });
    if (existing) {
      return res.status(400).json({ 
        message: 'You have already registered for this hackathon. If you wish to submit a new entry, please delete your previous registration first.' 
      });
    }

    const regData = { ...req.body, userId };
    const registration = await Registration.create(regData);

    // Send confirmation mail async
    try {
      await sendConfirmationEmail(req.body.email, req.body);
    } catch (e) {
      console.error("Nodemailer error:", e.message);
    }

    res.status(201).json({ message: 'Hackathon Registration Successful!', registration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

// 2. Delete Entry (Fix: Delete using userId so it removes it 100% permanently)
const deleteEntry = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    
    // Delete all registrations matching this user to prevent ghost records
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