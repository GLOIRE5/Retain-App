import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { PAYMENT_METHOD_LABELS } from '../constants';
import type { Expense } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

interface ExpenseTableProps {
  expenses: Expense[];
  onView: (expense: Expense) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export default function ExpenseTable({ expenses, onView, onEdit, onDelete }: ExpenseTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Payment</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense._id} hover onClick={() => onView(expense)} sx={{ cursor: 'pointer' }}>
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
              <TableCell>{PAYMENT_METHOD_LABELS[expense.paymentMethod]}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                {formatCurrency(expense.amount)}
              </TableCell>
              <TableCell align="right" sx={{ whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                <Tooltip title="Edit">
                  <IconButton aria-label={`Edit ${expense.title}`} onClick={() => onEdit(expense)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton aria-label={`Delete ${expense.title}`} color="error" onClick={() => onDelete(expense)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
