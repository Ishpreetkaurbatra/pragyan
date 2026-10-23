import { TrendSignal } from '../../models/intelligence-pipeline.types';

export interface ValidationResult {
  valid: TrendSignal[];
  rejected: TrendSignal[];
}

export class SignalValidator {
  private allowedSources = new Set(['demo', 'youtube', 'reddit', 'news_rss', 'google_trends']);
  private maxAgeMs = 365 * 24 * 60 * 60 * 1000; // 1 year

  /**
   * Validates raw signals according to deterministic business rules.
   * Records failing validation are marked REJECTED with rejectionReason.
   */
  public validate(signals: TrendSignal[]): ValidationResult {
    const valid: TrendSignal[] = [];
    const rejected: TrendSignal[] = [];
    const now = Date.now();

    for (const sig of signals) {
      const reasons: string[] = [];

      // 1. Required identifier & source fields
      if (!sig.sourceRecordId || sig.sourceRecordId.trim().length === 0) {
        reasons.push('Missing sourceRecordId');
      }

      if (!sig.source || !this.allowedSources.has(sig.source.toLowerCase())) {
        reasons.push(`Invalid or unsupported source: "${sig.source}"`);
      }

      // 2. Title validation
      if (!sig.title || sig.title.trim().length < 3) {
        reasons.push('Title is missing or shorter than 3 characters');
      }

      // 3. Timestamp validation & range checks
      if (!sig.timestamp) {
        reasons.push('Missing timestamp');
      } else {
        const timeMs = new Date(sig.timestamp).getTime();
        if (isNaN(timeMs)) {
          reasons.push('Invalid timestamp format');
        } else if (timeMs > now + 3600000) { // allow 1hr future clock skew
          reasons.push('Timestamp cannot be in the future');
        } else if (now - timeMs > this.maxAgeMs) {
          reasons.push('Signal timestamp exceeds maximum age of 1 year');
        }
      }

      // 4. Numeric metric consistency
      if (sig.engagementMetrics) {
        const { views, likes, comments, shares, score } = sig.engagementMetrics;
        if (views !== undefined && (isNaN(views) || views < 0)) reasons.push('Negative or NaN views');
        if (likes !== undefined && (isNaN(likes) || likes < 0)) reasons.push('Negative or NaN likes');
        if (comments !== undefined && (isNaN(comments) || comments < 0)) reasons.push('Negative or NaN comments');
        if (shares !== undefined && (isNaN(shares) || shares < 0)) reasons.push('Negative or NaN shares');
        if (score !== undefined && isNaN(score)) reasons.push('NaN engagement score');
      }

      if (reasons.length > 0) {
        rejected.push({
          ...sig,
          status: 'REJECTED',
          rejectionReason: reasons.join('; '),
        });
      } else {
        valid.push({
          ...sig,
          status: 'VALID',
        });
      }
    }

    return { valid, rejected };
  }
}
