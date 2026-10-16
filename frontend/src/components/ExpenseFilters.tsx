import { useEffect, useRef, useState } from 'react';
import { Box, Button, InputAdornment, MenuItem, Paper, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { PAYMENT_METHOD_OPTIONS, SORT_OPTIONS } from '../constants';
import { useCategories } from '../hooks/useCategories';
import { DEFAULT_FILTERS, resetFilters, setFilters } from '../store/expensesSlice';
import type { ExpenseFilters as ExpenseFiltersState } from '../store/expensesSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { PaymentMethod, SortOption } from '../types';

const DEBOUNCE_MS = 400;

export default function ExpenseFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.expenses.filters);
  const { categories } = useCategories();

  // Local copies only while the user is typing; Redux holds the committed values
  const [search, setSearch] = useState(filters.search);
  const [minAmount, setMinAmount] = useState(filters.minAmount);
  const [maxAmount, setMaxAmount] = useState(filters.maxAmount);
  const timers = useRef<Record<string, number>>({});

  useEffect(() => {
    const pending = timers.current;
    return () => {
      Object.values(pending).forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const schedule = (key: string, patch: Partial<Omit<ExpenseFiltersState, 'page'>>) => {
    window.clearTimeout(timers.current[key]);
    timers.current[key] = window.setTimeout(() => {
      dispatch(setFilters(patch));
    }, DEBOUNCE_MS);
  };

  const handleReset = () => {
    Object.values(timers.current).forEach((id) => window.clearTimeout(id));
    setSearch('');
    setMinAmount('');
    setMaxAmount('');
    dispatch(resetFilters());
  };

  const hasActiveFilters =
    search !== '' ||
    minAmount !== '' ||
    maxAmount !== '' ||
    (Object.keys(DEFAULT_FILTERS) as (keyof ExpenseFiltersState)[]).some(
      (key) => key !== 'page' && key !== 'limit' && filters[key] !== DEFAULT_FILTERS[key]
    );

  return (
    <Paper sx={{ p: 2 }}>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        }}
      >
        <TextField
          label="Search"
          placeholder="Title or notes"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            schedule('search', { search: e.target.value.trim() });
          }}
          sx={{ gridColumn: { md: 'span 2' } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          select
          label="Category"
          value={filters.category}
          onChange={(e) => dispatch(setFilters({ category: e.target.value }))}
          slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
        >
          <MenuItem value="">All categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Payment method"
          value={filters.paymentMethod}
          onChange={(e) => dispatch(setFilters({ paymentMethod: e.target.value as PaymentMethod | '' }))}
          slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
        >
          <MenuItem value="">All methods</MenuItem>
          {PAYMENT_METHOD_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="From"
          type="date"
          value={filters.from}
          onChange={(e) => dispatch(setFilters({ from: e.target.value }))}
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { max: filters.to || undefined },
          }}
        />

        <TextField
          label="To"
          type="date"
          value={filters.to}
          onChange={(e) => dispatch(setFilters({ to: e.target.value }))}
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { min: filters.from || undefined },
          }}
        />

        <TextField
          label="Min amount"
          type="number"
          value={minAmount}
          onChange={(e) => {
            setMinAmount(e.target.value);
            schedule('minAmount', { minAmount: e.target.value });
          }}
          slotProps={{ htmlInput: { min: 0 } }}
        />

        <TextField
          label="Max amount"
          type="number"
          value={maxAmount}
          onChange={(e) => {
            setMaxAmount(e.target.value);
            schedule('maxAmount', { maxAmount: e.target.value });
          }}
          slotProps={{ htmlInput: { min: 0 } }}
        />

        <TextField
          select
          label="Sort by"
          value={filters.sort}
          onChange={(e) => dispatch(setFilters({ sort: e.target.value as SortOption }))}
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button onClick={handleReset} disabled={!hasActiveFilters}>
            Reset filters
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
