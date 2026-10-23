import { Router } from 'express';
import { PipelineController } from '../controllers/pipeline.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new PipelineController();

router.use(authMiddleware);

router.post('/run', controller.runPipeline);

export default router;
