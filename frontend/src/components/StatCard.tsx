import { Paper, Typography } from '@mui/material';

interface StatCardProps {
  label: string;
  value: string;
  helper?: string;
  color?: string;
}

export default function StatCard({ label, value, helper, color }: StatCardProps) {
  return (
    <Paper sx={{ p: 2.5, minWidth: 0 }}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, color: color ?? 'text.primary' }} noWrap>
        {value}
      </Typography>
      {helper && (
        <Typography variant="caption" component="div" sx={{ color: 'text.secondary' }} noWrap>
          {helper}
        </Typography>
      )}
    </Paper>
  );
}
