import { Router } from 'express';
import { AlertController } from '../controllers/alert.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new AlertController();

router.use(authMiddleware);

router.get('/', controller.getAlerts);
router.post('/:id/read', controller.markAsRead);

export default router;
