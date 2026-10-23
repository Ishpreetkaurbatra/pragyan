import { TrendSignal } from '../../models/intelligence-pipeline.types';
import { TopicExtractor } from '../nlp/topic-extractor';

export interface RawCluster {
  clusterKey: string;
  clusterName: string;
  category: string;
  primaryKeywords: string[];
  signals: TrendSignal[];
}

export class TrendClusterer {
  private topicExtractor = new TopicExtractor();

  // Signature canonical cluster definitions for high-precision clustering
  private signatureClusters: Array<{
    name: string;
    category: string;
    tokens: string[];
  }> = [
    { name: 'Matcha Beverages', category: 'Food & Beverage', tokens: ['matcha', 'latte', 'ceremonial', 'frappe'] },
    { name: 'Protein Snacks', category: 'Food & Beverage', tokens: ['protein', 'snack', 'whey', 'keto', 'bars', 'cookies', 'munchies'] },
    { name: 'Cold Brew', category: 'Food & Beverage', tokens: ['cold brew', 'nitro', 'roast', 'iced coffee', 'pour over'] },
    { name: 'Functional Beverages', category: 'Food & Beverage', tokens: ['functional', 'adaptogen', 'prebiotic', 'kombucha', 'tonic', 'electrolyte'] },
    { name: 'AI Productivity Tools', category: 'Technology & AI', tokens: ['ai', 'productivity', 'copilot', 'automation', 'genai', 'workflow'] },
    { name: 'Sustainable Packaging', category: 'Sustainable Living', tokens: ['sustainable', 'packaging', 'biodegradable', 'bagasse', 'compostable', 'straws'] },
    { name: 'Personalized Gifts', category: 'Retail & E-commerce', tokens: ['personalized', 'custom', 'gift', 'hampers', 'engraved', 'bespoke'] },
    { name: 'Smart Fitness Accessories', category: 'Health & Wellness', tokens: ['smart ring', 'fitness', 'wearable', 'posture', 'biometric', 'sensor'] },
  ];

  /**
   * Clusters a stream of unique normalized signals into coherent trend clusters.
   */
  public clusterSignals(signals: TrendSignal[]): RawCluster[] {
    const clusterMap = new Map<string, RawCluster>();

    for (const signal of signals) {
      // 1. Check if signal metadata specifies a cluster concept (e.g. from demo/synthetic dataset)
      const explicitCluster = signal.sourceMetadata?.clusterConcept as string | undefined;

      let matchedClusterName = explicitCluster;
      let matchedCategory = signal.category || 'General';

      const combinedText = `${signal.title} ${signal.text || ''}`.toLowerCase();

      // 2. Match against signature concept definitions
      if (!matchedClusterName) {
        for (const sig of this.signatureClusters) {
          const matchCount = sig.tokens.filter(tok => combinedText.includes(tok)).length;
          if (matchCount > 0) {
            matchedClusterName = sig.name;
            matchedCategory = sig.category;
            break;
          }
        }
      }

      // 3. Fallback: Lexical topic extraction
      if (!matchedClusterName) {
        const topics = this.topicExtractor.extract(combinedText);
        matchedClusterName = topics.phrases[0]
          ? topics.phrases[0].replace(/\b\w/g, l => l.toUpperCase())
          : (topics.keywords[0] ? `${topics.keywords[0].toUpperCase()} Trend` : 'Emerging Market Signal');
        matchedCategory = topics.detectedCategory;
      }

      const clusterKey = matchedClusterName.toLowerCase().replace(/[^a-z0-9]/g, '-');

      if (!clusterMap.has(clusterKey)) {
        clusterMap.set(clusterKey, {
          clusterKey,
          clusterName: matchedClusterName,
          category: matchedCategory,
          primaryKeywords: signal.keywords || [],
          signals: [],
        });
      }

      const cluster = clusterMap.get(clusterKey)!;
      cluster.signals.push(signal);
      
      // Update keywords union
      const existingKeySet = new Set(cluster.primaryKeywords);
      for (const kw of signal.keywords || []) {
        if (!existingKeySet.has(kw) && cluster.primaryKeywords.length < 15) {
          cluster.primaryKeywords.push(kw);
        }
      }
    }

    return Array.from(clusterMap.values());
  }
}
