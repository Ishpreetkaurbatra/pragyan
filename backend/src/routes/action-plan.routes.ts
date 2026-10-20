import { Router } from 'express';
import { ActionPlanController } from '../controllers/action-plan.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new ActionPlanController();

router.use(authMiddleware);

router.get('/', controller.getActionPlans);
router.post('/generate', controller.generateActionPlan);
router.get('/:id', controller.getActionPlanById);
router.post('/:id/submit', controller.submitForReview);

export default router;
