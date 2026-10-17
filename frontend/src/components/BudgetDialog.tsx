import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { getErrorMessage } from '../api/client';
import { saveBudget } from '../api/dashboard';
import { formatMonthLabel } from '../utils/format';

interface BudgetDialogProps {
  month: string;
  currentAmount: number | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

export default function BudgetDialog({ month, currentAmount, onClose, onSaved }: BudgetDialogProps) {
  const [amount, setAmount] = useState(currentAmount !== null ? String(currentAmount) : '');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setServerError(null);

    const value = Number(amount);
    if (amount === '' || !Number.isFinite(value) || value <= 0) {
      setFieldError('Enter a budget greater than 0');
      return;
    }
    setFieldError(null);

    setSubmitting(true);
    try {
      await saveBudget(month, value);
      onSaved(currentAmount === null ? 'Budget set' : 'Budget updated');
    } catch (err) {
      setServerError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onClose={submitting ? undefined : onClose} fullWidth maxWidth="xs">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle>{currentAmount === null ? 'Set budget' : 'Update budget'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography sx={{ color: 'text.secondary' }}>
              Monthly spending budget for {formatMonthLabel(month)}.
            </Typography>
            {serverError && <Alert severity="error">{serverError}</Alert>}
            <TextField
              label="Budget (RWF)"
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setFieldError(null);
              }}
              error={Boolean(fieldError)}
              helperText={fieldError}
              slotProps={{ htmlInput: { min: 0, step: 'any' } }}
              fullWidth
              autoFocus
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? <CircularProgress size={22} color="inherit" /> : 'Save budget'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
