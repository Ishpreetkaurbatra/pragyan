import { TrendSignal } from '../../models/intelligence-pipeline.types';

export class SignalNormalizer {
  /**
   * Cleans and normalizes valid signals to ensure standard schema and provenance.
   */
  public normalize(signals: TrendSignal[]): TrendSignal[] {
    return signals.map(sig => {
      // 1. Text cleaning
      const cleanTitle = this.cleanText(sig.title);
      const cleanBody = sig.text ? this.cleanText(sig.text) : undefined;

      // 2. Canonical URL cleaning
      const canonicalUrl = sig.url ? this.cleanUrl(sig.url) : undefined;

      // 3. Location normalization
      const location = sig.location ? {
        city: sig.location.city?.trim(),
        state: sig.location.state?.trim(),
        country: sig.location.country?.trim() || 'India',
      } : undefined;

      // 4. Keyword normalization
      const combinedText = `${cleanTitle} ${cleanBody || ''}`;
      const extractedKeywords = Array.from(new Set([
        ...(sig.keywords || []).map(k => k.toLowerCase().trim()),
        ...this.extractBasicKeywords(combinedText),
      ])).filter(k => k.length > 2);

      // 5. Engagement metrics normalization
      const engagement = sig.engagementMetrics || {};
      const views = Math.max(0, engagement.views || 0);
      const likes = Math.max(0, engagement.likes || 0);
      const comments = Math.max(0, engagement.comments || 0);
      const shares = Math.max(0, engagement.shares || 0);

      // Composite normalized engagement score
      const score = engagement.score !== undefined
        ? engagement.score
        : Math.round(likes * 1.5 + comments * 3.0 + shares * 4.0 + Math.log10(views + 1) * 5);

      return {
        ...sig,
        title: cleanTitle,
        text: cleanBody,
        url: canonicalUrl,
        location,
        keywords: extractedKeywords,
        engagementMetrics: {
          views,
          likes,
          comments,
          shares,
          score,
        },
        timestamp: new Date(sig.timestamp).toISOString(),
        collectedAt: sig.collectedAt || new Date().toISOString(),
        status: 'VALID',
      };
    });
  }

  private cleanText(text: string): string {
    return text
      .replace(/<[^>]+>/g, '') // strip HTML tags
      .replace(/[\r\n\t]+/g, ' ') // collapse newlines & tabs
      .replace(/\s{2,}/g, ' ') // collapse multiple spaces
      .trim();
  }

  private cleanUrl(rawUrl: string): string {
    try {
      const url = new URL(rawUrl);
      // Strip common tracking query params
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'ref'].forEach(p => {
        url.searchParams.delete(p);
      });
      return url.toString();
    } catch {
      return rawUrl.trim();
    }
  }

  private extractBasicKeywords(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3 && !['this', 'that', 'with', 'from', 'have', 'were', 'what', 'best', 'more'].includes(w))
      .slice(0, 8);
  }
}
