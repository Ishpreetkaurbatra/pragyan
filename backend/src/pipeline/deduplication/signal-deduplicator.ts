import { TrendSignal } from '../../models/intelligence-pipeline.types';

export interface DeduplicationResult {
  unique: TrendSignal[];
  duplicates: TrendSignal[];
}

export class SignalDeduplicator {
  private titleSimilarityThreshold = 0.80; // 80% lexical token overlap indicates duplicate syndicated story

  /**
   * Deterministically deduplicates signals both within sources and across syndicated sources.
   */
  public deduplicate(signals: TrendSignal[]): DeduplicationResult {
    const unique: TrendSignal[] = [];
    const duplicates: TrendSignal[] = [];

    const seenSourceRecordIds = new Set<string>();
    const seenUrls = new Set<string>();
    const seenTitleHashes = new Set<string>();

    for (const sig of signals) {
      let isDup = false;
      let primarySignalId: string | undefined;

      // 1. Exact Source & Record ID match
      const sourceKey = `${sig.source}::${sig.sourceRecordId}`;
      if (seenSourceRecordIds.has(sourceKey)) {
        isDup = true;
        const match = unique.find(u => `${u.source}::${u.sourceRecordId}` === sourceKey);
        primarySignalId = match?.id;
      }

      // 2. Canonical URL exact match
      if (!isDup && sig.url && sig.url.length > 0) {
        if (seenUrls.has(sig.url)) {
          isDup = true;
          const match = unique.find(u => u.url === sig.url);
          primarySignalId = match?.id;
        }
      }

      const sigTime = new Date(sig.timestamp).getTime();

      // 3. Exact normalized title hash within the same 3-day window
      const titleHash = this.computeTitleHash(sig.title);
      if (!isDup) {
        const match = unique.find(u => {
          if (this.computeTitleHash(u.title) !== titleHash) return false;
          const uTime = new Date(u.timestamp).getTime();
          return Math.abs(sigTime - uTime) < 3 * 86400000;
        });
        if (match) {
          isDup = true;
          primarySignalId = match.id;
        }
      }

      // 4. Cross-source syndicated story similarity within the same 3-day window
      if (!isDup) {
        const sigTokens = this.tokenize(sig.title);
        for (const u of unique) {
          const uTime = new Date(u.timestamp).getTime();
          if (Math.abs(sigTime - uTime) >= 3 * 86400000) continue;

          const uTokens = this.tokenize(u.title);
          const sim = this.calculateJaccardSimilarity(sigTokens, uTokens);
          if (sim >= this.titleSimilarityThreshold) {
            isDup = true;
            primarySignalId = u.id;
            break;
          }
        }
      }

      if (isDup) {
        duplicates.push({
          ...sig,
          status: 'DUPLICATE',
          duplicateOf: primarySignalId,
        });
      } else {
        seenSourceRecordIds.add(sourceKey);
        if (sig.url) seenUrls.add(sig.url);
        seenTitleHashes.add(titleHash);
        unique.push(sig);
      }
    }

    return { unique, duplicates };
  }

  private computeTitleHash(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  private tokenize(text: string): Set<string> {
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);
    return new Set(words);
  }

  private calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
    if (setA.size === 0 || setB.size === 0) return 0;
    let intersection = 0;
    for (const item of setA) {
      if (setB.has(item)) intersection++;
    }
    const union = setA.size + setB.size - intersection;
    return union > 0 ? intersection / union : 0;
  }
}
