import Budget from '../models/Budget.js';
import { parseMonth } from '../utils/month.js';
import { buildBudgetSummary, getMonthSpending } from '../utils/budgetSummary.js';

export const getBudget = async (req, res) => {
  const month = parseMonth(req.params.month);

  const [budget, spending] = await Promise.all([
    Budget.findOne({ user: req.user._id, month }),
    getMonthSpending(req.user._id, month),
  ]);

  res.json({ budget: buildBudgetSummary(month, budget?.amount, spending.total) });
};

export const setBudget = async (req, res) => {
  const month = parseMonth(req.params.month);

  const budget = await Budget.findOneAndUpdate(
    { user: req.user._id, month },
    { amount: req.body.amount },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  const spending = await getMonthSpending(req.user._id, month);
  res.json({ budget: buildBudgetSummary(month, budget.amount, spending.total) });
};
