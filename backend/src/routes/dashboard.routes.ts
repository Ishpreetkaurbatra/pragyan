import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new DashboardController();

router.use(authMiddleware);

router.get('/', controller.getDashboard);

export default router;
