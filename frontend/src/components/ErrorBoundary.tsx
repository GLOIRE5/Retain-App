import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Box, Button, Typography } from '@mui/material';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          p: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Something went wrong
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          An unexpected error occurred. Reloading the app usually fixes it.
        </Typography>
        <Button variant="contained" onClick={() => window.location.assign('/')}>
          Reload app
        </Button>
      </Box>
    );
  }
}
