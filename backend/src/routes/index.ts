import { Router } from 'express';
import authRoutes from './auth.routes';
import businessRoutes from './business.routes';
import trendRoutes from './trend.routes';
import intelligenceRoutes from './intelligence.routes';
import opportunityRoutes from './opportunity.routes';
import actionPlanRoutes from './action-plan.routes';
import expertRoutes from './expert.routes';
import experimentRoutes from './experiment.routes';
import alertRoutes from './alert.routes';
import dashboardRoutes from './dashboard.routes';
import adminRoutes from './admin.routes';
import askTgRoutes from './ask-tg.routes';
import pipelineRoutes from './pipeline.routes';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'T→G API',
    version: '1.0.0',
    intelligenceVersion: 'tgo-v1',
  });
});

router.use('/auth', authRoutes);
router.use('/business', businessRoutes);
router.use('/trends', trendRoutes);
router.use('/intelligence', intelligenceRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/action-plans', actionPlanRoutes);
router.use('/expert', expertRoutes);
router.use('/experiments', experimentRoutes);
router.use('/alerts', alertRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/admin', adminRoutes);
router.use('/ask-tg', askTgRoutes);
router.use('/pipeline', pipelineRoutes);

export default router;
