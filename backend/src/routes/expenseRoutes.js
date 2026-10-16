import { Router } from 'express';
import {
  listExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { expenseSchema, listQuerySchema } from '../validators/expenseSchemas.js';

const router = Router();

router.use(protect);

router
  .route('/')
  .get(validate(listQuerySchema, 'query'), listExpenses)
  .post(validate(expenseSchema), createExpense);

router
  .route('/:id')
  .get(getExpense)
  .put(validate(expenseSchema), updateExpense)
  .delete(deleteExpense);

export default router;
