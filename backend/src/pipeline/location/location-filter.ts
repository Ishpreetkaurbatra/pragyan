import { TrendSignal } from '../../models/intelligence-pipeline.types';

export interface LocationFilterConfig {
  cityMatchScore?: number;
  districtMatchScore?: number;
  stateMatchScore?: number;
  countryMatchScore?: number;
  globalScore?: number;
}

export type LocationMatchType =
  | 'CITY_MATCH'
  | 'DISTRICT_MATCH'
  | 'STATE_MATCH'
  | 'COUNTRY_MATCH'
  | 'OTHER_CITY'
  | 'GLOBAL';

export interface LocationRelevanceResult {
  score: number;
  locationRelevance: number; // 0.0 to 1.0
  matchType: LocationMatchType;
  locationReason: string;
}

export interface LocatedSignal {
  signal: TrendSignal;
  locationRelevance: number;
  matchType: LocationMatchType;
  locationReason: string;
}

export class LocationFilter {
  public static readonly AHILYANAGAR_ALIASES = ['ahilyanagar', 'ahmednagar', 'nagar'];

  public static readonly AHILYANAGAR_LOCALITIES = [
    'savedi',
    'bhingar',
    'kedgaon',
    'nagapur',
    'pipeline road',
    'delhi gate',
    'dsp chowk',
    'tophkhana',
    'kotwali',
    'midc ahmednagar',
    'midc ahilyanagar',
    'market yard ahmednagar',
    'market yard ahilyanagar',
  ];

  public static readonly AHILYANAGAR_DISTRICT_HUBS = [
    'shirdi',
    'sangamner',
    'kopargaon',
    'shrirampur',
    'rahata',
    'nevasa',
    'shevgaon',
    'pathardi',
    'parner',
    'karjat',
    'jamkhed',
    'akole',
    'rahuri',
    'shani shingnapur',
    'ahilyanagar district',
    'ahmednagar district',
  ];

  public static readonly COMPETING_OTHER_CITIES = [
    'pune',
    'mumbai',
    'bengaluru',
    'bangalore',
    'delhi',
    'hyderabad',
    'chennai',
    'kolkata',
    'nagpur',
    'nashik',
    'aurangabad',
    'chhatrapati sambhajinagar',
    'solapur',
    'kolhapur',
    'satara',
    'thane',
    'navi mumbai',
  ];

  private cityScore: number;
  private districtScore: number;
  private stateScore: number;
  private countryScore: number;
  private globalScore: number;

  constructor(cfg?: LocationFilterConfig) {
    this.cityScore = cfg?.cityMatchScore ?? 100;
    this.districtScore = cfg?.districtMatchScore ?? 85;
    this.stateScore = cfg?.stateMatchScore ?? 55;
    this.countryScore = cfg?.countryMatchScore ?? 25;
    this.globalScore = cfg?.globalScore ?? 10;
  }

  /**
   * Evaluates location relevance score for a signal against target location.
   * Provides deep, fine-grained Ahilyanagar/Ahmednagar differentiation.
   */
  public evaluateRelevance(
    signal: TrendSignal,
    targetCity: string,
    targetState?: string,
    targetCountry: string = 'India'
  ): LocationRelevanceResult {
    const textToScan = `${signal.title} ${signal.text || ''} ${signal.keywords?.join(' ') || ''}`.toLowerCase();
    const sigCity = signal.location?.city?.toLowerCase()?.trim() || '';
    const sigState = signal.location?.state?.toLowerCase()?.trim() || '';
    const sigCountry = signal.location?.country?.toLowerCase()?.trim() || '';

    const normalizedTargetCity = targetCity.toLowerCase().trim();
    const isAhilyanagarTarget = normalizedTargetCity === 'ahilyanagar' || normalizedTargetCity === 'ahmednagar';

    if (isAhilyanagarTarget) {
      // 1. Direct Ahilyanagar City / Locality match
      const isDirectCity =
        LocationFilter.AHILYANAGAR_ALIASES.some(alias => sigCity === alias || textToScan.includes(alias)) ||
        LocationFilter.AHILYANAGAR_LOCALITIES.some(loc => textToScan.includes(loc));

      if (isDirectCity) {
        return {
          score: this.cityScore,
          locationRelevance: Number((this.cityScore / 100).toFixed(2)),
          matchType: 'CITY_MATCH',
          locationReason: 'Ahilyanagar-specific signal',
        };
      }

      // 2. Ahilyanagar District taluka / regional hub match
      const isDistrict = LocationFilter.AHILYANAGAR_DISTRICT_HUBS.some(hub => sigCity === hub || textToScan.includes(hub));
      if (isDistrict) {
        return {
          score: this.districtScore,
          locationRelevance: Number((this.districtScore / 100).toFixed(2)),
          matchType: 'DISTRICT_MATCH',
          locationReason: 'Ahilyanagar district signal',
        };
      }

      // 3. Competing other cities (Pune, Mumbai, Bengaluru, etc.) - low relevance for Ahilyanagar
      const isOtherCity = LocationFilter.COMPETING_OTHER_CITIES.some(c => sigCity === c || textToScan.includes(c));
      if (isOtherCity) {
        return {
          score: 10,
          locationRelevance: 0.10,
          matchType: 'OTHER_CITY',
          locationReason: 'Non-Ahilyanagar regional signal (low local relevance)',
        };
      }

      // 4. Maharashtra State match
      if (sigState === 'maharashtra' || textToScan.includes('maharashtra')) {
        return {
          score: this.stateScore,
          locationRelevance: Number((this.stateScore / 100).toFixed(2)),
          matchType: 'STATE_MATCH',
          locationReason: 'Maharashtra state-level signal',
        };
      }

      // 5. India National match
      if (sigCountry === 'india' || textToScan.includes('india')) {
        return {
          score: this.countryScore,
          locationRelevance: Number((this.countryScore / 100).toFixed(2)),
          matchType: 'COUNTRY_MATCH',
          locationReason: 'National Indian market signal',
        };
      }

      // 6. Global default
      return {
        score: this.globalScore,
        locationRelevance: Number((this.globalScore / 100).toFixed(2)),
        matchType: 'GLOBAL',
        locationReason: 'Macro market signal',
      };
    }

    // Generic multi-city evaluation fallback
    const matchesCityField = sigCity === normalizedTargetCity;
    const mentionsCityInText = textToScan.includes(normalizedTargetCity);

    if (matchesCityField || mentionsCityInText) {
      return {
        score: this.cityScore,
        locationRelevance: Number((this.cityScore / 100).toFixed(2)),
        matchType: 'CITY_MATCH',
        locationReason: `${targetCity} city-specific signal`,
      };
    }

    if (targetState && (sigState === targetState.toLowerCase() || textToScan.includes(targetState.toLowerCase()))) {
      return {
        score: this.stateScore,
        locationRelevance: Number((this.stateScore / 100).toFixed(2)),
        matchType: 'STATE_MATCH',
        locationReason: `${targetState} state-level signal`,
      };
    }

    if (sigCountry === targetCountry.toLowerCase() || textToScan.includes(targetCountry.toLowerCase())) {
      return {
        score: this.countryScore,
        locationRelevance: Number((this.countryScore / 100).toFixed(2)),
        matchType: 'COUNTRY_MATCH',
        locationReason: `${targetCountry} national signal`,
      };
    }

    return {
      score: this.globalScore,
      locationRelevance: Number((this.globalScore / 100).toFixed(2)),
      matchType: 'GLOBAL',
      locationReason: 'General market signal',
    };
  }

  /**
   * Filters and ranks signals by their location affinity.
   * When focusing on Ahilyanagar, automatically deprioritizes unrelated other cities.
   */
  public filterAndRank(
    signals: TrendSignal[],
    targetCity: string,
    targetState?: string,
    targetCountry: string = 'India'
  ): LocatedSignal[] {
    const isAhilyanagarTarget =
      targetCity.toLowerCase().trim() === 'ahilyanagar' ||
      targetCity.toLowerCase().trim() === 'ahmednagar';

    return signals
      .map(signal => {
        const res = this.evaluateRelevance(signal, targetCity, targetState, targetCountry);
        return {
          signal,
          locationRelevance: res.score,
          matchType: res.matchType,
          locationReason: res.locationReason,
        };
      })
      .filter(item => {
        // If target is Ahilyanagar, exclude signals that are strictly about other cities (e.g. Pune, Mumbai, etc.)
        if (isAhilyanagarTarget && item.matchType === 'OTHER_CITY') {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.locationRelevance - a.locationRelevance);
  }
}
