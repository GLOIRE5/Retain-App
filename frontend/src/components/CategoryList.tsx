import { Box, Divider, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import type { CategorySpend } from '../types';
import { formatCurrency } from '../utils/format';

interface CategoryListProps {
  title: string;
  items: CategorySpend[];
  // spending: ranked by money, with a share bar. usage: ranked by how many expenses use it
  variant: 'spending' | 'usage';
}

export default function CategoryList({ title, items, variant }: CategoryListProps) {
  const total = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        {title}
      </Typography>

      {items.length === 0 ? (
        <Typography sx={{ color: 'text.secondary' }}>No categories yet.</Typography>
      ) : (
        <Stack divider={<Divider flexItem />} spacing={1.5}>
          {items.map((item, index) => {
            const share = total > 0 ? (item.total / total) * 100 : 0;

            return (
              <Box key={item.categoryId}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  <Typography sx={{ fontWeight: 500 }} noWrap>
                    {variant === 'usage' ? `${index + 1}. ` : ''}
                    {item.name}
                  </Typography>
                  {variant === 'spending' ? (
                    <Typography sx={{ whiteSpace: 'nowrap' }}>{formatCurrency(item.total)}</Typography>
                  ) : (
                    <Typography sx={{ whiteSpace: 'nowrap' }}>
                      {item.count} {item.count === 1 ? 'expense' : 'expenses'}
                    </Typography>
                  )}
                </Box>
                {variant === 'spending' ? (
                  <LinearProgress variant="determinate" value={share} sx={{ height: 6, borderRadius: 3, mt: 0.75 }} />
                ) : (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {formatCurrency(item.total)} in total
                  </Typography>
                )}
              </Box>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
}
