import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  LinearProgress,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { getErrorMessage } from '../api/client';
import { getDashboard } from '../api/dashboard';
import BudgetCard from '../components/BudgetCard';
import BudgetDialog from '../components/BudgetDialog';
import CategoryBreakdown from '../components/CategoryBreakdown';
import ExpenseFormDialog from '../components/ExpenseFormDialog';
import RecentExpenses from '../components/RecentExpenses';
import StatCard from '../components/StatCard';
import type { DashboardData } from '../types';
import { currentMonthKey, formatCurrency, formatMonthLabel, shiftMonth } from '../utils/format';

interface LoadResult {
  key: string;
  data: DashboardData | null;
  error: string | null;
}

export default function DashboardPage() {
  const [month, setMonth] = useState(currentMonthKey);
  const [refresh, setRefresh] = useState(0);
  const [result, setResult] = useState<LoadResult | null>(null);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [snack, setSnack] = useState<string | null>(null);

  // A result only counts as current when its key matches the month and refresh we are showing
  const key = `${month}:${refresh}`;

  useEffect(() => {
    let cancelled = false;

    getDashboard(month)
      .then((data) => {
        if (!cancelled) setResult({ key, data, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) setResult({ key, data: null, error: getErrorMessage(err) });
      });

    return () => {
      cancelled = true;
    };
  }, [month, key]);

  const loading = result?.key !== key;
  const data = result?.data ?? null;
  const error = loading ? null : (result?.error ?? null);

  const reload = () => setRefresh((value) => value + 1);

  const handleSaved = (message: string) => {
    setExpenseDialogOpen(false);
    setBudgetDialogOpen(false);
    setSnack(message);
    reload();
  };

  const remaining = data?.budget.remaining ?? null;

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton aria-label="Previous month" onClick={() => setMonth(shiftMonth(month, -1))}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 600, minWidth: 180, textAlign: 'center' }}>
            {formatMonthLabel(month)}
          </Typography>
          <IconButton aria-label="Next month" onClick={() => setMonth(shiftMonth(month, 1))}>
            <ChevronRightIcon />
          </IconButton>
          {month !== currentMonthKey() && (
            <Button size="small" onClick={() => setMonth(currentMonthKey())}>
              This month
            </Button>
          )}
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setExpenseDialogOpen(true)}>
          Add expense
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

      {!data && loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {data && (
        <Stack spacing={3} sx={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            }}
          >
            <StatCard label="Total spent" value={formatCurrency(data.budget.spent)} />
            <StatCard
              label="Remaining budget"
              value={remaining === null ? 'No budget' : formatCurrency(remaining)}
              helper={remaining === null ? 'Set a budget below' : undefined}
              color={data.budget.status === 'over' ? 'error.main' : undefined}
            />
            <StatCard
              label="Highest expense"
              value={data.highestExpense ? formatCurrency(data.highestExpense.amount) : 'None yet'}
              helper={data.highestExpense?.title}
            />
            <StatCard label="Expenses recorded" value={String(data.expenseCount)} />
          </Box>

          <BudgetCard budget={data.budget} onEdit={() => setBudgetDialogOpen(true)} />

          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            <CategoryBreakdown items={data.spendingByCategory} />
            <RecentExpenses expenses={data.recentExpenses} />
          </Box>
        </Stack>
      )}

      {expenseDialogOpen && (
        <ExpenseFormDialog expense={null} onClose={() => setExpenseDialogOpen(false)} onSaved={handleSaved} />
      )}

      {budgetDialogOpen && data && (
        <BudgetDialog
          month={month}
          currentAmount={data.budget.amount}
          onClose={() => setBudgetDialogOpen(false)}
          onSaved={handleSaved}
        />
      )}

      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={4000}
        onClose={(_event, reason) => {
          if (reason !== 'clickaway') setSnack(null);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {snack ? (
          <Alert severity="success" variant="filled" onClose={() => setSnack(null)}>
            {snack}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Stack>
  );
}
