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
} from '@mui/material';
import { createAdminCategory, updateAdminCategory } from '../api/admin';
import { getErrorMessage } from '../api/client';
import type { AdminCategory } from '../types';

interface CategoryFormDialogProps {
  // null means we are creating a new category
  category: AdminCategory | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

export default function CategoryFormDialog({ category, onClose, onSaved }: CategoryFormDialogProps) {
  const isEdit = category !== null;
  const [name, setName] = useState(category?.name ?? '');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setServerError(null);

    const trimmed = name.trim();
    if (!trimmed) {
      setFieldError('Category name is required');
      return;
    }
    if (trimmed.length > 40) {
      setFieldError('Category name must be 40 characters or fewer');
      return;
    }
    setFieldError(null);

    setSubmitting(true);
    try {
      if (category) {
        await updateAdminCategory(category._id, trimmed);
        onSaved('Category renamed');
      } else {
        await createAdminCategory(trimmed);
        onSaved('Category added');
      }
    } catch (err) {
      setServerError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onClose={submitting ? undefined : onClose} fullWidth maxWidth="xs">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle>{isEdit ? 'Rename category' : 'Add category'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {serverError && <Alert severity="error">{serverError}</Alert>}
            <TextField
              label="Category name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFieldError(null);
              }}
              error={Boolean(fieldError)}
              helperText={fieldError}
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
            {submitting ? <CircularProgress size={22} color="inherit" /> : isEdit ? 'Save' : 'Add category'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
