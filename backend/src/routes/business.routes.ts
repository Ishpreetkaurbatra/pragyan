import { Router } from 'express';
import { BusinessController } from '../controllers/business.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new BusinessController();

router.use(authMiddleware);

router.get('/profile', controller.getProfile);
router.post('/profile', controller.saveProfile);
router.put('/profile', controller.saveProfile);

export default router;
