import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getErrorMessage } from '../api/client';
import { listExpenses } from '../api/expenses';
import type { ExpenseListParams } from '../api/expenses';
import type { Expense, ExpenseListResponse, Pagination, PaymentMethod, SortOption } from '../types';

export interface ExpenseFilters {
  search: string;
  category: string; // category id, '' means all
  paymentMethod: PaymentMethod | '';
  from: string; // YYYY-MM-DD, '' means no limit
  to: string;
  minAmount: string; // kept as strings so the inputs can be empty
  maxAmount: string;
  sort: SortOption;
  page: number;
  limit: number;
}

export const DEFAULT_FILTERS: ExpenseFilters = {
  search: '',
  category: '',
  paymentMethod: '',
  from: '',
  to: '',
  minAmount: '',
  maxAmount: '',
  sort: '-date',
  page: 1,
  limit: 10,
};

type LoadStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ExpensesState {
  filters: ExpenseFilters;
  items: Expense[];
  pagination: Pagination;
  status: LoadStatus;
  error: string | null;
  currentRequestId: string | null;
}

const initialState: ExpensesState = {
  filters: { ...DEFAULT_FILTERS },
  items: [],
  pagination: { page: 1, limit: DEFAULT_FILTERS.limit, total: 0, totalPages: 1 },
  status: 'idle',
  error: null,
  currentRequestId: null,
};

const toNumber = (value: string): number | undefined => {
  if (value === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

// Turns the filter state into query params, leaving out anything empty
const buildParams = (filters: ExpenseFilters): ExpenseListParams => {
  const params: ExpenseListParams = {
    page: filters.page,
    limit: filters.limit,
    sort: filters.sort,
  };

  if (filters.search) params.search = filters.search;
  if (filters.category) params.category = filters.category;
  if (filters.paymentMethod) params.paymentMethod = filters.paymentMethod;
  if (filters.from) params.from = filters.from;
  if (filters.to) params.to = filters.to;

  const minAmount = toNumber(filters.minAmount);
  const maxAmount = toNumber(filters.maxAmount);
  if (minAmount !== undefined) params.minAmount = minAmount;
  if (maxAmount !== undefined) params.maxAmount = maxAmount;

  return params;
};

export const fetchExpenses = createAsyncThunk<
  ExpenseListResponse,
  void,
  { state: { expenses: ExpensesState }; rejectValue: string }
>('expenses/fetch', async (_arg, { getState, rejectWithValue }) => {
  try {
    return await listExpenses(buildParams(getState().expenses.filters));
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    // Any filter, search or sort change goes through here and returns to page 1
    setFilters(state, action: PayloadAction<Partial<Omit<ExpenseFilters, 'page'>>>) {
      Object.assign(state.filters, action.payload);
      state.filters.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.filters.page = action.payload;
    },
    resetFilters(state) {
      state.filters = { ...DEFAULT_FILTERS, limit: state.filters.limit };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        // Ignore responses from requests that have already been replaced by a newer one
        if (state.currentRequestId !== action.meta.requestId) return;
        state.status = 'succeeded';
        state.items = action.payload.expenses;
        state.pagination = action.payload.pagination;
        state.currentRequestId = null;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Failed to load expenses';
        state.currentRequestId = null;
      });
  },
});

export const { setFilters, setPage, resetFilters } = expensesSlice.actions;
export default expensesSlice.reducer;
