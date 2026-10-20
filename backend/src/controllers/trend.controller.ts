import { Request, Response } from 'express';
import { TrendService } from '../services/trend.service';

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
}
