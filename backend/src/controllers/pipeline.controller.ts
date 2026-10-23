import { Request, Response } from 'express';
import { PipelineService } from '../pipeline/pipeline.service';

export class PipelineController {
  private service = PipelineService.getInstance();

  public runPipeline = async (req: Request, res: Response) => {
    try {
      const city = req.body.city || 'Nashik';
      const state = req.body.state;
      const country = req.body.country || 'India';
      const mode = (req.body.mode || 'demo').toLowerCase() as 'demo' | 'live';
      const business = req.body.business;

      const result = await this.service.runPipeline({
        city,
        state,
        country,
        mode,
        business,
      });

      return res.json({
        success: true,
        data: {
          runId: result.runId,
          city: result.city,
          state: result.state,
          country: result.country,
          mode: result.mode,
          notice: result.notice,
          stats: result.stats,
          clustersCount: result.clusters.length,
          topTrendName: result.topTrend?.cluster.name,
        },
        error: null,
        meta: {
          requestId: res.locals.requestId,
        },
      });
    } catch (err) {
      console.error('[PipelineController] Error running pipeline:', err);
      return res.status(500).json({
        success: false,
        error: {
          code: 'PIPELINE_EXECUTION_ERROR',
          message: err instanceof Error ? err.message : 'Unknown pipeline error',
          requestId: res.locals.requestId,
        },
      });
    }
  };
}
