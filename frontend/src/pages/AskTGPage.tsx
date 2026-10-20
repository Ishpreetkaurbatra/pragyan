import React, { useState } from 'react';
import { 
  BotMessageSquare, 
  Send, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  Cpu, 
  Layers,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { AskTGoResponse } from '../types';
import { api } from '../services/api/client';

export const AskTGPage: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<AskTGoResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    'What menu item should FreshBite launch this month to capture student traffic?',
    'Which trends have the highest momentum in the 4:00 PM – 8:00 PM evening window?',
    'Compare Loaded Fries vs Artisan Pizza Combos on margin and kitchen complexity',
    'Which opportunity has the lowest risk and fastest payback period for our café?',
    'What should we test next week to improve our evening average order value?',
  ];

  const handleAsk = async (q: string) => {
    setQuestion(q);
    setLoading(true);
    try {
      const res = await api.askTG(q);
      setResponse(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) handleAsk(question.trim());
  };

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto pb-16">
      {/* Header */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-light-blue text-dark-blue text-xs font-bold uppercase tracking-wider border border-primary-blue/20">
          <Cpu className="w-4 h-4 text-primary-blue" />
          <span>T→G Business Intelligence Advisor</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-navy">
          Ask T→G About Your Next Growth Move
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-medium leading-relaxed">
          Grounded business intelligence synthesized directly from your café profile, local market signals, and empirical experiment benchmarks.
        </p>
      </div>

      {/* Suggested Question Chips */}
      <div className="space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center flex items-center justify-center space-x-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Suggested Inquiries for FreshBite Café</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(q)}
              className="px-4 py-2 rounded-2xl text-xs font-semibold bg-white/80 hover:bg-white border border-white/80 text-slate-600 hover:text-navy transition-all shadow-sm hover:border-primary-blue/40 hover:scale-[1.01]"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Card */}
      <form onSubmit={handleSubmit} className="glass-panel p-2.5 rounded-[24px] border border-white/80 shadow-soft-glass flex items-center gap-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a strategic question (e.g. Which opportunity has the highest ROI this month?)..."
          className="flex-1 px-5 py-3 text-xs sm:text-sm bg-transparent focus:outline-none text-navy font-medium placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="btn-primary px-7 py-3 text-xs font-bold shadow-soft-glass flex items-center space-x-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Ask Advisor</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Response Box */}
      {response && (
        <div className="glass-panel p-6 sm:p-8 rounded-[28px] border border-white/80 shadow-soft-glass space-y-6 animate-in fade-in">
          {/* Main Answer text */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-teal">
              <BotMessageSquare className="w-4 h-4 text-teal" />
              <span>Intelligence Synthesis</span>
            </div>
            <div className="text-xs sm:text-sm text-navy leading-relaxed font-normal whitespace-pre-line bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/90 shadow-sm">
              {response.answer}
            </div>
          </div>

          {/* Actionable Recommendations */}
          {response.actionableRecommendations && response.actionableRecommendations.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-navy">
                Recommended Action Sequence:
              </div>
              <div className="space-y-2.5">
                {response.actionableRecommendations.map((rec, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 flex items-start space-x-3 text-xs shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-growth flex-shrink-0 mt-0.5" />
                    <span className="font-semibold text-navy leading-relaxed">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cited Trends */}
          {response.citedTrends && response.citedTrends.length > 0 && (
            <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Cited Market Trends:</span>
              {response.citedTrends.map((t, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full text-xs font-bold bg-light-blue text-dark-blue border border-primary-blue/20">
                  {t.name}
                </span>
              ))}
            </div>
          )}

          {/* Suggested Follow-Ups */}
          {response.suggestedFollowUps && response.suggestedFollowUps.length > 0 && (
            <div className="pt-3 border-t border-slate-200/60 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Suggested Strategic Follow-Ups:</span>
              <div className="flex flex-wrap gap-2">
                {response.suggestedFollowUps.map((fu, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAsk(fu)}
                    className="text-left px-4 py-2 rounded-xl bg-white/80 hover:bg-white border border-white/80 text-xs text-slate-600 hover:text-navy font-medium transition-all shadow-sm hover:border-primary-blue/30"
                  >
                    {fu}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
