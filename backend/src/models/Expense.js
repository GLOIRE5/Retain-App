import mongoose from 'mongoose';

export const PAYMENT_METHODS = ['cash', 'card', 'mobile_money', 'bank_transfer'];

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title is too long'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: { values: PAYMENT_METHODS, message: 'Invalid payment method' },
      required: [true, 'Payment method is required'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes are too long'],
      default: '',
    },
  },
  { timestamps: true }
);

expenseSchema.index({ user: 1, date: -1 });

export default mongoose.model('Expense', expenseSchema);
