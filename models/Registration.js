const mongoose = require('mongoose');

const hackathonRegistrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  collegeName: { type: String, default: 'Hi-Tech Institute of Technology' },
  course: { type: String, default: 'BCA' },
  branch: { type: String, default: 'CSE' },
  yearOfStudy: { type: String, default: '2nd' },
  domainTrack: { type: String, required: true },
  projectName: { type: String, required: true },
  pptLink: { type: String },
  prototypeLink: { type: String },
  teamSize: { type: Number, default: 1 },
  teamMembers: [
    {
      memberName: String,
      memberEmail: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('HackathonRegistration', hackathonRegistrationSchema);