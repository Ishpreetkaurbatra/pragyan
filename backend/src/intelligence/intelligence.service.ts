import {
  IntelligenceProvider,
  IntelligenceResponseContract,
  TrendAnalysisInput,
  TrendAnalysisOutput,
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
import { LocalOpenModelProvider } from './local-model.provider';
import { TGoModelProvider } from './tgo.provider';
import { config } from '../config/env';

export class IntelligenceService {
  private static instance: IntelligenceService;
  private provider: IntelligenceProvider;
  private fallbackProvider = new MockIntelligenceProvider();

  private constructor() {
    this.provider = this.resolveProvider(config.intelligenceMode);
  }

  public static getInstance(): IntelligenceService {
    if (!IntelligenceService.instance) {
      IntelligenceService.instance = new IntelligenceService();
    }
    return IntelligenceService.instance;
  }

  public setMode(mode: string): void {
    this.provider = this.resolveProvider(mode);
  }

  public getMode(): string {
    return this.provider.name;
  }

  private resolveProvider(mode: string): IntelligenceProvider {
    switch (mode) {
      case 'local':
        return new LocalOpenModelProvider();
      case 'tgo':
        return new TGoModelProvider();
      case 'mock':
      default:
        return new MockIntelligenceProvider();
    }
  }

  private wrapResponse<T>(data: T, latencyMs: number, fallbackUsed: boolean = false): IntelligenceResponseContract<T> {
    const isMock = fallbackUsed || this.provider.name === 'mock';
    return {
      success: true,
      intelligenceVersion: 'tgo-v1',
      provider: isMock ? 'mock' : (this.provider.name as any),
      model: isMock ? 'deterministic-rule-engine' : (config.aiModel || 'tgo-growth-8b'),
      modelVersion: isMock ? 'rules-v1.2' : (config.aiVersion || 'tgo-v1'),
      generatedAt: new Date().toISOString(),
      data,
      meta: {
        latencyMs,
        fallbackUsed,
      },
    };
  }

  public async analyzeTrend(input: TrendAnalysisInput): Promise<IntelligenceResponseContract<TrendAnalysisOutput>> {
    const start = Date.now();
    try {
      const data = await this.provider.analyzeTrend(input);
      return this.wrapResponse(data, Date.now() - start);
    } catch (err) {
      const data = await this.fallbackProvider.analyzeTrend(input);
      return this.wrapResponse(data, Date.now() - start, true);
    }
  }

  public async matchBusiness(input: BusinessMatchInput): Promise<IntelligenceResponseContract<BusinessMatchOutput>> {
    const start = Date.now();
    try {
      const data = await this.provider.matchBusiness(input);
      return this.wrapResponse(data, Date.now() - start);
    } catch (err) {
      const data = await this.fallbackProvider.matchBusiness(input);
      return this.wrapResponse(data, Date.now() - start, true);
    }
  }

  public async generateOpportunity(input: OpportunityInput): Promise<IntelligenceResponseContract<OpportunityOutput>> {
    const start = Date.now();
    try {
      const data = await this.provider.generateOpportunity(input);
      return this.wrapResponse(data, Date.now() - start);
    } catch (err) {
      const data = await this.fallbackProvider.generateOpportunity(input);
      return this.wrapResponse(data, Date.now() - start, true);
    }
  }

  public async generateActionPlan(input: ActionPlanInput): Promise<IntelligenceResponseContract<ActionPlanOutput>> {
    const start = Date.now();
    try {
      const data = await this.provider.generateActionPlan(input);
      return this.wrapResponse(data, Date.now() - start);
    } catch (err) {
      const data = await this.fallbackProvider.generateActionPlan(input);
      return this.wrapResponse(data, Date.now() - start, true);
    }
  }

  public async analyzeExperiment(input: ExperimentAnalysisInput): Promise<IntelligenceResponseContract<ExperimentAnalysisOutput>> {
    const start = Date.now();
    try {
      const data = await this.provider.analyzeExperiment(input);
      return this.wrapResponse(data, Date.now() - start);
    } catch (err) {
      const data = await this.fallbackProvider.analyzeExperiment(input);
      return this.wrapResponse(data, Date.now() - start, true);
    }
  }

  public async answerBusinessQuestion(input: AskTGoInput): Promise<IntelligenceResponseContract<AskTGoOutput>> {
    const start = Date.now();
    try {
      const data = await this.provider.answerBusinessQuestion(input);
      return this.wrapResponse(data, Date.now() - start);
    } catch (err) {
      const data = await this.fallbackProvider.answerBusinessQuestion(input);
      return this.wrapResponse(data, Date.now() - start, true);
    }
  }
}
