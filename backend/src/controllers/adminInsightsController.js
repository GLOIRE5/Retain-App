import User from '../models/User.js';
import Expense from '../models/Expense.js';
import Category from '../models/Category.js';
import { currentMonth, monthRange } from '../utils/month.js';

const round2 = (n) => Math.round(n * 100) / 100;

export const getInsights = async (req, res) => {
  const { start, end } = monthRange(currentMonth());

  const [
    totalUsers,
    totals,
    expensesThisMonth,
    categoryStats,
    categories,
    recentExpenses,
    recentUsers,
  ] = await Promise.all([
    User.countDocuments(),
    Expense.aggregate([{ $group: { _id: null, count: { $sum: 1 }, value: { $sum: '$amount' } } }]),
    Expense.countDocuments({ date: { $gte: start, $lt: end } }),
    Expense.aggregate([{ $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
    Category.find().lean(),
    Expense.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('category', 'name'),
    User.find().sort({ createdAt: -1 }).limit(5),
  ]);

  const statsById = new Map(categoryStats.map((s) => [String(s._id), s]));

  // Every category appears, including ones nobody has used yet (count 0)
  const perCategory = categories.map((c) => ({
    categoryId: c._id,
    name: c.name,
    total: round2(statsById.get(String(c._id))?.total ?? 0),
    count: statsById.get(String(c._id))?.count ?? 0,
  }));

  const mostUsedCategories = [...perCategory]
    .sort((a, b) => b.count - a.count || b.total - a.total || a.name.localeCompare(b.name))
    .slice(0, 5);

  const leastUsedCategories = [...perCategory]
    .sort((a, b) => a.count - b.count || a.total - b.total || a.name.localeCompare(b.name))
    .slice(0, 5);

  res.json({
    totalUsers,
    totalExpenses: totals[0]?.count ?? 0,
    totalExpenseValue: round2(totals[0]?.value ?? 0),
    expensesThisMonth,
    spendingPerCategory: [...perCategory].sort((a, b) => b.total - a.total),
    mostUsedCategories,
    leastUsedCategories,
    recentExpenses,
    recentUsers,
  });
};
