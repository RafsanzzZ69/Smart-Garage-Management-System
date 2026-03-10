const Expense = require('../models/Expense');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Service = require('../models/Service');
const Inventory = require('../models/Inventory');

exports.getFinancials = async () => {
  const totalIncome = await Payment.aggregate([{ $match: { status: 'Completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
  const totalExpenses = await Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
  const salaries = await User.aggregate([{ $match: { role: 'Mechanic' } }, { $group: { _id: null, total: { $sum: '$salary' } } }]);
  const partsCost = await Service.aggregate([
    { $unwind: '$partsUsed' },
    { $lookup: { from: 'inventories', localField: 'partsUsed', foreignField: '_id', as: 'part' } },
    { $unwind: '$part' },
    { $group: { _id: null, total: { $sum: '$part.purchasePrice' } } }
  ]);
  const profit = (totalIncome[0]?.total || 0) - (totalExpenses[0]?.total || 0) - (salaries[0]?.total || 0) - (partsCost[0]?.total || 0);
  return { totalIncome: totalIncome[0]?.total || 0, totalExpenses: totalExpenses[0]?.total || 0, profit };
};