import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

const DEFAULT_CATEGORY = 'Uncategorized';

const CATEGORIES = [
  DEFAULT_CATEGORY,
  'Food & Groceries',
  'Transport',
  'Rent & Housing',
  'Utilities',
  'Airtime & Data',
  'Health',
  'Education',
  'Entertainment',
  'Shopping',
];

const seed = async () => {
  await connectDB();

  for (const name of CATEGORIES) {
    await Category.updateOne(
      { name },
      { $setOnInsert: { name, isDefault: name === DEFAULT_CATEGORY } },
      { upsert: true }
    );
  }
  console.log(`Categories ready (${CATEGORIES.length})`);

  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
  }

  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    console.log(`Admin already exists: ${existing.email}`);
  } else {
    const admin = await User.create({
      name: ADMIN_NAME || 'Admin',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
    });
    console.log(`Admin created: ${admin.email}`);
  }

  await mongoose.disconnect();
};

seed().catch(async (err) => {
  console.error('Seed failed:', err.message);
  await mongoose.disconnect();
  process.exit(1);
});
