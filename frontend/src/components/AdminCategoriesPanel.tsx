import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  LinearProgress,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { deleteAdminCategory, listAdminCategories } from '../api/admin';
import { getErrorMessage } from '../api/client';
import { useApiData } from '../hooks/useApiData';
import type { AdminCategory } from '../types';
import { formatCurrency } from '../utils/format';
import CategoryFormDialog from './CategoryFormDialog';
import ConfirmDialog from './ConfirmDialog';

interface FormState {
  open: boolean;
  category: AdminCategory | null;
}

interface SnackState {
  message: string;
  severity: 'success' | 'error';
}

export default function AdminCategoriesPanel() {
  const { data: categories, error, loading, reload } = useApiData(listAdminCategories);

  const [form, setForm] = useState<FormState>({ open: false, category: null });
  const [deleting, setDeleting] = useState<AdminCategory | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [snack, setSnack] = useState<SnackState | null>(null);

  const defaultName = categories?.find((category) => category.isDefault)?.name ?? 'Uncategorized';

  const handleSaved = (message: string) => {
    setForm({ open: false, category: null });
    setSnack({ message, severity: 'success' });
    reload();
  };

  const handleConfirmDelete = async () => {
    if (!deleting) return;

    setDeleteBusy(true);
    try {
      const result = await deleteAdminCategory(deleting._id);
      const moved = result.reassignedExpenses;
      setSnack({
        message:
          moved > 0
            ? `Category deleted. ${moved} ${moved === 1 ? 'expense' : 'expenses'} moved to ${result.reassignedTo}.`
            : 'Category deleted',
        severity: 'success',
      });
      setDeleting(null);
      reload();
    } catch (err) {
      setSnack({ message: getErrorMessage(err), severity: 'error' });
      setDeleting(null);
    } finally {
      setDeleteBusy(false);
    }
  };

  const deleteMessage = deleting
    ? deleting.expenseCount > 0
      ? `"${deleting.name}" has ${deleting.expenseCount} ${deleting.expenseCount === 1 ? 'expense' : 'expenses'}. They will be moved to "${defaultName}" before the category is deleted.`
      : `"${deleting.name}" has no expenses and will be permanently deleted.`
    : '';

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Typography sx={{ color: 'text.secondary' }}>
          Manage the categories users can pick when they record an expense.
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setForm({ open: true, category: null })}>
          Add category
        </Button>
      </Box>

      <Box sx={{ height: 4 }}>{loading && <LinearProgress />}</Box>

      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={reload}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {!categories && loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {categories && (
        <TableContainer component={Paper} sx={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
          <Table sx={{ minWidth: 560 }}>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell align="right">Expenses</TableCell>
                <TableCell align="right">Total spent</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontWeight: 500 }}>{category.name}</Typography>
                      {category.isDefault && <Chip size="small" label="Default" color="primary" variant="outlined" />}
                    </Box>
                  </TableCell>
                  <TableCell align="right">{category.expenseCount}</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    {formatCurrency(category.totalSpent)}
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <Tooltip title="Rename">
                      <IconButton aria-label={`Rename ${category.name}`} onClick={() => setForm({ open: true, category })}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={category.isDefault ? 'The default category cannot be deleted' : 'Delete'}>
                      <span>
                        <IconButton
                          aria-label={`Delete ${category.name}`}
                          color="error"
                          disabled={category.isDefault}
                          onClick={() => setDeleting(category)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {form.open && (
        <CategoryFormDialog
          key={form.category?._id ?? 'new'}
          category={form.category}
          onClose={() => setForm({ open: false, category: null })}
          onSaved={handleSaved}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete category?"
        message={deleteMessage}
        busy={deleteBusy}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
      />

      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={5000}
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
