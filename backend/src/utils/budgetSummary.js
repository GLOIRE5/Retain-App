import Expense from '../models/Expense.js';
import { monthRange } from './month.js';

export const APPROACHING_THRESHOLD = 0.8;

const round2 = (n) => Math.round(n * 100) / 100;

export const getMonthSpending = async (userId, month) => {
  const { start, end } = monthRange(month);

  const [result] = await Expense.aggregate([
    { $match: { user: userId, date: { $gte: start, $lt: end } } },
    { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
  ]);

  return { total: round2(result?.total ?? 0), count: result?.count ?? 0 };
};

export const buildBudgetSummary = (month, amount, spent) => {
  if (amount === undefined || amount === null) {
    return { month, amount: null, spent, remaining: null, percentUsed: null, status: 'no_budget' };
  }

  const ratio = spent / amount;
  let status = 'within';
  if (spent > amount) status = 'over';
  else if (ratio >= APPROACHING_THRESHOLD) status = 'approaching';

  return {
    month,
    amount,
    spent,
    remaining: round2(amount - spent),
    percentUsed: Math.round(ratio * 1000) / 10,
    status,
  };
};
