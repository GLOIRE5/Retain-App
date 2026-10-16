import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';
import { currentMonth, monthRange, parseMonth } from '../utils/month.js';
import { buildBudgetSummary, getMonthSpending } from '../utils/budgetSummary.js';

export const getDashboard = async (req, res) => {
  const month = req.query.month ? parseMonth(req.query.month) : currentMonth();
  const { start, end } = monthRange(month);
  const match = { user: req.user._id, date: { $gte: start, $lt: end } };

  const [budget, spending, highestExpense, spendingByCategory, recentExpenses] = await Promise.all([
    Budget.findOne({ user: req.user._id, month }),
    getMonthSpending(req.user._id, month),
    Expense.findOne(match).sort({ amount: -1 }).populate('category', 'name'),
    Expense.aggregate([
      { $match: match },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $project: { _id: 0, categoryId: '$_id', name: '$category.name', total: 1, count: 1 } },
      { $sort: { total: -1 } },
    ]),
    Expense.find(match).sort({ date: -1, _id: -1 }).limit(5).populate('category', 'name'),
  ]);

  res.json({
    month,
    budget: buildBudgetSummary(month, budget?.amount, spending.total),
    expenseCount: spending.count,
    highestExpense,
    spendingByCategory,
    recentExpenses,
  });
};
