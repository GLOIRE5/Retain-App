import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import AppLayout from './components/AppLayout';
import ErrorBoundary from './components/ErrorBoundary';
import FullPageSpinner from './components/FullPageSpinner';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ExpensesPage = lazy(() => import('./pages/ExpensesPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<FullPageSpinner />}>
            <Routes>
              {/* Only for signed-out visitors */}
              <Route element={<GuestRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
              </Route>

              {/* Any signed-in user */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/expenses" element={<ExpensesPage />} />

                  {/* Admins only */}
                  <Route element={<ProtectedRoute roles={['admin']} />}>
                    <Route path="/admin" element={<AdminPage />} />
                  </Route>
                </Route>
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
