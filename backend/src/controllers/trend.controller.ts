import { Request, Response } from 'express';
import { TrendService } from '../services/trend.service';
import { PipelineService } from '../pipeline/pipeline.service';
import { BusinessContext } from '../models/intelligence-pipeline.types';
import { SourceManager } from '../connectors/source-manager.service';
import { PipelineRepository } from '../repositories/pipeline.repository';

export class TrendController {
  private service = new TrendService();

  public getTrends = async (req: Request, res: Response) => {
    const { category, search, status } = req.query as { category?: string; search?: string; status?: string };
    const trends = await this.service.getTrends({ category, search, status });
    return res.json({
      success: true,
      data: trends,
      meta: { count: trends.length, requestId: res.locals.requestId },
    });
  };

  public getTrendById = async (req: Request, res: Response) => {
    const { id } = req.params;
    let trend = await this.service.getTrendById(id);
    if (!trend) {
      trend = await this.service.getTrendBySlug(id);
    }
    if (!trend) {
      return res.status(404).json({
        success: false,
        error: { code: 'TREND_NOT_FOUND', message: 'Trend not found.', requestId: res.locals.requestId },
      });
    }

    return res.json({
      success: true,
      data: trend,
      meta: { requestId: res.locals.requestId },
    });
  };

  public getTrendSignals = async (req: Request, res: Response) => {
    const { id } = req.params;
    const signals = await this.service.getTrendSignals(id);
    return res.json({
      success: true,
      data: signals,
      meta: { count: signals.length, requestId: res.locals.requestId },
    });
  };

  public getTrendMetrics = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { period } = req.query as { period?: string };
    const metrics = await this.service.getTrendMetrics(id, period);
    return res.json({
      success: true,
      data: metrics,
      meta: { requestId: res.locals.requestId },
    });
  };

  public getTrendAudience = async (req: Request, res: Response) => {
    const { id } = req.params;
    const audience = await this.service.getTrendAudience(id);
    return res.json({
      success: true,
      data: audience,
      meta: { requestId: res.locals.requestId },
    });
  };

  public getTrendGeography = async (req: Request, res: Response) => {
    const { id } = req.params;
    const geography = await this.service.getTrendGeography(id);
    return res.json({
      success: true,
      data: geography,
      meta: { requestId: res.locals.requestId },
    });
  };

  public getSources = async (req: Request, res: Response) => {
    const sources = await this.service.getSources();
    return res.json({
      success: true,
      data: sources,
      meta: { requestId: res.locals.requestId },
    });
  };

  public getSourcesStatus = async (req: Request, res: Response) => {
    const sourceManager = SourceManager.getInstance();
    const sources = await sourceManager.getAllSourcesStatus();
    return res.json({
      success: true,
      data: sources,
      meta: { count: sources.length, requestId: res.locals.requestId },
    });
  };

  public getPipelineRun = async (req: Request, res: Response) => {
    const { id } = req.params;
    const run = PipelineRepository.getInstance().getRun(id);
    if (!run) {
      return res.status(404).json({
        success: false,
        error: { code: 'RUN_NOT_FOUND', message: 'Pipeline run record not found.', requestId: res.locals.requestId },
      });
    }
    return res.json({
      success: true,
      data: run,
      meta: { requestId: res.locals.requestId },
    });
  };

  public saveTrend = async (req: Request, res: Response) => {
    const userId = req.user?.id || '11111111-1111-1111-1111-111111111111';
    const { id } = req.params;
    await this.service.saveTrend(userId, id);
    return res.json({
      success: true,
      data: { saved: true, trendId: id },
      meta: { requestId: res.locals.requestId },
    });
  };

  public unsaveTrend = async (req: Request, res: Response) => {
    const userId = req.user?.id || '11111111-1111-1111-1111-111111111111';
    const { id } = req.params;
    await this.service.unsaveTrend(userId, id);
    return res.json({
      success: true,
      data: { saved: false, trendId: id },
      meta: { requestId: res.locals.requestId },
    });
  };

  public getSavedTrends = async (req: Request, res: Response) => {
    const userId = req.user?.id || '11111111-1111-1111-1111-111111111111';
    const trends = await this.service.getSavedTrends(userId);
    return res.json({
      success: true,
      data: trends,
      meta: { requestId: res.locals.requestId },
    });
  };

  public analyzeTrend = async (req: Request, res: Response) => {
    try {
      const mode = (req.body.mode || 'demo').toLowerCase() as 'demo' | 'live';
      const businessInput = req.body.business || {};

      const city = businessInput.city || req.body.city || 'Nashik';
      const state = businessInput.state || req.body.state;
      const country = businessInput.country || req.body.country || 'India';

      const businessContext: BusinessContext = {
        businessName: businessInput.businessName || 'Local Business',
        businessType: businessInput.businessType || req.body.businessType || 'General Business',
        industry: businessInput.industry || req.body.industry,
        city,
        state,
        country,
        targetCustomers: businessInput.targetCustomers || req.body.targetCustomers,
        customerAgeRange: businessInput.customerAgeRange || req.body.customerAgeRange,
        products: businessInput.products || req.body.products,
        priceRange: businessInput.priceRange || req.body.priceRange,
        businessGoals: businessInput.businessGoals || req.body.businessGoals,
        marketingChannels: businessInput.marketingChannels || req.body.marketingChannels,
        preferredCategories: businessInput.preferredCategories || req.body.preferredCategories,
        excludedCategories: businessInput.excludedCategories || req.body.excludedCategories,
      };

      const pipelineService = PipelineService.getInstance();
      const result = await pipelineService.runPipeline({
        city,
        state,
        country,
        business: businessContext,
        mode,
      });

      return res.json({
        success: true,
        data: {
          location: {
            city: result.city,
            state: result.state,
            country: result.country,
          },
          mode: result.mode,
          dataMode: result.dataMode,
          sources: result.sources,
          notice: result.notice,
          trends: result.analyzedTrends,
          topTrend: result.topTrend,
          opportunity: result.topTrend?.opportunity,
          actionPlan: result.topTrend?.actionPlan,
          stats: result.stats,
        },
        error: null,
        meta: {
          runId: result.runId,
          requestId: res.locals.requestId,
        },
      });
    } catch (err) {
      console.error('[TrendController] Error in analyzeTrend:', err);
      return res.status(500).json({
        success: false,
        error: {
          code: 'TREND_ANALYSIS_ERROR',
          message: err instanceof Error ? err.message : 'Unknown trend analysis error',
          requestId: res.locals.requestId,
        },
      });
    }
  };
}
