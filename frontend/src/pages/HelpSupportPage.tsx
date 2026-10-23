import React, { useState } from 'react';
import { 
  HelpCircle, 
  Sparkles, 
  Compass, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  Cpu, 
  BotMessageSquare, 
  ArrowRight, 
  Mail, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2,
  ExternalLink,
  BookOpen,
  MessageSquare
} from 'lucide-react';

interface HelpSupportPageProps {
  onNavigate: (tab: string) => void;
}

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export const HelpSupportPage: React.FC<HelpSupportPageProps> = ({ onNavigate }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const faqs: FaqItem[] = [
    {
      category: 'Intelligence',
      question: 'How does T→G score and detect emerging market trends?',
      answer: 'T→G continuously aggregates signals across multi-channel social momentum, search velocity, and localized consumer behavior. Each trend receives a composite Trend Score (0–100) based on velocity, acceleration, persistence, and demographic fit with your café or business profile.'
    },
    {
      category: 'Playbooks',
      question: 'What is an Action Plan and how is it customized?',
      answer: 'Action Plans are commercial playbooks that translate market trends into tangible rollout steps. Each plan specifies pricing anchors, inventory requirements, staffing schedules, and high-margin margin targets customized for your retail or café category.'
    },
    {
      category: 'Validation',
      question: 'How does Expert Validation work?',
      answer: 'Independent hospitality and retail strategists review commercial playbooks before you commit capital. Strategists evaluate kitchen complexity, margin sustainability, and neighborhood competition to provide an objective feasibility score and risk mitigation advice.'
    },
    {
      category: 'Tracking',
      question: 'How does Growth Tracking connect with Experiments?',
      answer: 'Once you launch an action plan as an experiment, Growth Tracking monitors empirical metrics (such as Daily Orders, 4–8 PM Footfall, and Average Order Value) against a pre-experiment baseline to measure true net revenue lift.'
    },
    {
      category: 'AI Advisor',
      question: 'What models power the T→G AI Advisor?',
      answer: 'The T→G Intelligence Layer supports pluggable inference engines—including local privacy-preserving LLMs (Ollama Llama-3.1 8B), fine-tuned T→G Growth models, and cloud providers. The advisor grounds every recommendation in your business context.'
    }
  ];

  const categories = ['All', 'Intelligence', 'Playbooks', 'Validation', 'Tracking', 'AI Advisor'];

  const filteredFaqs = selectedCategory === 'All'
    ? faqs
    : faqs.filter(f => f.category === selectedCategory);

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-16">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-[28px] border border-white/80 shadow-soft-glass flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-lightgreen text-darkgreen text-xs font-bold uppercase tracking-wider border border-growthgreen/20">
            <HelpCircle className="w-4 h-4 text-growthgreen" />
            <span>Platform Documentation & Support</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-navy">
            Help & Support Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-medium leading-relaxed">
            Everything you need to master signal discovery, commercial execution, expert reviews, and growth tracking across your business.
          </p>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0">
          <button
            onClick={() => onNavigate('ask-tg')}
            className="btn-primary px-5 py-3 text-xs font-bold shadow-soft-glass flex items-center space-x-2 cursor-pointer"
          >
            <BotMessageSquare className="w-4 h-4" />
            <span>Ask T→G Advisor</span>
          </button>
          <button
            onClick={() => onNavigate('trend-finder')}
            className="btn-secondary-blue px-4 py-3 text-xs font-bold shadow-soft-glass flex items-center space-x-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trend Finder</span>
          </button>
        </div>
      </div>

      {/* 4 Feature Guide Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div 
          onClick={() => onNavigate('trend-finder')}
          className="glass-card p-5 rounded-2xl cursor-pointer hover:border-primaryblue/40 transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-warningbg text-warningorange flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-navy group-hover:text-primaryblue transition-colors">
                1. Trend Discovery
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Scan high-velocity food, beverage, and youth retail trends scored for your demographic.
              </p>
            </div>
          </div>
          <div className="pt-4 flex items-center text-xs font-bold text-primaryblue space-x-1">
            <span>Explore Trends</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2 */}
        <div 
          onClick={() => onNavigate('action-plans')}
          className="glass-card p-5 rounded-2xl cursor-pointer hover:border-primaryblue/40 transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-lightblue text-primaryblue flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-navy group-hover:text-primaryblue transition-colors">
                2. Action Plans
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Convert trends into operational playbooks with ingredient sourcing and menu pricing.
              </p>
            </div>
          </div>
          <div className="pt-4 flex items-center text-xs font-bold text-primaryblue space-x-1">
            <span>View Playbooks</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3 */}
        <div 
          onClick={() => onNavigate('expert-validation')}
          className="glass-card p-5 rounded-2xl cursor-pointer hover:border-primaryblue/40 transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-lightblue text-secondaryblue flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-navy group-hover:text-primaryblue transition-colors">
                3. Expert Validation
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Get certified retail strategists to review feasibility and de-risk your execution before launch.
              </p>
            </div>
          </div>
          <div className="pt-4 flex items-center text-xs font-bold text-primaryblue space-x-1">
            <span>Review Insights</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4 */}
        <div 
          onClick={() => onNavigate('experiments')}
          className="glass-card p-5 rounded-2xl cursor-pointer hover:border-primaryblue/40 transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-lightgreen text-growthgreen flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-navy group-hover:text-primaryblue transition-colors">
                4. Growth Tracking
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Log real-time sales and customer footfall against baseline metrics to verify lift.
              </p>
            </div>
          </div>
          <div className="pt-4 flex items-center text-xs font-bold text-primaryblue space-x-1">
            <span>Track Growth</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-[28px] border border-white/80 shadow-soft-glass space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-display font-bold text-xl text-navy">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Common questions on trend intelligence, playbooks, and experiments.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                  selectedCategory === cat
                    ? 'bg-primaryblue text-white shadow-sm'
                    : 'text-slate-600 bg-white/70 hover:bg-white hover:text-navy border border-white/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx}
                className="glass-card rounded-2xl border border-white/90 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4.5 flex items-center justify-between gap-4 hover:bg-white/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-lightblue text-darkblue">
                      {faq.category}
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-navy">
                      {faq.question}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-secondary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-secondary flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100/60 bg-white/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Support Concierge & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 sm:p-7 rounded-[28px] border border-white/80 shadow-soft-glass space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-lightblue text-primaryblue flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-navy">
                Dedicated Support Concierge
              </h3>
              <p className="text-xs text-slate-500">
                Direct assistance for FreshBite Café operators and staff.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Need customized data exports, custom API integrations, or direct consultation on local market signals? Reach out to our business intelligence operations team.
          </p>
          <div className="space-y-2 text-xs font-medium text-slate-600">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-growthgreen" />
              <span>Available Monday – Saturday, 8:00 AM – 10:00 PM IST</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-primaryblue" />
              <span className="font-semibold text-navy">support@trend-to-growth.com</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 sm:p-7 rounded-[28px] border border-white/80 shadow-soft-glass space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-lightgreen text-growthgreen flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-navy">
                Ask T→G AI Intelligence
              </h3>
              <p className="text-xs text-slate-500">
                Interactive real-time business decision advisory.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ask questions like <em>"What should FreshBite test next week to improve late afternoon footfall?"</em> and get grounded recommendations immediately.
          </p>
          <button
            onClick={() => onNavigate('ask-tg')}
            className="btn-primary w-full py-3 px-4 text-xs font-bold shadow-soft-glass flex items-center justify-center space-x-2"
          >
            <BotMessageSquare className="w-4 h-4" />
            <span>Launch AI Chatbot Advisor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
