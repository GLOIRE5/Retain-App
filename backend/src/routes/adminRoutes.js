import { Router } from 'express';
import {
  listAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from '../controllers/adminCategoryController.js';
import { getInsights } from '../controllers/adminInsightsController.js';
import { protect, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { categorySchema } from '../validators/categorySchemas.js';

const router = Router();

// Every route below requires a logged-in admin
router.use(protect, requireRole('admin'));

router.get('/insights', getInsights);

router
  .route('/categories')
  .get(listAdminCategories)
  .post(validate(categorySchema), createAdminCategory);

router
  .route('/categories/:id')
  .put(validate(categorySchema), updateAdminCategory)
  .delete(deleteAdminCategory);

export default router;
