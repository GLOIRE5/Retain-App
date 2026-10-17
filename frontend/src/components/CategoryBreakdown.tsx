import { Box, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import type { CategorySpend } from '../types';
import { formatCurrency } from '../utils/format';

export default function CategoryBreakdown({ items }: { items: CategorySpend[] }) {
  const total = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Spending by category
      </Typography>

      {items.length === 0 ? (
        <Typography sx={{ color: 'text.secondary' }}>No spending recorded for this month.</Typography>
      ) : (
        <Stack spacing={2}>
          {items.map((item) => {
            const share = total > 0 ? (item.total / total) * 100 : 0;
            return (
              <Box key={item.categoryId}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 0.5 }}>
                  <Typography sx={{ fontWeight: 500 }}>{item.name}</Typography>
                  <Typography sx={{ whiteSpace: 'nowrap' }}>
                    {formatCurrency(item.total)}{' '}
                    <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                      ({Math.round(share)}%)
                    </Typography>
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={share} sx={{ height: 8, borderRadius: 4 }} />
              </Box>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
}
