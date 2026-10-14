import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [40, 'Category name is too long'],
    },
    // The fallback category that expenses move to when their category is deleted
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Case-insensitive uniqueness: "Food" and "food" count as the same name
categorySchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

export default mongoose.model('Category', categorySchema);
