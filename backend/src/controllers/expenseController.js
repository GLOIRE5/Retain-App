import Expense from '../models/Expense.js';
import Category from '../models/Category.js';
import { ApiError } from '../utils/ApiError.js';
import { escapeRegex } from '../utils/escapeRegex.js';

const SORT_OPTIONS = {
  date: { date: 1, _id: 1 },
  '-date': { date: -1, _id: -1 },
  amount: { amount: 1, _id: 1 },
  '-amount': { amount: -1, _id: -1 },
};

const ensureCategoryExists = async (categoryId) => {
  const exists = await Category.exists({ _id: categoryId });
  if (!exists) {
    throw new ApiError(400, 'Category does not exist');
  }
};

export const listExpenses = async (req, res) => {
  const { page, limit, search, category, paymentMethod, from, to, minAmount, maxAmount, sort } =
    req.validatedQuery;

  // Always scoped to the logged-in user
  const filter = { user: req.user._id };

  if (category) filter.category = category;
  if (paymentMethod) filter.paymentMethod = paymentMethod;

  if (search) {
    const regex = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ title: regex }, { notes: regex }];
  }

  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = from;
    if (to) {
      const endOfDay = new Date(to);
      endOfDay.setUTCHours(23, 59, 59, 999);
      filter.date.$lte = endOfDay;
    }
  }

  if (minAmount !== undefined || maxAmount !== undefined) {
    filter.amount = {};
    if (minAmount !== undefined) filter.amount.$gte = minAmount;
    if (maxAmount !== undefined) filter.amount.$lte = maxAmount;
  }

  const [expenses, total] = await Promise.all([
    Expense.find(filter)
      .populate('category', 'name')
      .sort(SORT_OPTIONS[sort])
      .skip((page - 1) * limit)
      .limit(limit),
    Expense.countDocuments(filter),
  ]);

  res.json({
    expenses,
    pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  });
};

export const getExpense = async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id }).populate(
    'category',
    'name'
  );
  if (!expense) throw new ApiError(404, 'Expense not found');

  res.json({ expense });
};

export const createExpense = async (req, res) => {
  await ensureCategoryExists(req.body.category);

  const expense = await Expense.create({ ...req.body, user: req.user._id });
  await expense.populate('category', 'name');

  res.status(201).json({ expense });
};

export const updateExpense = async (req, res) => {
  await ensureCategoryExists(req.body.category);

  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  ).populate('category', 'name');
  if (!expense) throw new ApiError(404, 'Expense not found');

  res.json({ expense });
};

export const deleteExpense = async (req, res) => {
  const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!expense) throw new ApiError(404, 'Expense not found');

  res.json({ message: 'Expense deleted' });
};
