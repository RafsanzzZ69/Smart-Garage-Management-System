const mongoose = require('mongoose');
const serviceHistorySchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mechanic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  serviceDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  servicesPerformed: [
    {
      type: String // e.g. ["Oil Change", "Brake Pad Replacement"]
    }
  ],
  partsReplaced: [
    {
      partName: String,
      quantity: Number,
      cost: Number
    }
  ],
  mileageAtService: {
    type: Number
  },
  totalCost: {
    type: Number,
    required: true
  },
  mechanicNotes: {
    type: String
  },
  nextServiceDue: {
    type: Date
  },
  nextServiceMileage: {
    type: Number
  }
}, { timestamps: true });
module.exports = mongoose.model('ServiceHistory', serviceHistorySchema);