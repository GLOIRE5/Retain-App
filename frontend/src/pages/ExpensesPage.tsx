import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Paper,
  Snackbar,
  Stack,
  TablePagination,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { deleteExpense } from '../api/expenses';
import { getErrorMessage } from '../api/client';
import ConfirmDialog from '../components/ConfirmDialog';
import ExpenseDetailDialog from '../components/ExpenseDetailDialog';
import ExpenseFilters from '../components/ExpenseFilters';
import ExpenseFormDialog from '../components/ExpenseFormDialog';
import ExpenseTable from '../components/ExpenseTable';
import { PAGE_SIZE_OPTIONS } from '../constants';
import { fetchExpenses, setFilters, setPage } from '../store/expensesSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { Expense } from '../types';

interface FormState {
  open: boolean;
  expense: Expense | null;
}

interface SnackState {
  message: string;
  severity: 'success' | 'error';
}

export default function ExpensesPage() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.expenses.filters);
  const items = useAppSelector((state) => state.expenses.items);
  const pagination = useAppSelector((state) => state.expenses.pagination);
  const status = useAppSelector((state) => state.expenses.status);
  const error = useAppSelector((state) => state.expenses.error);

  const [form, setForm] = useState<FormState>({ open: false, expense: null });
  const [viewing, setViewing] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState<Expense | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [snack, setSnack] = useState<SnackState | null>(null);

  // Every filter, sort or page change produces a new filters object, which triggers a fetch
  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch, filters]);

  const isLoading = status === 'idle' || status === 'loading';
  const isEmpty = status === 'succeeded' && items.length === 0;

  const openCreate = () => setForm({ open: true, expense: null });

  const openEdit = (expense: Expense) => {
    setViewing(null);
    setForm({ open: true, expense });
  };

  const handleSaved = (message: string) => {
    setForm({ open: false, expense: null });
    setSnack({ message, severity: 'success' });
    dispatch(fetchExpenses());
  };

  const handleConfirmDelete = async () => {
    if (!deleting) return;

    setDeleteBusy(true);
    try {
      await deleteExpense(deleting._id);
      setSnack({ message: 'Expense deleted', severity: 'success' });
      setDeleting(null);
      setViewing(null);

      // If that was the last row on a later page, step back instead of showing an empty page
      if (items.length === 1 && filters.page > 1) {
        dispatch(setPage(filters.page - 1));
      } else {
        dispatch(fetchExpenses());
      }
    } catch (err) {
      setSnack({ message: getErrorMessage(err), severity: 'error' });
      setDeleting(null);
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Expenses
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Add expense
        </Button>
      </Box>

      <ExpenseFilters />

      <Box sx={{ height: 4 }}>{isLoading && <LinearProgress />}</Box>

      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => dispatch(fetchExpenses())}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {isEmpty ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">No expenses found</Typography>
          <Typography sx={{ color: 'text.secondary', mb: 2 }}>
            Nothing matches your current filters, or you have not added any expenses yet.
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={openCreate}>
            Add expense
          </Button>
        </Paper>
      ) : (
        items.length > 0 && (
          <Paper>
            <ExpenseTable
              expenses={items}
              onView={setViewing}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
            <TablePagination
              component="div"
              count={pagination.total}
              page={Math.max(0, pagination.page - 1)}
              rowsPerPage={filters.limit}
              rowsPerPageOptions={PAGE_SIZE_OPTIONS}
              onPageChange={(_event, newPage) => dispatch(setPage(newPage + 1))}
              onRowsPerPageChange={(event) => dispatch(setFilters({ limit: Number(event.target.value) }))}
            />
          </Paper>
        )
      )}

      {form.open && (
        <ExpenseFormDialog
          key={form.expense?._id ?? 'new'}
          expense={form.expense}
          onClose={() => setForm({ open: false, expense: null })}
          onSaved={handleSaved}
        />
      )}

      {viewing && (
        <ExpenseDetailDialog
          expense={viewing}
          onClose={() => setViewing(null)}
          onEdit={openEdit}
          onDelete={setDeleting}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete expense?"
        message={`"${deleting?.title ?? ''}" will be permanently removed. This cannot be undone.`}
        busy={deleteBusy}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
      />

      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={4000}
        onClose={(_event, reason) => {
          if (reason !== 'clickaway') setSnack(null);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {snack ? (
          <Alert severity={snack.severity} variant="filled" onClose={() => setSnack(null)}>
            {snack.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Stack>
  );
}
