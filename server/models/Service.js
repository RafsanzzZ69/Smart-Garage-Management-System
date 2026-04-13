const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  type: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['Booked', 'Assigned', 'In Progress', 'Completed', 'Delivered'], default: 'Booked' },
  mechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  partsUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }],
  cost: { type: Number },
  date: { type: Date, required: true },
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);

