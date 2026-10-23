import { z } from 'zod';

export const GeminiAnalysisSchema = z.object({
  trendName: z.string().min(1, 'trendName is required'),
  trendSummary: z.string().min(1, 'trendSummary is required'),
  trendStage: z.string().min(1, 'trendStage is required'),
  confidence: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  whyItMatters: z.string().min(1, 'whyItMatters is required'),
  evidenceSummary: z.string().min(1, 'evidenceSummary is required'),
  likelyDrivers: z.array(z.string()).default([]),
  businessFitExplanation: z.string().min(1, 'businessFitExplanation is required'),
  opportunity: z.string().min(1, 'opportunity is required'),
  targetCustomer: z.string().min(1, 'targetCustomer is required'),
  productIdeas: z.array(z.string()).default([]),
  marketingIdeas: z.array(z.string()).default([]),
  actionPlan: z.array(z.string()).default([]),
  timeline: z.string().default('14 days'),
  successMetrics: z.array(z.string()).default([]),
  risks: z.array(z.string()).default([]),
  assumptions: z.array(z.string()).default([]),
  expertValidationRequired: z.boolean().default(true),
});

export type GeminiAnalysisOutput = z.infer<typeof GeminiAnalysisSchema>;
