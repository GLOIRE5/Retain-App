import { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Container, Typography } from '@mui/material';
import api, { getErrorMessage } from './api/client';

type Status =
  | { state: 'loading' }
  | { state: 'ok'; time: string }
  | { state: 'error'; message: string };

export default function App() {
  const [status, setStatus] = useState<Status>({ state: 'loading' });

  useEffect(() => {
    let cancelled = false;

    api
      .get<{ status: string; time: string }>('/health')
      .then((res) => {
        if (!cancelled) setStatus({ state: 'ok', time: res.data.time });
      })
      .catch((err: unknown) => {
        if (!cancelled) setStatus({ state: 'error', message: getErrorMessage(err) });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
        Retain
      </Typography>
      <Typography sx={{ mb: 4, color: 'text.secondary' }}>
        Personal expense and budget tracker
      </Typography>

      {status.state === 'loading' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={24} />
          <Typography>Connecting to the API...</Typography>
        </Box>
      )}
      {status.state === 'ok' && (
        <Alert severity="success">API connected. Server time: {status.time}</Alert>
      )}
      {status.state === 'error' && <Alert severity="error">{status.message}</Alert>}
    </Container>
  );
}
