import { Router } from 'express';
import { IntelligenceController } from '../controllers/intelligence.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new IntelligenceController();

router.use(authMiddleware);

router.post('/analyze', controller.analyze);
router.post('/match', controller.match);
router.post('/opportunity', controller.opportunity);
router.post('/action-plan', controller.actionPlan);
router.post('/experiment', controller.experiment);
router.get('/mode', controller.getMode);
router.post('/mode', controller.setMode);

export default router;
