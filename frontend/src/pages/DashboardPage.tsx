import { Chip, Paper, Typography } from '@mui/material';
import { useAuth } from '../context/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
        Welcome, {user?.name}
      </Typography>
      <Chip label={`Role: ${user?.role}`} color="primary" size="small" />
      <Typography sx={{ mt: 2, color: 'text.secondary' }}>
        Your dashboard, expenses and budget will appear here.
      </Typography>
    </Paper>
  );
}
