import { Router } from 'express';
import { ExpertController } from '../controllers/expert.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new ExpertController();

router.use(authMiddleware);

router.get('/reviews', controller.getReviews);
router.post('/reviews/:id/approve', controller.approve);
router.post('/reviews/:id/request-changes', controller.requestChanges);
router.post('/reviews/:id/reject', controller.reject);

export default router;
