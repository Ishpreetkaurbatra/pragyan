import { Router } from 'express';
import { ExperimentController } from '../controllers/experiment.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new ExperimentController();

router.use(authMiddleware);

router.get('/', controller.getExperiments);
router.post('/', controller.createExperiment);
router.get('/:id', controller.getExperimentById);
router.post('/:id/metrics', controller.addMetric);
router.post('/:id/complete', controller.complete);
router.post('/:id/analyze', controller.analyze);

export default router;
