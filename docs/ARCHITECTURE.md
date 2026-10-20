# T→G (Trend to Growth) Architecture

## Overview
T→G connects:
**Real-World Signals → Trend Intelligence → Business Context → Opportunity → Action Plan → Human Validation → Experiment → Measured Growth**

```
                    REAL-WORLD SOURCES (Search, Social, Delivery, RSS)
                                      ↓
                               DATA CONNECTORS
                                      ↓
                               INGESTION LAYER
                                      ↓
                            VALIDATE / NORMALIZE
                                      ↓
                            HYBRID DEDUPLICATION
                                      ↓
                              SIGNAL EXTRACTION
                                      ↓
                           TREND DETECTION ENGINE
                                      ↓
                           TRENDS ML SCORING MODEL
                                      ↓
                              TREND LIFECYCLE
                                      ↓
                              KNOWLEDGE STORE
                                      ↓
                      ┌───────────────┴───────────────┐
                      │                               │
                KEYWORD SEARCH                  VECTOR SEARCH
                      │                               │
                      └───────────────┬───────────────┘
                                      ↓
                                 RANK FUSION
                                      ↓
                                  RERANKER
                                      ↓
                               CONTEXT BUILDER
                                      ↓
                       INTELLIGENCE PROVIDER INTERFACE
                        ├── MockIntelligenceProvider (Default, Zero API Keys)
                        ├── LocalOpenModelProvider (Ollama 8B)
                        └── TGoModelProvider (Custom Dedicated Model)
                                      ↓
                           BUSINESS MATCHING ENGINE
                                      ↓
                              OPPORTUNITY ENGINE
                                      ↓
                              ACTION PLAN ENGINE
                                      ↓
                           RISK / CONFIDENCE GATE
                                      ↓
                           HUMAN EXPERT VALIDATION
                                      ↓
                              EXPERIMENT ENGINE
                                      ↓
                              RESULT ANALYSIS
                                      ↓
                              LEARNING MEMORY
```

## Replaceable Intelligence Layer
The frontend and business logic never communicate with a proprietary AI SDK or hardcoded model.
They communicate with the internal `IntelligenceProvider` interface:

```typescript
interface IntelligenceProvider {
  analyzeTrend(input: TrendAnalysisInput): Promise<TrendAnalysisOutput>;
  classifyTrend(input: ClassificationInput): Promise<ClassificationOutput>;
  summarizeSignals(input: SignalSummaryInput): Promise<SignalSummaryOutput>;
  matchBusiness(input: BusinessMatchInput): Promise<BusinessMatchOutput>;
  generateOpportunity(input: OpportunityInput): Promise<OpportunityOutput>;
  generateActionPlan(input: ActionPlanInput): Promise<ActionPlanOutput>;
  analyzeExperiment(input: ExperimentAnalysisInput): Promise<ExperimentAnalysisOutput>;
  answerBusinessQuestion(input: AskTGoInput): Promise<AskTGoOutput>;
}
```

This guarantees 100% portability and ensures the entire application runs in mock/demo mode without paid APIs or external dependencies.
