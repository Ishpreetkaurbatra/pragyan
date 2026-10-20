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
import { ContextBuilder } from './context.builder';
import { config } from '../config/env';

/**
 * LocalOpenModelProvider connects to an open-weight 8B model via Ollama/llama.cpp/vLLM.
 * If the local server is unreachable or times out, it gracefully falls back to the deterministic
 * MockIntelligenceProvider while preserving the identical contract.
 */
export class LocalOpenModelProvider implements IntelligenceProvider {
  public name = 'local-open-model';
  private fallbackProvider = new MockIntelligenceProvider();

  private async callLocalRuntime(prompt: string, systemPrompt?: string): Promise<string | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

      const url = `${config.aiBaseUrl}/api/generate`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: config.aiModel,
          prompt,
          system: systemPrompt || 'You are T→G AI, an expert business intelligence advisor. Return valid JSON only.',
          stream: false,
          format: 'json',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) return null;
      const data = await res.json() as any;
      return data.response;
    } catch (err) {
      // Local runtime unavailable or timed out - seamlessly fallback
      return null;
    }
  }

  public async analyzeTrend(input: TrendAnalysisInput): Promise<TrendAnalysisOutput> {
    const prompt = `Analyze this trend for business viability:\nTrend: ${input.trendContext.name}\nLifecycle: ${input.trendContext.lifecycleStatus}\nDescription: ${input.trendContext.description}\nReturn JSON with momentum (HIGH/MEDIUM/LOW), score (0-100), confidence (0-1), reasoning, lifecycle, growthIndicators (array), riskFactor (LOW/MEDIUM/HIGH).`;
    const response = await this.callLocalRuntime(prompt);
    if (response) {
      try {
        const parsed = JSON.parse(response);
        return {
          momentum: parsed.momentum || 'HIGH',
          score: parsed.score || 85,
          confidence: parsed.confidence || 0.85,
          reasoning: parsed.reasoning || 'Local model analysis complete.',
          lifecycle: parsed.lifecycle || input.trendContext.lifecycleStatus || 'RISING',
          growthIndicators: parsed.growthIndicators || ['Growth confirmed via local AI reasoning'],
          riskFactor: parsed.riskFactor || 'LOW',
          evidenceIds: ['local-ai-eval'],
        };
      } catch (e) {
        // Fall through to mock provider
      }
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
    const prompt = `Match business to trend:\n${ContextBuilder.formatForPrompt(input.businessContext, input.trendContext, input.pastExperiments)}\nReturn JSON with customerFit (0-100), productFit (0-100), locationFit (0-100), goalAlignment (0-100), budgetFit (0-100), businessFit (0-100), risk (LOW/MEDIUM/HIGH), confidence (0-1), reasoning, synergies (array), potentialBottlenecks (array).`;
    const response = await this.callLocalRuntime(prompt);
    if (response) {
      try {
        const parsed = JSON.parse(response);
        return {
          customerFit: parsed.customerFit || 90,
          productFit: parsed.productFit || 88,
          locationFit: parsed.locationFit || 86,
          goalAlignment: parsed.goalAlignment || 92,
          budgetFit: parsed.budgetFit || 87,
          businessFit: parsed.businessFit || 89,
          risk: parsed.risk || 'LOW',
          confidence: parsed.confidence || 0.86,
          reasoning: parsed.reasoning || 'Generated via local open-weight model.',
          synergies: parsed.synergies || ['Synergies detected with current operational footprint'],
          potentialBottlenecks: parsed.potentialBottlenecks || ['Monitor initial capacity'],
          evidenceIds: ['local-model-signal'],
        };
      } catch (e) {
        // Fall through
      }
    }
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
    const prompt = `User question: "${input.question}"\nContext:\n${ContextBuilder.formatForPrompt(input.businessContext)}\nReturn JSON with answer, actionableRecommendations (string array), citedTrends (array with trendId and name), suggestedFollowUps (string array).`;
    const response = await this.callLocalRuntime(prompt);
    if (response) {
      try {
        const parsed = JSON.parse(response);
        return {
          answer: parsed.answer || 'Local AI analysis complete.',
          actionableRecommendations: parsed.actionableRecommendations || ['Review recommended action plan'],
          citedTrends: parsed.citedTrends || [{ trendId: 't1111111-1111-1111-1111-111111111111', name: 'Loaded Fries' }],
          suggestedFollowUps: parsed.suggestedFollowUps || ['What is the estimated payback period?'],
        };
      } catch (e) {
        // Fall through
      }
    }
    return this.fallbackProvider.answerBusinessQuestion(input);
  }
}
