const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  parts: [{ part: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }, quantity: Number, cost: Number }],
  totalCost: { type: Number, required: true },
  pdfUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);