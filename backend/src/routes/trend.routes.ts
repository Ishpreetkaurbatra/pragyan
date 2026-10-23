import { Router } from 'express';
import { TrendController } from '../controllers/trend.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new TrendController();

router.use(authMiddleware);

router.get('/', controller.getTrends);
router.post('/analyze', controller.analyzeTrend);
router.get('/sources', controller.getSources);
router.get('/sources/status', controller.getSourcesStatus);
router.get('/runs/:id', controller.getPipelineRun);
router.get('/saved', controller.getSavedTrends);
router.get('/:id', controller.getTrendById);
router.get('/:id/signals', controller.getTrendSignals);
router.get('/:id/metrics', controller.getTrendMetrics);
router.get('/:id/audience', controller.getTrendAudience);
router.get('/:id/geography', controller.getTrendGeography);
router.post('/:id/save', controller.saveTrend);
router.delete('/:id/save', controller.unsaveTrend);

export default router;
