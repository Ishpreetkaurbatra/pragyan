import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  MessageSquare, 
  Building2, 
  TrendingUp, 
  Target, 
  Clock, 
  Sparkles, 
  UserCheck, 
  Mail, 
  Phone, 
  Award, 
  Users, 
  ChevronRight, 
  X,
  BotMessageSquare
} from 'lucide-react';
import { ExpertReview } from '../types';
import { api } from '../services/api/client';

interface Expert {
  id: string;
  name: string;
  role: string;
  expertise: string;
  email: string;
  phone: string;
  availability: string;
  rating: string;
  avatar: string;
}

interface ExpertValidationPageProps {
  onNavigateTab?: (tab: string) => void;
}

export const ExpertValidationPage: React.FC<ExpertValidationPageProps> = ({ onNavigateTab }) => {
  const [reviews, setReviews] = useState<ExpertReview[]>([]);
  const [selectedReview, setSelectedReview] = useState<ExpertReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [changeExpertOpen, setChangeExpertOpen] = useState(false);

  // Available human strategists pool (Demo structured data)
  const expertsList: Expert[] = [
    {
      id: 'exp-1',
      name: 'Rajesh Kulkarni',
      role: 'Senior Hospitality & Retail Strategist',
      expertise: 'Café Menu Margins, Fast-Casual Sourcing, Student Transit Nodes',
      email: 'rajesh@stratgrowth.in',
      phone: '+91 98230 44120',
      availability: 'Available (Avg. review turnaround: 6 hours)',
      rating: '4.9 ★ (38 Café Validations)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 'exp-2',
      name: 'Anita Desai',
      role: 'Beverage Innovation Specialist',
      expertise: 'Cold Brew Systems, Signature Syrups, Youth Drink Palates',
      email: 'anita.desai@bevglow.demo',
      phone: '+91 98231 88412',
      availability: 'Available (Avg. review turnaround: 4 hours)',
      rating: '4.95 ★ (29 Beverage Reviews)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 'exp-3',
      name: 'Vikram Sen',
      role: 'QSR Kitchen Operations & Margin Engineer',
      expertise: 'Kitchen Station Throughput, Batching, Ingredient Waste Minimization',
      email: 'vikram.sen@qsrgrowth.demo',
      phone: '+91 98234 11209',
      availability: 'Available Tomorrow',
      rating: '4.85 ★ (44 Operations Audits)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 'exp-4',
      name: 'Meera Nair',
      role: 'Campus Retail Demographic Marketer',
      expertise: 'Student Peer Bundles, High-Footfall Timing, Promotional Packaging',
      email: 'meera.nair@campusinsights.demo',
      phone: '+91 98239 67543',
      availability: 'Available (Avg. review turnaround: 8 hours)',
      rating: '4.9 ★ (31 Retail Validations)',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
    }
  ];

  const [assignedExpert, setAssignedExpert] = useState<Expert>(expertsList[0]);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await api.getExpertReviews();
      setReviews(data);
      if (data.length > 0) {
        setSelectedReview(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExpert = (exp: Expert) => {
    setAssignedExpert(exp);
    setChangeExpertOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-primaryblue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 lg:p-8 rounded-[28px] glass-panel border border-white/80 shadow-soft-glass">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-lightblue text-darkblue text-xs font-bold uppercase tracking-wider mb-2 border border-primaryblue/20">
            <ShieldCheck className="w-4 h-4 text-primaryblue" />
            <span>Human-in-the-Loop Strategic Quality Assurance</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl lg:text-3xl text-navy">
            Expert Validation Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Every commercial playbook is audited by certified hospitality & retail strategists before capital deployment.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setChangeExpertOpen(true)}
            className="btn-secondary-blue px-4 py-2.5 text-xs font-bold shadow-soft-glass flex items-center space-x-2 cursor-pointer"
          >
            <Users className="w-4 h-4 text-white" />
            <span>Change Assigned Expert</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          ASSIGNED HUMAN EXPERT DISPLAY CARD (Requirement 13)
          ======================================================== */}
      <div className="glass-panel p-6 sm:p-7 rounded-[28px] border border-white/90 shadow-soft-glass bg-gradient-to-br from-white/95 to-slate-50/80 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-growthgreen" />
            <span className="font-display font-extrabold text-xs uppercase tracking-wider text-navy">
              Current Assigned Strategist
            </span>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-lightgreen text-darkgreen">
            Assigned to FreshBite Café
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img 
              src={assignedExpert.avatar} 
              alt={assignedExpert.name} 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-3 border-white ring-4 ring-primaryblue/15 shadow-md flex-shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-navy">
                  {assignedExpert.name}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-lightblue text-darkblue">
                  {assignedExpert.rating}
                </span>
              </div>
              <p className="text-xs font-bold text-primaryblue">
                {assignedExpert.role}
              </p>
              <p className="text-xs text-slate-600 max-w-xl font-medium">
                {assignedExpert.expertise}
              </p>
            </div>
          </div>

          {/* Contact Details & Availability Card */}
          <div className="p-4 rounded-2xl bg-white/90 border border-white/90 shadow-xs space-y-2 text-xs min-w-[280px]">
            <div className="flex items-center space-x-2 text-slate-700">
              <Mail className="w-4 h-4 text-primaryblue flex-shrink-0" />
              <span className="font-mono text-[11px] font-medium">{assignedExpert.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-700">
              <Phone className="w-4 h-4 text-growthgreen flex-shrink-0" />
              <span className="font-mono text-[11px] font-medium">{assignedExpert.phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-700 pt-1 border-t border-slate-100">
              <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span className="text-[11px] text-slate-500">{assignedExpert.availability}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-slate-400 text-[11px]">
            Demo Strategist Profile • Real consultations route directly to verified regional advisors
          </span>

          <button
            onClick={() => setChangeExpertOpen(true)}
            className="font-bold text-primaryblue hover:underline cursor-pointer flex items-center space-x-1"
          >
            <span>Switch to Another Specialist</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Strategist Verdict & Validation Assessment */}
      {selectedReview && (
        <div className="w-full glass-panel p-6 sm:p-8 rounded-[28px] border border-white/80 shadow-soft-glass space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[10px] font-extrabold uppercase text-growthgreen tracking-wider">
              STRATEGIST VERDICT
            </span>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-navy mt-1">
              Validation Assessment: {assignedExpert.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-white/80 border border-white/90">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Feasibility Score</span>
              <span className="font-display font-extrabold text-3xl text-primaryblue mt-1 block">
                {selectedReview.confidence ? Math.round(selectedReview.confidence * 100) : 88} / 100
              </span>
              <span className="text-growthgreen font-bold text-[11px]">High Execution Readiness</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-white/90">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Kitchen Complexity</span>
              <span className="font-display font-extrabold text-3xl text-growthgreen mt-1 block">
                Low Risk
              </span>
              <span className="text-slate-500 text-[11px]">Existing fryers sufficient</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 border border-white/90 space-y-1.5 text-xs">
            <span className="font-extrabold uppercase text-navy text-[10px] tracking-wider block">
              Expert Comments & Field Guidance
            </span>
            <p className="text-slate-700 leading-relaxed font-medium">
              {selectedReview.comments || 'Strong potential for late-afternoon traffic lift. Recommend pre-cutting potatoes in morning prep to keep order times under 3 minutes during student rush.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-lightgreen/30 border border-growthgreen/20 space-y-1 text-xs text-darkgreen">
            <span className="font-extrabold uppercase text-[10px] tracking-wider block">
              Commercial Recommendation
            </span>
            <p className="font-semibold leading-relaxed">
              Approved for 7-day live market pilot. Target: 25+ daily orders with min 60% gross margin.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
          CHANGE EXPERT MODAL (Requirement 13)
          ======================================================== */}
      {changeExpertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl glass-panel bg-white/98 backdrop-blur-2xl p-6 sm:p-7 rounded-[32px] border border-white shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-extrabold text-lg text-navy">
                  Select Certified Business Strategist
                </h3>
                <p className="text-xs text-slate-500">
                  Choose a domain expert aligned with your current culinary and growth focus.
                </p>
              </div>
              <button
                onClick={() => setChangeExpertOpen(false)}
                className="p-2 rounded-xl glass-card text-slate-400 hover:text-navy cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
              {expertsList.map((exp) => {
                const isCurrent = exp.id === assignedExpert.id;
                return (
                  <div
                    key={exp.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isCurrent
                        ? 'bg-lightblue/30 border-primaryblue ring-2 ring-primaryblue/20'
                        : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <img 
                        src={exp.avatar} 
                        alt={exp.name} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs flex-shrink-0"
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-navy">{exp.name}</h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {exp.rating}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-primaryblue">{exp.role}</p>
                        <p className="text-[11px] text-slate-500">{exp.expertise}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectExpert(exp)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                        isCurrent
                          ? 'bg-primaryblue text-white shadow-xs'
                          : 'btn-secondary-blue text-white'
                      }`}
                    >
                      {isCurrent ? 'Currently Assigned' : 'Select This Expert'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          AI CHATBOT CALLOUT BANNER (Requirement 15)
          ======================================================== */}
      <div className="glass-panel p-6 sm:p-7 rounded-[28px] border border-primaryblue/30 bg-gradient-to-r from-lightblue/40 via-white/80 to-lightgreen/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-soft-glass">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-primaryblue text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <BotMessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-extrabold text-sm sm:text-base text-navy">
              Have questions about expert feedback? Ask T→G AI
            </h4>
            <p className="text-xs text-slate-600 font-medium">
              Ask how to incorporate Rajesh's prep recommendations into your staff shifts.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (onNavigateTab) onNavigateTab('ask-tg');
          }}
          className="btn-primary py-2.5 px-5 text-xs font-bold shadow-soft-glass cursor-pointer flex-shrink-0"
        >
          <span>Ask AI Chatbot</span>
        </button>
      </div>

    </div>
  );
};
