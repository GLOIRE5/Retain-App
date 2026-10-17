import { Box, Button, LinearProgress, Paper, Typography } from '@mui/material';
import type { BudgetSummary } from '../types';
import { formatCurrency } from '../utils/format';

interface BudgetCardProps {
  budget: BudgetSummary;
  onEdit: () => void;
}

type Tone = 'success' | 'warning' | 'error';

interface Message {
  headline: string;
  tone: Tone;
}

const getMessage = (budget: BudgetSummary): Message | null => {
  if (budget.amount === null || budget.remaining === null) return null;

  if (budget.status === 'over') {
    return {
      headline: `You are ${formatCurrency(Math.abs(budget.remaining))} over budget`,
      tone: 'error',
    };
  }

  if (budget.status === 'approaching') {
    return {
      headline: `Only ${formatCurrency(budget.remaining)} left`,
      tone: 'warning',
    };
  }

  return {
    headline: `${formatCurrency(budget.remaining)} left to spend`,
    tone: 'success',
  };
};

export default function BudgetCard({ budget, onEdit }: BudgetCardProps) {
  const message = getMessage(budget);

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Monthly budget
        </Typography>
        <Button variant={message ? 'outlined' : 'contained'} onClick={onEdit}>
          {message ? 'Change budget' : 'Set budget'}
        </Button>
      </Box>

      {!message || budget.amount === null ? (
        <Typography sx={{ color: 'text.secondary' }}>
          You have not set a budget for this month yet. Set one to see how much you can still spend.
        </Typography>
      ) : (
        <>
          <Typography variant="h5" sx={{ fontWeight: 700, color: `${message.tone}.main`, mb: 2 }}>
            {message.headline}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, budget.percentUsed ?? 0)}
            color={message.tone}
            sx={{ height: 10, borderRadius: 5, mb: 1 }}
          />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Spent {formatCurrency(budget.spent)} of {formatCurrency(budget.amount)}
          </Typography>
        </>
      )}
    </Paper>
  );
}
