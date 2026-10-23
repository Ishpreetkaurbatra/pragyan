import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Save, 
  Cpu, 
  CheckCircle2, 
  MapPin, 
  Target, 
  Sparkles, 
  Layers, 
  Info,
  SlidersHorizontal
} from 'lucide-react';
import { Business } from '../types';
import { api } from '../services/api/client';

export const BusinessProfilePage: React.FC = () => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [intelligenceMode, setIntelligenceMode] = useState<string>('mock');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form fields
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [location, setLocation] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [businessGoal, setBusinessGoal] = useState('');
  const [products, setProducts] = useState('');
  const [targetCustomers, setTargetCustomers] = useState('');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.getBusinessProfile();
      const b = res.business;
      if (b) {
        setBusiness(b);
        setBusinessName(b.business_name || '');
        setIndustry(b.industry || '');
        setBusinessType(b.business_type || '');
        setLocation(b.location || '');
        setTargetMarket(b.target_market || '');
        setBusinessGoal(b.business_goal || '');
        setProducts(b.products_services?.join(', ') || '');
        setTargetCustomers(b.target_customers || '');
        setBudget(b.budget || '');
        setDescription(b.description || '');
      }
      const modeRes = await api.getIntelligenceMode();
      setIntelligenceMode(modeRes.mode);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      await api.updateBusinessProfile({
        business_name: businessName,
        industry,
        business_type: businessType,
        location,
        target_market: targetMarket,
        business_goal: businessGoal,
        products_services: products.split(',').map(s => s.trim()).filter(Boolean),
        target_customers: targetCustomers,
        budget,
        description,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleModeSwitch = async (mode: string) => {
    try {
      const res = await api.setIntelligenceMode(mode);
      setIntelligenceMode(res.mode);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-16">
      {/* Intelligence Provider Switcher */}
      <div className="glass-panel p-6 sm:p-8 rounded-[28px] border border-white/80 shadow-soft-glass space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <Cpu className="w-5 h-5 text-primary-blue" />
            <h3 className="font-display font-bold text-lg text-navy">
              Model-Agnostic Intelligence Provider
            </h3>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-light-green text-dark-green border border-growth/20 shadow-sm">
            Active Provider: {intelligenceMode.toUpperCase()}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-normal">
          The frontend communicates exclusively with a pluggable <code className="font-mono text-dark-blue font-semibold">IntelligenceProvider</code> abstraction. Switch instantly between deterministic heuristic rules, local open-weight 8B LLMs (via Ollama), or a dedicated model endpoint without touching frontend logic.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <button
            type="button"
            onClick={() => handleModeSwitch('mock')}
            className={`p-5 rounded-2xl text-left border transition-all duration-200 ${
              intelligenceMode === 'mock'
                ? 'bg-white/95 border-growth shadow-glass-hover ring-2 ring-growth/20'
                : 'glass-card border-white/70 hover:bg-white/90'
            }`}
          >
            <div className="font-bold text-sm text-navy flex items-center justify-between">
              <span>Mock / Rules Engine</span>
              {intelligenceMode === 'mock' && <CheckCircle2 className="w-4 h-4 text-growth" />}
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Zero paid API keys. Deterministic rules, seeded data, and sub-10ms response latency for testing.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleModeSwitch('local')}
            className={`p-5 rounded-2xl text-left border transition-all duration-200 ${
              intelligenceMode === 'local'
                ? 'bg-white/95 border-growth shadow-glass-hover ring-2 ring-growth/20'
                : 'glass-card border-white/70 hover:bg-white/90'
            }`}
          >
            <div className="font-bold text-sm text-navy flex items-center justify-between">
              <span>Local Open Model (8B)</span>
              {intelligenceMode === 'local' && <CheckCircle2 className="w-4 h-4 text-growth" />}
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Open-weight ~8B LLM running locally via Ollama with automatic graceful fallback to rules.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleModeSwitch('tgo')}
            className={`p-5 rounded-2xl text-left border transition-all duration-200 ${
              intelligenceMode === 'tgo'
                ? 'bg-white/95 border-growth shadow-glass-hover ring-2 ring-growth/20'
                : 'glass-card border-white/70 hover:bg-white/90'
            }`}
          >
            <div className="font-bold text-sm text-navy flex items-center justify-between">
              <span>T→G Dedicated Model</span>
              {intelligenceMode === 'tgo' && <CheckCircle2 className="w-4 h-4 text-growth" />}
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Custom fine-tuned trend scoring endpoint with specialized retail and hospitality weights.
            </p>
          </button>
        </div>
      </div>

      {/* Business Context Profile Form */}
      <form onSubmit={handleSave} className="glass-panel p-6 sm:p-8 rounded-[28px] border border-white/80 shadow-soft-glass space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-primary-blue" />
            <h3 className="font-display font-bold text-base text-navy">Business Profile Details</h3>
          </div>
          {saveSuccess && (
            <span className="text-xs font-bold text-dark-green bg-light-green px-3 py-1 rounded-full flex items-center space-x-1.5 border border-growth/20 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-growth" />
              <span>Profile Successfully Saved</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div>
            <label className="block font-semibold text-slate-600 mb-1.5">Business Name *</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 font-medium text-navy"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1.5">Industry Sector *</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 font-medium text-navy"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1.5">Business Model / Type *</label>
            <input
              type="text"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 font-medium text-navy"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1.5">Location / City Hub *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 font-medium text-navy"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-600 mb-1.5">Primary Growth Objective *</label>
            <input
              type="text"
              value={businessGoal}
              onChange={(e) => setBusinessGoal(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 font-medium text-navy"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1.5">Products / Services Offered</label>
            <input
              type="text"
              value={products}
              onChange={(e) => setProducts(e.target.value)}
              placeholder="e.g. Specialty Coffee, Artisan Sandwiches, Loaded Fries"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 font-medium text-navy"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1.5">Target Customer Cohort</label>
            <input
              type="text"
              value={targetCustomers}
              onChange={(e) => setTargetCustomers(e.target.value)}
              placeholder="e.g. College students, evening commuters, young professionals"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 font-medium text-navy"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1.5">Monthly Pilot Budget</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. ₹5,000–₹20,000"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 font-medium text-navy"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1.5">Active Promotion Channels</label>
            <input
              type="text"
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
              placeholder="e.g. Instagram Reels, WhatsApp Community, Dine-in Table Standees"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 font-medium text-navy"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-600 mb-1.5">Business Profile Overview</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 font-medium text-navy"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200/60 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary px-8 py-3 text-xs font-bold shadow-soft-glass flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Business Context'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
