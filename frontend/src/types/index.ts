export type Role = 'user' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export type PaymentMethod = 'cash' | 'card' | 'mobile_money' | 'bank_transfer';

export type SortOption = 'date' | '-date' | 'amount' | '-amount';

export interface Category {
  _id: string;
  name: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCategory extends Category {
  expenseCount: number;
  totalSpent: number;
}

export interface CategoryRef {
  _id: string;
  name: string;
}

export interface Expense {
  _id: string;
  user: string;
  title: string;
  amount: number;
  category: CategoryRef;
  date: string;
  paymentMethod: PaymentMethod;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseInput {
  title: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ExpenseListResponse {
  expenses: Expense[];
  pagination: Pagination;
}

export type BudgetStatus = 'no_budget' | 'within' | 'approaching' | 'over';

export interface BudgetSummary {
  month: string;
  amount: number | null;
  spent: number;
  remaining: number | null;
  percentUsed: number | null;
  status: BudgetStatus;
}

export interface CategorySpend {
  categoryId: string;
  name: string;
  total: number;
  count: number;
}

export interface DashboardData {
  month: string;
  budget: BudgetSummary;
  expenseCount: number;
  highestExpense: Expense | null;
  spendingByCategory: CategorySpend[];
  recentExpenses: Expense[];
}

export interface AdminExpense extends Omit<Expense, 'user'> {
  user: { _id: string; name: string; email: string } | null;
}

export interface AdminInsights {
  totalUsers: number;
  totalExpenses: number;
  totalExpenseValue: number;
  expensesThisMonth: number;
  spendingPerCategory: CategorySpend[];
  mostUsedCategories: CategorySpend[];
  leastUsedCategories: CategorySpend[];
  recentExpenses: AdminExpense[];
  recentUsers: User[];
}
