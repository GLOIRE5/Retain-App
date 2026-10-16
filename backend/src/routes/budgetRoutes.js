import { Router } from 'express';
import { getBudget, setBudget } from '../controllers/budgetController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { budgetSchema } from '../validators/budgetSchemas.js';

const router = Router();

router.use(protect);

router.get('/:month', getBudget);
router.put('/:month', validate(budgetSchema), setBudget);

export default router;
