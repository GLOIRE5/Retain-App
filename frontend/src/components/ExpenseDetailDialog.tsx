import type { ReactNode } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from '@mui/material';
import { PAYMENT_METHOD_LABELS } from '../constants';
import type { Expense } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

interface ExpenseDetailDialogProps {
  expense: Expense;
  onClose: () => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography component="div">{children}</Typography>
    </Box>
  );
}

export default function ExpenseDetailDialog({ expense, onClose, onEdit, onDelete }: ExpenseDetailDialogProps) {
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{expense.title}</DialogTitle>
      <DialogContent>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
          {formatCurrency(expense.amount)}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <Field label="Category">{expense.category.name}</Field>
          <Field label="Date">{formatDate(expense.date)}</Field>
          <Field label="Payment method">{PAYMENT_METHOD_LABELS[expense.paymentMethod]}</Field>
          <Field label="Recorded on">{new Date(expense.createdAt).toLocaleString('en-GB')}</Field>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Field label="Notes">{expense.notes || 'No notes'}</Field>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button color="error" onClick={() => onDelete(expense)}>
          Delete
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={() => onEdit(expense)}>
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
