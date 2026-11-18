const express = require('express');
const router = express.Router();
const { registerHackathon, getMyEntry, deleteEntry } = require('../controllers/hackathonController');
const protect = require('../middleware/authMiddleware'); // Agar middleware me module.exports = protect; hai

router.post('/register', protect, registerHackathon);
router.get('/my-registration', protect, getMyEntry);
router.delete('/delete-my-registration', protect, deleteEntry);

module.exports = router;