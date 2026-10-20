import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new AuthController();

router.get('/me', authMiddleware, controller.getMe);
router.post('/login', controller.login);
router.post('/register', controller.register);
router.post('/switch-role', controller.switchRole);

export default router;
