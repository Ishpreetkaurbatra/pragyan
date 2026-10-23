export interface ExtractedTopics {
  keywords: string[];
  phrases: string[];
  detectedCategory: string;
}

export class TopicExtractor {
  private stopwords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
    'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will',
    'with', 'the', 'this', 'but', 'they', 'have', 'had', 'what', 'when', 'where', 'who',
    'which', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other',
    'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
    'very', 'can', 'just', 'should', 'now', 'into', 'over', 'trending', 'review', 'best',
  ]);

  private categoryDictionary: Record<string, string[]> = {
    'Food & Beverage': [
      'matcha', 'latte', 'cold brew', 'coffee', 'protein', 'snack', 'drink', 'beverage',
      'cafe', 'tea', 'frappe', 'bakery', 'shake', 'smoothie', 'boba', 'artisan', 'fermented',
      'kombucha', 'toast', 'sweet', 'food', 'snacking', 'energy', 'munchies', 'cookies',
    ],
    'Health & Wellness': [
      'fitness', 'gym', 'workout', 'smart ring', 'posture', 'health', 'wellness', 'biometric',
      'tracker', 'wearable', 'nutrition', 'electrolyte', 'supplement', 'recovery',
    ],
    'Sustainable Living': [
      'packaging', 'sustainable', 'biodegradable', 'eco-friendly', 'compostable', 'bagasse',
      'straws', 'zero plastic', 'recycle', 'green', 'kraft paper',
    ],
    'Technology & AI': [
      'ai', 'genai', 'copilot', 'automation', 'productivity', 'software', 'agent', 'cloud',
      'coding', 'tools', 'workflow', 'bot', 'tech',
    ],
    'Retail & E-commerce': [
      'gift', 'personalized', 'hamper', 'keepsake', 'bespoke', 'stationery', 'leatherette',
      'merchandise', 'shopping', 'retail', 'custom',
    ],
  };

  /**
   * Extracts clean keywords, bigram phrases, and primary category deterministically.
   */
  public extract(text: string): ExtractedTopics {
    // 1. Normalization
    const normalized = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const rawTokens = normalized.split(' ').filter(t => t.length > 2);
    const filteredTokens = rawTokens.filter(t => !this.stopwords.has(t));

    // 2. Keyword frequency
    const freqMap = new Map<string, number>();
    for (const token of filteredTokens) {
      freqMap.set(token, (freqMap.get(token) || 0) + 1);
    }

    const keywords = Array.from(freqMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([k]) => k);

    // 3. Bi-gram phrase extraction
    const phrases: string[] = [];
    for (let i = 0; i < filteredTokens.length - 1; i++) {
      const phrase = `${filteredTokens[i]} ${filteredTokens[i + 1]}`;
      phrases.push(phrase);
    }

    // 4. Category detection
    let detectedCategory = 'General';
    let maxMatch = 0;

    for (const [category, dictWords] of Object.entries(this.categoryDictionary)) {
      let matches = 0;
      for (const word of dictWords) {
        if (normalized.includes(word)) {
          matches++;
        }
      }
      if (matches > maxMatch) {
        maxMatch = matches;
        detectedCategory = category;
      }
    }

    return {
      keywords,
      phrases: phrases.slice(0, 5),
      detectedCategory,
    };
  }
}
