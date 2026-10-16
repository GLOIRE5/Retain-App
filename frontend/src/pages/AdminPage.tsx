import { Paper, Typography } from '@mui/material';

export default function AdminPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
        Admin dashboard
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>
        Category management and platform insights will appear here. Only admins can see this page.
      </Typography>
    </Paper>
  );
}
