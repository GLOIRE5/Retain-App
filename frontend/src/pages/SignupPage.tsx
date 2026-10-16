import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert, Box, Button, CircularProgress, Link, Stack, TextField, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../context/useAuth';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const validate = (name: string, email: string, password: string, confirm: string): string | null => {
  if (!name.trim()) return 'Enter your name';
  if (!EMAIL_REGEX.test(email.trim())) return 'Enter a valid email address';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (password !== confirm) return 'Passwords do not match';
  return null;
};

export default function SignupPage() {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const problem = validate(name, email, password, confirm);
    if (problem) {
      setError(problem);
      return;
    }

    setSubmitting(true);
    try {
      // On success the user state changes and GuestRoute redirects away from this page
      await signup(name.trim(), email.trim(), password);
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Start tracking your spending in minutes.">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Full name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            autoFocus
          />
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="new-password"
            helperText="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <TextField
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            fullWidth
          />
          <Button type="submit" variant="contained" size="large" disabled={submitting}>
            {submitting ? <CircularProgress size={24} color="inherit" /> : 'Create account'}
          </Button>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login">
              Sign in
            </Link>
          </Typography>
        </Stack>
      </Box>
    </AuthShell>
  );
}
