import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { PAYMENT_METHOD_OPTIONS } from '../constants';
import type { Expense } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

const PAYMENT_LABELS: Record<string, string> = Object.fromEntries(
  PAYMENT_METHOD_OPTIONS.map((option) => [option.value, option.label])
);

export default function ExpenseTable({ expenses }: { expenses: Expense[] }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 640 }}>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Payment</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense._id} hover>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(expense.date)}</TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 500 }}>{expense.title}</Typography>
                {expense.notes && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {expense.notes}
                  </Typography>
                )}
              </TableCell>
              <TableCell>{expense.category.name}</TableCell>
              <TableCell>{PAYMENT_LABELS[expense.paymentMethod] ?? expense.paymentMethod}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                {formatCurrency(expense.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
