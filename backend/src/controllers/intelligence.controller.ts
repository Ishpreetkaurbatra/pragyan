import { Request, Response } from 'express';
import { IntelligenceService } from '../intelligence/intelligence.service';

export class IntelligenceController {
  private service = IntelligenceService.getInstance();

  public analyze = async (req: Request, res: Response) => {
    const { businessContext, trendContext } = req.body;
    const result = await this.service.analyzeTrend({ businessContext, trendContext });
    return res.json(result);
  };

  public match = async (req: Request, res: Response) => {
    const { businessContext, trendContext, pastExperiments } = req.body;
    const result = await this.service.matchBusiness({ businessContext, trendContext, pastExperiments });
    return res.json(result);
  };

  public opportunity = async (req: Request, res: Response) => {
    const { businessContext, trendContext, businessMatch, pastExperiments } = req.body;
    const result = await this.service.generateOpportunity({ businessContext, trendContext, businessMatch, pastExperiments });
    return res.json(result);
  };

  public actionPlan = async (req: Request, res: Response) => {
    const { businessContext, trendContext, opportunityTitle, opportunityDescription } = req.body;
    const result = await this.service.generateActionPlan({ businessContext, trendContext, opportunityTitle, opportunityDescription });
    return res.json(result);
  };

  public experiment = async (req: Request, res: Response) => {
    const { experimentName, hypothesis, baseline, recordedMetrics, durationDays } = req.body;
    const result = await this.service.analyzeExperiment({ experimentName, hypothesis, baseline, recordedMetrics, durationDays: durationDays || 7 });
    return res.json(result);
  };

  public getMode = async (req: Request, res: Response) => {
    return res.json({
      success: true,
      data: {
        mode: this.service.getMode(),
      },
      meta: { requestId: res.locals.requestId },
    });
  };

  public setMode = async (req: Request, res: Response) => {
    const { mode } = req.body;
    if (mode) {
      this.service.setMode(mode);
    }
    return res.json({
      success: true,
      data: {
        mode: this.service.getMode(),
      },
      meta: { requestId: res.locals.requestId },
    });
  };
}
