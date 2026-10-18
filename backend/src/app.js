import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// The built React app lives next to the backend folder (created by the frontend build)
const clientDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../frontend/dist');
const serveClient = fs.existsSync(path.join(clientDist, 'index.html'));

// Behind a proxy (Render, for example) so rate limiting sees the real client IP
app.set('trust proxy', 1);

// CLIENT_URL can hold several origins separated by commas.
// It is only needed when the frontend is hosted on a different address than the API.
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      // Left out so the app can also be tested over plain http://localhost
      directives: { 'upgrade-insecure-requests': null },
    },
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      // Requests with no Origin header (curl, server to server) are allowed
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
  })
);
app.use(express.json({ limit: '10kb' }));

// Slow down password guessing on the login and signup routes only
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === 'production' ? 20 : 1000,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many attempts. Please try again in a few minutes.' });
  },
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use(['/api/auth/login', '/api/auth/signup'], authLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

// Any other /api path is a JSON 404, never the React app
app.use('/api', notFound);

// Serve the built frontend; unknown paths return index.html so React Router can handle them
if (serveClient) {
  app.use(express.static(clientDist));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

export default app;
