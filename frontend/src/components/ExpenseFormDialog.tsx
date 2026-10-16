import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { getErrorMessage } from '../api/client';
import { createExpense, updateExpense } from '../api/expenses';
import { PAYMENT_METHOD_OPTIONS } from '../constants';
import { useCategories } from '../hooks/useCategories';
import type { Expense, ExpenseInput, PaymentMethod } from '../types';
import { todayInputDate, toInputDate } from '../utils/format';

interface ExpenseFormDialogProps {
  // null means we are creating a new expense
  expense: Expense | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

interface FormValues {
  title: string;
  amount: string;
  category: string;
  date: string;
  paymentMethod: PaymentMethod | '';
  notes: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const validate = (values: FormValues): FormErrors => {
  const errors: FormErrors = {};

  if (!values.title.trim()) errors.title = 'Title is required';
  else if (values.title.trim().length > 100) errors.title = 'Title must be 100 characters or fewer';

  const amount = Number(values.amount);
  if (values.amount === '' || !Number.isFinite(amount) || amount <= 0) {
    errors.amount = 'Enter an amount greater than 0';
  }

  if (!values.category) errors.category = 'Choose a category';
  if (!values.date) errors.date = 'Choose a date';
  if (!values.paymentMethod) errors.paymentMethod = 'Choose a payment method';
  if (values.notes.length > 500) errors.notes = 'Notes must be 500 characters or fewer';

  return errors;
};

export default function ExpenseFormDialog({ expense, onClose, onSaved }: ExpenseFormDialogProps) {
  const isEdit = expense !== null;
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

  const [values, setValues] = useState<FormValues>({
    title: expense?.title ?? '',
    amount: expense ? String(expense.amount) : '',
    category: expense?.category._id ?? '',
    date: expense ? toInputDate(expense.date) : todayInputDate(),
    paymentMethod: expense?.paymentMethod ?? '',
    notes: expense?.notes ?? '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const setField = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setServerError(null);

    const found = validate(values);
    setErrors(found);
    const { paymentMethod } = values;
    if (Object.keys(found).length > 0 || !paymentMethod) return;

    const input: ExpenseInput = {
      title: values.title.trim(),
      amount: Number(values.amount),
      category: values.category,
      date: values.date,
      paymentMethod,
      notes: values.notes.trim(),
    };

    setSubmitting(true);
    try {
      if (expense) {
        await updateExpense(expense._id, input);
        onSaved('Expense updated');
      } else {
        await createExpense(input);
        onSaved('Expense added');
      }
    } catch (err) {
      setServerError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onClose={submitting ? undefined : onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle>{isEdit ? 'Edit expense' : 'Add expense'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {serverError && <Alert severity="error">{serverError}</Alert>}
            {categoriesError && <Alert severity="error">{categoriesError}</Alert>}

            <TextField
              label="Title"
              value={values.title}
              onChange={(e) => setField('title', e.target.value)}
              error={Boolean(errors.title)}
              helperText={errors.title}
              fullWidth
              autoFocus
            />

            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
              <TextField
                label="Amount (RWF)"
                type="number"
                value={values.amount}
                onChange={(e) => setField('amount', e.target.value)}
                error={Boolean(errors.amount)}
                helperText={errors.amount}
                slotProps={{ htmlInput: { min: 0, step: 'any' } }}
              />
              <TextField
                label="Date"
                type="date"
                value={values.date}
                onChange={(e) => setField('date', e.target.value)}
                error={Boolean(errors.date)}
                helperText={errors.date}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                select
                label="Category"
                // Wait for the options to load so the saved category can be selected
                value={categoriesLoading ? '' : values.category}
                onChange={(e) => setField('category', e.target.value)}
                error={Boolean(errors.category)}
                helperText={errors.category}
                disabled={categoriesLoading}
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Payment method"
                value={values.paymentMethod}
                onChange={(e) => setField('paymentMethod', e.target.value as PaymentMethod)}
                error={Boolean(errors.paymentMethod)}
                helperText={errors.paymentMethod}
              >
                {PAYMENT_METHOD_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <TextField
              label="Notes (optional)"
              value={values.notes}
              onChange={(e) => setField('notes', e.target.value)}
              error={Boolean(errors.notes)}
              helperText={errors.notes ?? `${values.notes.length}/500`}
              multiline
              minRows={2}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? <CircularProgress size={22} color="inherit" /> : isEdit ? 'Save changes' : 'Add expense'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
