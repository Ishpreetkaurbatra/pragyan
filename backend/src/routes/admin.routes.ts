import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';

const router = Router();
const controller = new AdminController();

router.use(authMiddleware);

router.get('/overview', controller.getOverview);
router.get('/users', controller.getUsers);
router.get('/businesses', controller.getBusinesses);
router.get('/trends', controller.getTrends);
router.get('/sources', controller.getSources);
router.get('/intelligence', controller.getIntelligence);
router.get('/reviews', controller.getReviews);
router.get('/logs', controller.getLogs);

export default router;
