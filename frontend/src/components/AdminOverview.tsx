import { Alert, Box, Button, Chip, CircularProgress, Divider, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { getAdminInsights } from '../api/admin';
import { useApiData } from '../hooks/useApiData';
import type { AdminExpense, User } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import CategoryList from './CategoryList';
import StatCard from './StatCard';

function RecentExpensesList({ expenses }: { expenses: AdminExpense[] }) {
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Recently added expenses
      </Typography>

      {expenses.length === 0 ? (
        <Typography sx={{ color: 'text.secondary' }}>No expenses have been recorded yet.</Typography>
      ) : (
        <Stack divider={<Divider flexItem />} spacing={1.5}>
          {expenses.map((expense) => (
            <Box key={expense._id} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 500 }} noWrap>
                  {expense.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                  {expense.user?.name ?? 'Deleted user'}, {expense.category.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {formatDate(expense.date)}
                </Typography>
              </Box>
              <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{formatCurrency(expense.amount)}</Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );
}

function RecentUsersList({ users }: { users: User[] }) {
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Recently registered users
      </Typography>

      {users.length === 0 ? (
        <Typography sx={{ color: 'text.secondary' }}>No users yet.</Typography>
      ) : (
        <Stack divider={<Divider flexItem />} spacing={1.5}>
          {users.map((user) => (
            <Box key={user._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 500 }} noWrap>
                  {user.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                  {user.email}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Joined {formatDate(user.createdAt)}
                </Typography>
              </Box>
              <Chip
                size="small"
                label={user.role}
                variant="outlined"
                color={user.role === 'admin' ? 'primary' : 'default'}
              />
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );
}

export default function AdminOverview() {
  const { data, error, loading, reload } = useApiData(getAdminInsights);

  return (
    <Stack spacing={3}>
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
            <StatCard label="Registered users" value={String(data.totalUsers)} />
            <StatCard label="Expenses recorded" value={String(data.totalExpenses)} />
            <StatCard label="Total expense value" value={formatCurrency(data.totalExpenseValue)} />
            <StatCard label="Expenses this month" value={String(data.expensesThisMonth)} />
          </Box>

          <CategoryList title="Total spending per category" items={data.spendingPerCategory} variant="spending" />

          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            <CategoryList title="Top 5 most-used categories" items={data.mostUsedCategories} variant="usage" />
            <CategoryList title="Bottom 5 least-used categories" items={data.leastUsedCategories} variant="usage" />
          </Box>

          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            <RecentExpensesList expenses={data.recentExpenses} />
            <RecentUsersList users={data.recentUsers} />
          </Box>
        </Stack>
      )}
    </Stack>
  );
}
