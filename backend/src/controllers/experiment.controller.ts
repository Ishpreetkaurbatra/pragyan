import { Request, Response } from 'express';
import { ExperimentService } from '../services/experiment.service';

export class ExperimentController {
  private service = new ExperimentService();

  public getExperiments = async (req: Request, res: Response) => {
    const { businessId } = req.query as { businessId?: string };
    const list = await this.service.getExperiments(businessId);
    return res.json({
      success: true,
      data: list,
      meta: { count: list.length, requestId: res.locals.requestId },
    });
  };

  public getExperimentById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const exp = await this.service.getExperimentById(id);
    if (!exp) {
      return res.status(404).json({
        success: false,
        error: { code: 'EXPERIMENT_NOT_FOUND', message: 'Experiment not found.', requestId: res.locals.requestId },
      });
    }
    return res.json({
      success: true,
      data: exp,
      meta: { requestId: res.locals.requestId },
    });
  };

  public createExperiment = async (req: Request, res: Response) => {
    const body = req.body;
    const created = await this.service.createExperiment(body);
    return res.status(201).json({
      success: true,
      data: created,
      meta: { requestId: res.locals.requestId },
    });
  };

  public addMetric = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { metric_name, metric_value, metric_unit, baseline_value, target_value } = req.body;
    const metric = await this.service.addMetric({
      experiment_id: id,
      metric_name,
      metric_value: Number(metric_value),
      metric_unit,
      baseline_value: baseline_value ? Number(baseline_value) : undefined,
      target_value: target_value ? Number(target_value) : undefined,
      metric_date: new Date().toISOString().split('T')[0],
    });
    return res.status(201).json({
      success: true,
      data: metric,
      meta: { requestId: res.locals.requestId },
    });
  };

  public complete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { decision, outcome } = req.body;
    const updated = await this.service.completeExperiment(id, decision, outcome);
    return res.json({
      success: true,
      data: updated,
      meta: { requestId: res.locals.requestId },
    });
  };

  public analyze = async (req: Request, res: Response) => {
    const { id } = req.params;
    const analysis = await this.service.analyzeExperiment(id);
    return res.json(analysis);
  };
}
