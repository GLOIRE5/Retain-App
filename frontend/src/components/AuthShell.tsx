import type { ReactNode } from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5, textAlign: 'center' }}>
          Retain
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}>
          Personal expense and budget tracker
        </Typography>
        <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 3 }}>{subtitle}</Typography>
          {children}
        </Paper>
      </Container>
    </Box>
  );
}
