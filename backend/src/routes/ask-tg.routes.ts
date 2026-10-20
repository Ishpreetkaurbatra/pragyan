import { Router, Request, Response } from 'express';
import { AskTGService } from '../services/ask-tg.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const service = new AskTGService();

router.use(authMiddleware);

router.post('/', async (req: Request, res: Response) => {
  const { question, businessId } = req.body;
  if (!question) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_INPUT', message: 'Question is required.', requestId: res.locals.requestId },
    });
  }

  const result = await service.ask(question, businessId);
  return res.json(result);
});

export default router;
