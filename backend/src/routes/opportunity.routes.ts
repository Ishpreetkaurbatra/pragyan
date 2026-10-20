import { Router } from 'express';
import { OpportunityController } from '../controllers/opportunity.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new OpportunityController();

router.use(authMiddleware);

router.get('/', controller.getOpportunities);
router.post('/generate', controller.generateOpportunity);
router.get('/:id', controller.getOpportunityById);

export default router;
