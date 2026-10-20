import { getRepository } from '../repositories';
import { IntelligenceService } from '../intelligence/intelligence.service';
import { Experiment, ExperimentMetric } from '../models/types';

export class ExperimentService {
  private repo = getRepository();
  private intelligenceService = IntelligenceService.getInstance();

  public async getExperiments(businessId?: string) {
    const list = await this.repo.getExperiments(businessId);
    return await Promise.all(
      list.map(async (exp) => {
        const metrics = await this.repo.getExperimentMetrics(exp.id);
        const plan = exp.action_plan_id ? await this.repo.getActionPlanById(exp.action_plan_id) : null;
        return {
          ...exp,
          metrics,
          actionPlan: plan,
        };
      })
    );
  }

  public async getExperimentById(id: string) {
    const exp = await this.repo.getExperimentById(id);
    if (!exp) return null;
    const metrics = await this.repo.getExperimentMetrics(id);
    const plan = exp.action_plan_id ? await this.repo.getActionPlanById(exp.action_plan_id) : null;
    return {
      ...exp,
      metrics,
      actionPlan: plan,
    };
  }

  public async createExperiment(data: Partial<Experiment>) {
    const created = await this.repo.createExperiment(data);
    if (data.action_plan_id) {
      await this.repo.updateActionPlan(data.action_plan_id, { status: 'in_experiment' });
    }
    return created;
  }

  public async addMetric(data: Partial<ExperimentMetric>) {
    return await this.repo.addExperimentMetric(data);
  }

  public async completeExperiment(id: string, decision: string, outcomeDetails?: any) {
    const exp = await this.repo.getExperimentById(id);
    if (!exp) throw new Error('Experiment not found');

    const updated = await this.repo.updateExperiment(id, {
      status: 'completed',
      decision,
    });

    // Record in Learning Records (Section 21 & 41)
    await this.repo.createLearningRecord({
      business_id: exp.business_id,
      experiment_id: exp.id,
      outcome: outcomeDetails || { decision, completed_at: new Date().toISOString() },
      impact: decision === 'SCALE' ? 95 : 75,
      learning_type: 'experiment_outcome',
    });

    return updated;
  }

  public async analyzeExperiment(id: string) {
    const exp = await this.repo.getExperimentById(id);
    if (!exp) throw new Error('Experiment not found');
    const metrics = await this.repo.getExperimentMetrics(id);

    const intResponse = await this.intelligenceService.analyzeExperiment({
      experimentName: exp.name,
      hypothesis: exp.hypothesis,
      baseline: exp.baseline,
      recordedMetrics: metrics.map(m => ({ name: m.metric_name, value: m.metric_value, unit: m.metric_unit })),
      durationDays: 7,
    });

    return intResponse;
  }
}
