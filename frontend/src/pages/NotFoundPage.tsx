import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <Typography variant="h3" sx={{ fontWeight: 700 }}>
        404
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>That page does not exist.</Typography>
      <Button variant="contained" component={RouterLink} to="/">
        Go home
      </Button>
    </Box>
  );
}
