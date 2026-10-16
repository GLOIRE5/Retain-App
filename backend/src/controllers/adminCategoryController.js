import Category from '../models/Category.js';
import Expense from '../models/Expense.js';
import { ApiError } from '../utils/ApiError.js';

export const listAdminCategories = async (req, res) => {
  const [categories, usage] = await Promise.all([
    Category.find().sort({ name: 1 }).lean(),
    Expense.aggregate([
      { $group: { _id: '$category', expenseCount: { $sum: 1 }, totalSpent: { $sum: '$amount' } } },
    ]),
  ]);

  const usageById = new Map(usage.map((u) => [String(u._id), u]));

  res.json({
    categories: categories.map((c) => ({
      ...c,
      expenseCount: usageById.get(String(c._id))?.expenseCount ?? 0,
      totalSpent: usageById.get(String(c._id))?.totalSpent ?? 0,
    })),
  });
};

export const createAdminCategory = async (req, res) => {
  const category = await Category.create({ name: req.body.name });
  res.status(201).json({ category });
};

export const updateAdminCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true, runValidators: true }
  );
  if (!category) throw new ApiError(404, 'Category not found');

  res.json({ category });
};

export const deleteAdminCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');

  if (category.isDefault) {
    throw new ApiError(400, 'The default category cannot be deleted');
  }

  const fallback = await Category.findOne({ isDefault: true });
  if (!fallback) {
    throw new ApiError(409, 'Default category is missing. Run npm run seed first');
  }

  // Move the affected expenses first, so nothing is ever left pointing at a deleted category
  const result = await Expense.updateMany({ category: category._id }, { category: fallback._id });
  await category.deleteOne();

  res.json({
    message: 'Category deleted',
    reassignedExpenses: result.modifiedCount,
    reassignedTo: fallback.name,
  });
};
