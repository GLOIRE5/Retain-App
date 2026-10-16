import Category from '../models/Category.js';

export const listCategories = async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({ categories });
};
