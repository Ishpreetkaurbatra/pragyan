import React from 'react';
import { 
  TrendingUp, 
  Target, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  Layers, 
  FlaskConical, 
  CheckCircle2, 
  BarChart3, 
  Search,
  ShieldCheck,
  Building2,
  FileText
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreTrends: () => void;
  onSignIn?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onGetStarted, 
  onExploreTrends,
  onSignIn 
}) => {
  return (
    <div className="space-y-16 max-w-7xl mx-auto py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-6">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/90 text-xs font-bold text-primary-blue shadow-soft-glass">
          <Sparkles className="w-4 h-4 text-warning-orange" />
          <span>Soft Glass. Strong Intelligence. Visible Growth.</span>
        </div>

        <h1 className="font-display font-extrabold text-5xl lg:text-7xl text-navy tracking-tight max-w-5xl mx-auto leading-[1.12]">
          Find the trends that matter to <span className="bg-gradient-to-r from-primary-blue via-teal to-growth bg-clip-text text-transparent">your business.</span>
        </h1>

        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
          T→G connects real-world signals with business context and human expertise to transform emerging trends into structured, validated action plans and measurable experiments.
        </p>

        <div className="flex flex-row items-center justify-center gap-4 pt-3">
          <button
            onClick={onGetStarted}
            className="btn-primary px-8 py-4 text-sm font-bold shadow-soft-glass flex items-center justify-center space-x-2.5"
          >
            <span>Launch Live Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          {onSignIn && (
            <button
              onClick={onSignIn}
              className="btn-secondary-blue px-7 py-4 text-sm font-bold flex items-center justify-center space-x-2"
            >
              <span>Sign In / Demo Login</span>
            </button>
          )}
          <button
            onClick={onExploreTrends}
            className="btn-secondary-green px-7 py-4 text-sm font-bold flex items-center justify-center space-x-2"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Trend Finder</span>
          </button>
        </div>
      </section>

      {/* The Core Growth Loop Infographic */}
      <section className="glass-panel rounded-4xl p-10 border border-white/80 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary-blue">
            End-to-End Decision Architecture
          </span>
          <h2 className="font-display font-bold text-3xl text-navy">
            How Scattered Signals Become Measured Growth
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            A continuous loop from real-world data acquisition to human validation and compounding business memory.
          </p>
        </div>

        <div className="grid grid-cols-7 gap-4 text-center">
          {[
            { step: '1. DETECT', desc: 'Real-world search, social & sales signals', icon: Search, color: 'text-primary-blue', bg: 'bg-light-blue' },
            { step: '2. ANALYZE', desc: 'Velocity, acceleration & lifecycle scoring', icon: BarChart3, color: 'text-teal', bg: 'bg-light-green' },
            { step: '3. MATCH', desc: 'Business fit calculated to your exact profile', icon: Target, color: 'text-growth', bg: 'bg-light-green' },
            { step: '4. OPPORTUNITY', desc: 'Actionable customer concept formulation', icon: Zap, color: 'text-warning-orange', bg: 'bg-warning-bg' },
            { step: '5. VALIDATE', desc: 'Human retail strategist sign-off', icon: ShieldCheck, color: 'text-primary-blue', bg: 'bg-light-blue' },
            { step: '6. EXPERIMENT', desc: '7-day low-risk pilots with daily metrics', icon: FlaskConical, color: 'text-cyan-accent', bg: 'bg-cyan-50' },
            { step: '7. LEARN', desc: 'Memory adaptation for future matching', icon: TrendingUp, color: 'text-growth', bg: 'bg-light-green' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-5 rounded-3xl glass-card flex flex-col items-center space-y-3 hover:translate-y-[-3px] transition-all">
                <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center shadow-sm`}>
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="font-display font-bold text-xs tracking-wider text-navy">{item.step}</div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Signature Preview: Trend Card Feature Showcase */}
      <section className="grid grid-cols-12 gap-10 items-center">
        <div className="col-span-5 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-light-green text-dark-green text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-growth" />
            <span>Signature Interaction</span>
          </div>
          <h2 className="font-display font-extrabold text-4xl text-navy leading-tight">
            Vertical Discovery Inspired by Reels. Built for Business Decisions.
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            No video distractions. High-resolution product photography, verified momentum scores, localized business fit, and clear next steps formatted for rapid evaluation.
          </p>

          <div className="space-y-3 pt-1">
            {[
              'Calculates Customer, Product, Location & Goal Alignment',
              'Pre-packaged with 7-Day pilot pricing and promotion tactics',
              'Direct submission to Human Expert Validation pipeline',
            ].map((pt, i) => (
              <div key={i} className="flex items-center space-x-3 text-xs font-semibold text-navy">
                <div className="w-5 h-5 rounded-full bg-light-green flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-dark-green" />
                </div>
                <span>{pt}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={onExploreTrends}
              className="btn-primary px-8 py-3.5 text-xs font-bold flex items-center space-x-2.5"
            >
              <span>Test Drive Trend Finder</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mock Reels Card Visual */}
        <div className="col-span-7">
          <div className="h-[520px] rounded-4xl overflow-hidden glass-panel border border-white/90 shadow-glass-panel relative p-8 flex flex-col justify-between text-white">
            <img 
              src="https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=1200&q=80" 
              alt="Loaded Fries" 
              className="absolute inset-0 w-full h-full object-cover object-center z-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/25 z-0"></div>

            <div className="relative z-10 flex justify-between items-center">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-growth text-white shadow-sm">
                RISING TREND
              </span>
              <span className="text-xs px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 font-semibold">
                Food & Beverage
              </span>
            </div>

            <div className="relative z-10 space-y-4">
              <div>
                <h3 className="font-display font-extrabold text-3xl text-white">
                  Loaded Fries Are Gaining Attention
                </h3>
                <p className="text-xs text-slate-200 mt-1.5 max-w-xl font-normal leading-relaxed">
                  Surging localized interest among younger consumers in Sangamner / Pune regional hub during evening hours.
                </p>
              </div>

              <div className="grid grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20">
                  <div className="text-[10px] text-slate-300 uppercase font-bold">Momentum</div>
                  <div className="font-extrabold text-teal mt-0.5 text-sm">HIGH</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20">
                  <div className="text-[10px] text-slate-300 uppercase font-bold">Business Fit</div>
                  <div className="font-extrabold text-growth mt-0.5 text-sm">91%</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20">
                  <div className="text-[10px] text-slate-300 uppercase font-bold">Opportunity</div>
                  <div className="font-extrabold text-light-blue mt-0.5 text-sm">8.8/10</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20">
                  <div className="text-[10px] text-slate-300 uppercase font-bold">Risk</div>
                  <div className="font-extrabold text-light-green mt-0.5 text-sm">LOW</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/20 text-xs">
                <strong className="text-growth block text-[10px] uppercase tracking-wider font-extrabold">WHAT COULD YOU DO WITH THIS?</strong>
                <span className="text-slate-100 font-medium">Launch a ₹99 student combo between 4–8 PM and test demand for 7 days.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
