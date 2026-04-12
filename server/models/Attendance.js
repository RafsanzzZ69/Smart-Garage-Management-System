const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'half-day', 'leave'],
    required: true
  },
  checkIn: {
    type: String 
  },
  checkOut: {
    type: String 
  },
  notes: {
    type: String
  }
}, { timestamps: true });
module.exports = mongoose.model('Attendance', attendanceSchema);