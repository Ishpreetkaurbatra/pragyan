import { TrendSignal } from '../../models/intelligence-pipeline.types';

export interface CityTrendProfile {
  city: string;
  state: string;
  country: string;
  clusters: Record<string, {
    category: string;
    weeklyVolumes: [number, number, number, number]; // Week 1 to 4
    headline: string;
    sampleQueries: string[];
    audienceAge: string;
    growthNarrative: string;
  }>;
}

export const SYNTHETIC_CITY_PROFILES: Record<string, CityTrendProfile> = {
  'Nashik': {
    city: 'Nashik',
    state: 'Maharashtra',
    country: 'India',
    clusters: {
      'Matcha Beverages': {
        category: 'Food & Beverage',
        weeklyVolumes: [18, 27, 41, 63],
        headline: 'College crowd and wellness seekers drive iced matcha tea demand in College Road & Gangapur cafes',
        sampleQueries: ['iced matcha latte cafe nashik', 'ceremonial matcha drink college road', 'matcha bubble tea nashik'],
        audienceAge: '18-28',
        growthNarrative: 'Accelerating +53.6% in 3 weeks, driven by campus cafes and fitness enthusiasts.',
      },
      'Protein Snacks': {
        category: 'Food & Beverage',
        weeklyVolumes: [14, 20, 31, 48],
        headline: 'High-protein grab-and-go energy snacks trending among gymgoers and early professionals',
        sampleQueries: ['protein balls cafe snacks nashik', 'healthy high protein munchies', 'whey infused cookies nashik'],
        audienceAge: '20-35',
        growthNarrative: 'Growing +54.8% week-over-week in fitness corridors.',
      },
      'Cold Brew': {
        category: 'Food & Beverage',
        weeklyVolumes: [12, 19, 28, 39],
        headline: 'Smooth artisan cold brew coffee emerging as premium afternoon alternative',
        sampleQueries: ['nitro cold brew coffee cafe nashik', 'bottled cold brew concentrates', 'vanilla sweet cream cold brew'],
        audienceAge: '22-38',
        growthNarrative: 'Steady +39.2% velocity with repeat cafe patronage.',
      },
      'Sustainable Packaging': {
        category: 'Sustainable Living',
        weeklyVolumes: [8, 14, 22, 35],
        headline: 'Biodegradable bagasse takeaway boxes and edible straws gain adoption across local eateries',
        sampleQueries: ['eco friendly food packaging supplier nashik', 'compostable coffee cups wholesale', 'bagasse containers'],
        audienceAge: '25-45',
        growthNarrative: 'Emerging regulatory push and consumer eco-consciousness driving +59.1% growth.',
      },
    },
  },
  'Pune': {
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    clusters: {
      'Matcha Beverages': {
        category: 'Food & Beverage',
        weeklyVolumes: [35, 47, 65, 91],
        headline: 'Matcha lattes and cold foam infusions surging across Koregaon Park, Baner & FC Road cafes',
        sampleQueries: ['best matcha latte cafe pune', 'matcha frappe fc road pune', 'organic matcha tea koregaon park'],
        audienceAge: '19-32',
        growthNarrative: 'High velocity +40.0% week-over-week with strong cross-source confirmation.',
      },
      'Cold Brew': {
        category: 'Food & Beverage',
        weeklyVolumes: [42, 58, 79, 110],
        headline: 'Single-origin iced pour-overs and canned nitro cold brews dominate tech park coffee runs',
        sampleQueries: ['artisan cold brew hinjewadi', 'craft coffee viman nagar', 'nitro cold brew pune'],
        audienceAge: '23-38',
        growthNarrative: 'Strong momentum (+39.2%) driven by IT workforce returning to hybrid offices.',
      },
      'Protein Snacks': {
        category: 'Food & Beverage',
        weeklyVolumes: [28, 39, 56, 82],
        headline: 'Keto bites, protein-packed savories and Greek yogurt bowls trending in youth hubs',
        sampleQueries: ['healthy protein snacks cafe pune', 'clean ingredient snack bars', 'protein rich chaat pune'],
        audienceAge: '20-35',
        growthNarrative: 'Rising rapidly (+46.4%) with high evening snack substitution.',
      },
      'AI Productivity Tools': {
        category: 'Technology & AI',
        weeklyVolumes: [55, 78, 112, 160],
        headline: 'SMB workflow automation and GenAI copywriting tools adoption accelerates among local startups',
        sampleQueries: ['ai automation agency pune', 'local ai productivity workshops', 'ai tools for small businesses'],
        audienceAge: '22-45',
        growthNarrative: 'Massive adoption (+42.8%) across tech clusters.',
      },
    },
  },
  'Mumbai': {
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    clusters: {
      'Matcha Beverages': {
        category: 'Food & Beverage',
        weeklyVolumes: [52, 74, 105, 154],
        headline: 'Ceremonial matcha bars and iced oat milk matcha drinks taking over Bandra, Juhu & BKC',
        sampleQueries: ['ceremonial matcha cafe bandra', 'matcha iced latte bkc', 'authentic japanese matcha mumbai'],
        audienceAge: '20-35',
        growthNarrative: 'Surging at +46.6% week-over-week, supported by lifestyle influencers.',
      },
      'Cold Brew': {
        category: 'Food & Beverage',
        weeklyVolumes: [60, 85, 120, 168],
        headline: 'Bottled tonic cold brews and cascara drinks seeing high re-order rates',
        sampleQueries: ['cold brew subscription mumbai', 'specialty coffee roasters mumbai', 'espresso tonic cafe bandra'],
        audienceAge: '22-40',
        growthNarrative: 'Validated high-volume peak (+40.0%) across metro retail.',
      },
      'Functional Beverages': {
        category: 'Food & Beverage',
        weeklyVolumes: [38, 55, 82, 124],
        headline: 'Adaptogenic sodas, prebiotic sparklers and kombucha taps expand beyond premium supermarkets',
        sampleQueries: ['prebiotic soda mumbai', 'gut healthy drinks cafe', 'adaptogen coffee blends'],
        audienceAge: '24-42',
        growthNarrative: 'Rapid acceleration (+51.2%) driven by wellness shifts.',
      },
      'Personalized Gifts': {
        category: 'Retail & E-commerce',
        weeklyVolumes: [42, 60, 88, 130],
        headline: 'Curated corporate and festive personalized gift boxes with bespoke branding trending',
        sampleQueries: ['personalized corporate hampers mumbai', 'custom gift boxes bkc', 'bespoke gift studio'],
        audienceAge: '25-50',
        growthNarrative: 'Seasonally rising (+47.7%) across corporate and individual gifting.',
      },
    },
  },
  'Ahmedabad': {
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    clusters: {
      'Sustainable Packaging': {
        category: 'Sustainable Living',
        weeklyVolumes: [30, 45, 68, 95],
        headline: 'Plastic alternative packaging and corrugated thermal meal delivery solutions in demand',
        sampleQueries: ['sustainable packaging manufacturers ahmedabad', 'biodegradable boxes sg highway', 'kraft paper containers'],
        audienceAge: '26-50',
        growthNarrative: 'Accelerating (+39.7%) as regional QSRs comply with sustainable compliance mandates.',
      },
      'Protein Snacks': {
        category: 'Food & Beverage',
        weeklyVolumes: [22, 32, 48, 70],
        headline: 'Vegetarian high-protein roasted seeds, makhana and sattu bars surging on SG Highway',
        sampleQueries: ['roasted protein snacks wholesale ahmedabad', 'healthy veg protein snacks', 'diet food cafe sg road'],
        audienceAge: '20-38',
        growthNarrative: 'Strong vegetarian health trend (+45.8%).',
      },
      'Cold Brew': {
        category: 'Food & Beverage',
        weeklyVolumes: [16, 24, 36, 52],
        headline: 'Late-night cafe culture embraces sweetened cold brew blends and nitro coffee',
        sampleQueries: ['night cafe cold brew ahmedabad', 'cold brew with ice cream', 'flavoured cold brew cafe'],
        audienceAge: '18-30',
        growthNarrative: 'Steady +44.4% expansion in student and nightlife pockets.',
      },
    },
  },
  'Bengaluru': {
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    clusters: {
      'AI Productivity Tools': {
        category: 'Technology & AI',
        weeklyVolumes: [65, 95, 145, 220],
        headline: 'Agentic AI coding tools and internal enterprise GenAI copilots surge across Indiranagar & Koramangala',
        sampleQueries: ['ai tools for tech teams bangalore', 'genai workflow automation', 'ai startup meetups koramangala'],
        audienceAge: '22-40',
        growthNarrative: 'Explosive +51.7% week-over-week velocity with massive cross-source coverage.',
      },
      'Smart Fitness Accessories': {
        category: 'Health & Wellness',
        weeklyVolumes: [40, 60, 88, 130],
        headline: 'Connected wearable health bands, biometric recovery rings and smart posture trackers gain traction',
        sampleQueries: ['smart ring fitness tracker bangalore', 'connected gym gear indiranagar', 'posture corrector smart sensor'],
        audienceAge: '24-42',
        growthNarrative: 'Rapid acceleration (+47.7%) among health-conscious tech workers.',
      },
      'Matcha Beverages': {
        category: 'Food & Beverage',
        weeklyVolumes: [45, 62, 86, 122],
        headline: 'Japanese culinary grade matcha cafes and plant-milk matcha lattes thriving in tech corridors',
        sampleQueries: ['matcha bar indiranagar bangalore', 'iced matcha espresso koramangala', 'matcha cheesecake cafe'],
        audienceAge: '20-35',
        growthNarrative: 'Strong +41.8% growth with steady repeat cafe consumption.',
      },
      'Sustainable Packaging': {
        category: 'Sustainable Living',
        weeklyVolumes: [35, 52, 75, 108],
        headline: 'Zero-plastic delivery initiatives by cloud kitchens drive demand for seaweed & mycelium packaging',
        sampleQueries: ['eco friendly packaging suppliers bangalore', 'compostable mailers karnataka', 'cloud kitchen sustainable boxes'],
        audienceAge: '25-45',
        growthNarrative: 'Steady +44.0% increase across urban delivery networks.',
      },
    },
  },
  'Delhi': {
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    clusters: {
      'Functional Beverages': {
        category: 'Food & Beverage',
        weeklyVolumes: [40, 58, 84, 126],
        headline: 'Electrolyte mocktails, immunity tonics and botanical extracts trending in Connaught Place & Hauz Khas',
        sampleQueries: ['electrolyte drinks cafe delhi', 'immunity booster herbal beverage', 'adaptogenic drinks south delhi'],
        audienceAge: '22-45',
        growthNarrative: 'Rising +50.0% week-over-week due to air quality awareness and wellness focus.',
      },
      'Personalized Gifts': {
        category: 'Retail & E-commerce',
        weeklyVolumes: [35, 50, 75, 112],
        headline: 'Handcrafted customized leatherette goods, engraved keepsakes and bespoke stationery in demand',
        sampleQueries: ['custom gift hampers delhi ncr', 'personalized leather gifts khan market', 'corporate luxury hampers'],
        audienceAge: '24-50',
        growthNarrative: 'Strong +49.3% momentum in corporate and lifestyle gifting.',
      },
      'Protein Snacks': {
        category: 'Food & Beverage',
        weeklyVolumes: [48, 68, 96, 138],
        headline: 'High-protein diet meals, roasted legumes and protein smoothie bowls booming across fitness centers',
        sampleQueries: ['protein smoothie bar south delhi', 'diet meal prep service delhi', 'high protein snacks gtb nagar'],
        audienceAge: '19-35',
        growthNarrative: 'Consistently high volume (+43.7%) driven by youth fitness culture.',
      },
    },
  },
};

/**
 * Helper to dynamically generate a location-aware profile for ANY city (e.g. Sangamner, Jaipur, Chandigarh)
 */
export function getOrCreateCityProfile(city: string, state?: string, country: string = 'India'): CityTrendProfile {
  const normalizedCity = city.trim();
  const existingKey = Object.keys(SYNTHETIC_CITY_PROFILES).find(
    c => c.toLowerCase() === normalizedCity.toLowerCase()
  );

  if (existingKey) {
    return SYNTHETIC_CITY_PROFILES[existingKey];
  }

  // Derive realistic seed multipliers based on city name hash for determinism
  let hash = 0;
  for (let i = 0; i < normalizedCity.length; i++) {
    hash = (hash << 5) - hash + normalizedCity.charCodeAt(i);
    hash |= 0;
  }
  const factor = Math.abs(hash % 10) / 10; // 0.0 to 0.9

  const baseVolume = 15 + Math.round(factor * 25);
  const w1 = baseVolume;
  const w2 = Math.round(w1 * (1.25 + factor * 0.15));
  const w3 = Math.round(w2 * (1.30 + factor * 0.15));
  const w4 = Math.round(w3 * (1.35 + factor * 0.15));

  const resolvedState = state || 'State';

  return {
    city: normalizedCity,
    state: resolvedState,
    country,
    clusters: {
      'Matcha Beverages': {
        category: 'Food & Beverage',
        weeklyVolumes: [w1, w2, w3, w4],
        headline: `Modern tea bars and youth cafes in ${normalizedCity} report surging demand for iced matcha drinks`,
        sampleQueries: [`matcha latte cafe ${normalizedCity.toLowerCase()}`, `iced matcha drink in ${normalizedCity.toLowerCase()}`, 'matcha green tea cafe'],
        audienceAge: '18-30',
        growthNarrative: `Emerging demand accelerating in prime cafe spots across ${normalizedCity}.`,
      },
      'Protein Snacks': {
        category: 'Food & Beverage',
        weeklyVolumes: [Math.round(w1 * 0.9), Math.round(w2 * 0.92), Math.round(w3 * 0.95), Math.round(w4 * 0.98)],
        headline: `Health-conscious consumers in ${normalizedCity} look for clean-label protein snacks and energy bites`,
        sampleQueries: [`protein snacks ${normalizedCity.toLowerCase()}`, 'healthy fitness snacks cafe', 'protein bars near me'],
        audienceAge: '20-35',
        growthNarrative: `Fitness awareness driving steady snack replacement in ${normalizedCity}.`,
      },
      'Cold Brew': {
        category: 'Food & Beverage',
        weeklyVolumes: [Math.round(w1 * 0.8), Math.round(w2 * 0.85), Math.round(w3 * 0.88), Math.round(w4 * 0.9)],
        headline: `Specialty cold brew coffee gaining strong traction among young professionals in ${normalizedCity}`,
        sampleQueries: [`cold brew coffee ${normalizedCity.toLowerCase()}`, 'artisan iced coffee cafe', 'cold brew concentrate'],
        audienceAge: '22-38',
        growthNarrative: `Premium coffee culture growing steadily in ${normalizedCity}.`,
      },
      'Sustainable Packaging': {
        category: 'Sustainable Living',
        weeklyVolumes: [Math.round(w1 * 0.6), Math.round(w2 * 0.7), Math.round(w3 * 0.8), Math.round(w4 * 0.88)],
        headline: `Local businesses in ${normalizedCity} seek affordable eco-friendly packaging alternatives`,
        sampleQueries: [`biodegradable packaging wholesale ${normalizedCity.toLowerCase()}`, 'paper carry bags supplier', 'compostable cups'],
        audienceAge: '25-45',
        growthNarrative: `Increasing demand for sustainable takeaway solutions in ${normalizedCity}.`,
      },
    },
  };
}

/**
 * Builds synthetic signals for a given city across 4 time slices and 4 sources.
 */
export function generateSyntheticSignalsForCity(city: string, state?: string, country: string = 'India'): TrendSignal[] {
  const profile = getOrCreateCityProfile(city, state, country);
  const signals: TrendSignal[] = [];

  const sources = [
    { name: 'youtube', weight: 0.35, icon: 'video' },
    { name: 'reddit', weight: 0.25, icon: 'discussion' },
    { name: 'news_rss', weight: 0.20, icon: 'press' },
    { name: 'google_trends', weight: 0.20, icon: 'search' },
  ];

  // Base timestamps representing 4 weekly periods
  const now = Date.now();
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
  const weekTimestamps = [
    new Date(now - 21 * 24 * 60 * 60 * 1000).toISOString(), // Week 1
    new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString(), // Week 2
    new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),  // Week 3
    new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),  // Week 4
  ];

  Object.entries(profile.clusters).forEach(([trendName, data], clusterIdx) => {
    data.weeklyVolumes.forEach((volume, weekIdx) => {
      const timestamp = weekTimestamps[weekIdx];

      sources.forEach((src, srcIdx) => {
        const sourceVolume = Math.max(1, Math.round(volume * src.weight));
        const recordId = `demo-${profile.city.toLowerCase()}-${trendName.toLowerCase().replace(/\s+/g, '-')}-w${weekIdx + 1}-${src.name}`;

        let title = '';
        let text = '';
        let url = '';

        if (src.name === 'youtube') {
          title = `${trendName} Trend in ${profile.city} (Week ${weekIdx + 1}): Best Places & Reviews`;
          text = `Reviewing the fastest rising ${trendName.toLowerCase()} craze across ${profile.city} campuses and cafes. Over ${sourceVolume * 150} views this week!`;
          url = `https://youtube.com/watch?v=demo_${profile.city.toLowerCase()}_w${weekIdx + 1}_${clusterIdx}`;
        } else if (src.name === 'reddit') {
          title = `r/${profile.city} (Week ${weekIdx + 1}): Where to find authentic ${trendName.toLowerCase()} in town?`;
          text = `Noticeable uptick in questions about ${trendName.toLowerCase()}. Everyone is ordering this week. ${data.headline}`;
          url = `https://reddit.com/r/${profile.city.toLowerCase()}/comments/demo_w${weekIdx + 1}_${clusterIdx}`;
        } else if (src.name === 'news_rss') {
          title = `${profile.city} Retail Pulse (Week ${weekIdx + 1}): ${data.headline}`;
          text = `${profile.city} consumer trends show rapid expansion in ${trendName}. Industry observers report ${data.growthNarrative}`;
          url = `https://news.example.com/${profile.city.toLowerCase()}/${trendName.toLowerCase().replace(/\s+/g, '-')}-surge-w${weekIdx + 1}`;
        } else {
          title = `Google Search Interest Surge (Week ${weekIdx + 1}): "${data.sampleQueries[0]}" in ${profile.city}`;
          text = `Relative search index reached ${sourceVolume * 3} points in ${profile.city}, up sharply from prior period.`;
          url = `https://trends.google.com/trends/explore?geo=IN&q=${encodeURIComponent(data.sampleQueries[0])}&date=w${weekIdx + 1}`;
        }

        const signal: TrendSignal = {
          id: `sig-${recordId}`,
          source: src.name,
          sourceRecordId: recordId,
          title,
          text,
          url,
          timestamp,
          collectedAt: new Date().toISOString(),
          location: {
            city: profile.city,
            state: profile.state,
            country: profile.country,
          },
          category: data.category,
          keywords: [
            ...trendName.toLowerCase().split(' '),
            profile.city.toLowerCase(),
            ...data.sampleQueries.flatMap(q => q.toLowerCase().split(' ')),
          ].filter((v, i, a) => a.indexOf(v) === i && v.length > 2),
          engagementMetrics: {
            views: sourceVolume * 120,
            likes: Math.round(sourceVolume * 14.5),
            comments: Math.round(sourceVolume * 3.2),
            shares: Math.round(sourceVolume * 1.8),
            score: sourceVolume,
          },
          rawMetrics: {
            synthetic_week: weekIdx + 1,
            reported_volume: sourceVolume,
            raw_interest_index: Math.min(100, Math.round(sourceVolume * 2.8)),
          },
          sourceMetadata: {
            isSynthetic: true,
            notice: 'DEMO DATA — NOT LIVE',
            clusterConcept: trendName,
            weekIndex: weekIdx + 1,
            cityProfile: profile.city,
          },
          status: 'RAW',
        };

        signals.push(signal);
      });
    });
  });

  return signals;
}
