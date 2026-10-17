import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { Expense } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

export default function RecentExpenses({ expenses }: { expenses: Expense[] }) {
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Recent expenses
        </Typography>
        <Button component={RouterLink} to="/expenses" size="small">
          View all
        </Button>
      </Box>

      {expenses.length === 0 ? (
        <Typography sx={{ color: 'text.secondary' }}>No expenses recorded for this month.</Typography>
      ) : (
        <Stack divider={<Divider flexItem />} spacing={1.5}>
          {expenses.map((expense) => (
            <Box key={expense._id} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 500 }} noWrap>
                  {expense.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                  {expense.category.name} ? {formatDate(expense.date)}
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
