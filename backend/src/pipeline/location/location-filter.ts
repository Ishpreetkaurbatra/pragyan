import { TrendSignal } from '../../models/intelligence-pipeline.types';

export interface LocationFilterConfig {
  cityMatchScore?: number;
  stateMatchScore?: number;
  countryMatchScore?: number;
  globalScore?: number;
}

export interface LocatedSignal {
  signal: TrendSignal;
  locationRelevance: number;
  matchType: 'CITY_MATCH' | 'STATE_MATCH' | 'COUNTRY_MATCH' | 'GLOBAL';
}

export class LocationFilter {
  private cityScore: number;
  private stateScore: number;
  private countryScore: number;
  private globalScore: number;

  constructor(cfg?: LocationFilterConfig) {
    this.cityScore = cfg?.cityMatchScore ?? 100;
    this.stateScore = cfg?.stateMatchScore ?? 80;
    this.countryScore = cfg?.countryMatchScore ?? 60;
    this.globalScore = cfg?.globalScore ?? 30;
  }

  /**
   * Evaluates location relevance score for a signal against target targetLocation.
   */
  public evaluateRelevance(
    signal: TrendSignal,
    targetCity: string,
    targetState?: string,
    targetCountry: string = 'India'
  ): { score: number; matchType: 'CITY_MATCH' | 'STATE_MATCH' | 'COUNTRY_MATCH' | 'GLOBAL' } {
    const sigCity = signal.location?.city?.toLowerCase()?.trim();
    const sigState = signal.location?.state?.toLowerCase()?.trim();
    const sigCountry = signal.location?.country?.toLowerCase()?.trim();

    const normalizedTargetCity = targetCity.toLowerCase().trim();
    const normalizedTargetState = targetState?.toLowerCase()?.trim();
    const normalizedTargetCountry = targetCountry.toLowerCase().trim();

    // Check if city appears explicitly in location field OR within title/keywords
    const matchesCityField = sigCity === normalizedTargetCity;
    const mentionsCityInText = signal.title.toLowerCase().includes(normalizedTargetCity) ||
      signal.keywords.some(k => k.toLowerCase() === normalizedTargetCity);

    if (matchesCityField || mentionsCityInText) {
      return { score: this.cityScore, matchType: 'CITY_MATCH' };
    }

    // State match
    if (normalizedTargetState && (sigState === normalizedTargetState || signal.title.toLowerCase().includes(normalizedTargetState))) {
      return { score: this.stateScore, matchType: 'STATE_MATCH' };
    }

    // Country match
    if (sigCountry === normalizedTargetCountry || signal.title.toLowerCase().includes(normalizedTargetCountry)) {
      return { score: this.countryScore, matchType: 'COUNTRY_MATCH' };
    }

    // Global default
    return { score: this.globalScore, matchType: 'GLOBAL' };
  }

  /**
   * Filters and ranks signals by their location affinity.
   */
  public filterAndRank(
    signals: TrendSignal[],
    targetCity: string,
    targetState?: string,
    targetCountry: string = 'India'
  ): LocatedSignal[] {
    return signals
      .map(signal => {
        const { score, matchType } = this.evaluateRelevance(signal, targetCity, targetState, targetCountry);
        return {
          signal,
          locationRelevance: score,
          matchType,
        };
      })
      .sort((a, b) => b.locationRelevance - a.locationRelevance);
  }
}
