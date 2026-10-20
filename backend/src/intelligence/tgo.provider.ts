import {
  IntelligenceProvider,
  TrendAnalysisInput,
  TrendAnalysisOutput,
  ClassificationInput,
  ClassificationOutput,
  SignalSummaryInput,
  SignalSummaryOutput,
  BusinessMatchInput,
  BusinessMatchOutput,
  OpportunityInput,
  OpportunityOutput,
  ActionPlanInput,
  ActionPlanOutput,
  ExperimentAnalysisInput,
  ExperimentAnalysisOutput,
  AskTGoInput,
  AskTGoOutput,
} from './intelligence.interface';
import { MockIntelligenceProvider } from './mock.provider';
import { config } from '../config/env';

/**
 * TGoModelProvider connects to the future dedicated T→G AI Model API endpoint.
 * When TGO_AI_BASE_URL is configured, it sends standardized payloads.
 * If unconfigured or offline, it gracefully falls back to the deterministic provider.
 */
export class TGoModelProvider implements IntelligenceProvider {
  public name = 'tgo';
  private fallbackProvider = new MockIntelligenceProvider();

  public async analyzeTrend(input: TrendAnalysisInput): Promise<TrendAnalysisOutput> {
    if (!config.tgoAiBaseUrl) {
      return this.fallbackProvider.analyzeTrend(input);
    }
    // Remote T→G call implementation
    try {
      const res = await fetch(`${config.tgoAiBaseUrl}/v1/analyze-trend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.tgoAiApiKey}`,
        },
        body: JSON.stringify(input),
      });
      if (res.ok) return await res.json() as TrendAnalysisOutput;
    } catch (err) {
      // Fallback
    }
    return this.fallbackProvider.analyzeTrend(input);
  }

  public async classifyTrend(input: ClassificationInput): Promise<ClassificationOutput> {
    return this.fallbackProvider.classifyTrend(input);
  }

  public async summarizeSignals(input: SignalSummaryInput): Promise<SignalSummaryOutput> {
    return this.fallbackProvider.summarizeSignals(input);
  }

  public async matchBusiness(input: BusinessMatchInput): Promise<BusinessMatchOutput> {
    if (!config.tgoAiBaseUrl) {
      return this.fallbackProvider.matchBusiness(input);
    }
    try {
      const res = await fetch(`${config.tgoAiBaseUrl}/v1/match-business`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.tgoAiApiKey}`,
        },
        body: JSON.stringify(input),
      });
      if (res.ok) return await res.json() as BusinessMatchOutput;
    } catch (e) {}
    return this.fallbackProvider.matchBusiness(input);
  }

  public async generateOpportunity(input: OpportunityInput): Promise<OpportunityOutput> {
    return this.fallbackProvider.generateOpportunity(input);
  }

  public async generateActionPlan(input: ActionPlanInput): Promise<ActionPlanOutput> {
    return this.fallbackProvider.generateActionPlan(input);
  }

  public async analyzeExperiment(input: ExperimentAnalysisInput): Promise<ExperimentAnalysisOutput> {
    return this.fallbackProvider.analyzeExperiment(input);
  }

  public async answerBusinessQuestion(input: AskTGoInput): Promise<AskTGoOutput> {
    if (!config.tgoAiBaseUrl) {
      return this.fallbackProvider.answerBusinessQuestion(input);
    }
    try {
      const res = await fetch(`${config.tgoAiBaseUrl}/v1/ask-tg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.tgoAiApiKey}`,
        },
        body: JSON.stringify(input),
      });
      if (res.ok) return await res.json() as AskTGoOutput;
    } catch (e) {}
    return this.fallbackProvider.answerBusinessQuestion(input);
  }
}
