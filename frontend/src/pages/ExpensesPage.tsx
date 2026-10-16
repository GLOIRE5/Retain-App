import { useEffect } from 'react';
import { Alert, Box, Button, LinearProgress, Paper, Stack, TablePagination, Typography } from '@mui/material';
import ExpenseFilters from '../components/ExpenseFilters';
import ExpenseTable from '../components/ExpenseTable';
import { PAGE_SIZE_OPTIONS } from '../constants';
import { fetchExpenses, setFilters, setPage } from '../store/expensesSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export default function ExpensesPage() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.expenses.filters);
  const items = useAppSelector((state) => state.expenses.items);
  const pagination = useAppSelector((state) => state.expenses.pagination);
  const status = useAppSelector((state) => state.expenses.status);
  const error = useAppSelector((state) => state.expenses.error);

  // Every filter, sort or page change produces a new filters object, which triggers a fetch
  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch, filters]);

  const isLoading = status === 'idle' || status === 'loading';
  const isEmpty = status === 'succeeded' && items.length === 0;

  return (
    <Stack spacing={3}>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Expenses
      </Typography>

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
          <Typography sx={{ color: 'text.secondary' }}>
            Nothing matches your current filters. Try changing or resetting them.
          </Typography>
        </Paper>
      ) : (
        items.length > 0 && (
          <Paper>
            <ExpenseTable expenses={items} />
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
    </Stack>
  );
}
