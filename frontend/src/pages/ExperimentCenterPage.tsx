import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Flame, 
  Target, 
  ArrowUpRight, 
  BotMessageSquare, 
  Sparkles, 
  Receipt, 
  UserCheck, 
  Plus, 
  Edit3, 
  X, 
  FileText,
  Check
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';

interface ExperimentCenterPageProps {
  onNavigateTab?: (tab: string) => void;
}

interface DailyProgressData {
  customers: number;
  revenue: number;
  orders: number;
  returningCustomers: number;
  customerGoal: number;
  dailyNote: string;
  savedAt: string;
}

export const ExperimentCenterPage: React.FC<ExperimentCenterPageProps> = ({ onNavigateTab }) => {
  const [dailyProgress, setDailyProgress] = useState<DailyProgressData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    customers: '',
    revenue: '',
    orders: '',
    returningCustomers: '',
    customerGoal: '',
    dailyNote: ''
  });

  // Load saved progress from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tg_daily_business_progress');
      if (saved) {
        setDailyProgress(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load daily progress from storage', e);
    }
  }, []);

  const handleOpenModal = () => {
    if (dailyProgress) {
      // Pre-fill with existing saved data
      setFormData({
        customers: dailyProgress.customers.toString(),
        revenue: dailyProgress.revenue.toString(),
        orders: dailyProgress.orders.toString(),
        returningCustomers: dailyProgress.returningCustomers.toString(),
        customerGoal: dailyProgress.customerGoal.toString(),
        dailyNote: dailyProgress.dailyNote || ''
      });
    } else {
      // Start fresh
      setFormData({
        customers: '',
        revenue: '',
        orders: '',
        returningCustomers: '',
        customerGoal: '',
        dailyNote: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveProgress = (e: React.FormEvent) => {
    e.preventDefault();

    const customers = parseInt(formData.customers, 10) || 0;
    const revenue = parseFloat(formData.revenue) || 0;
    const orders = parseInt(formData.orders, 10) || 0;
    const returningCustomers = parseInt(formData.returningCustomers, 10) || 0;
    const customerGoal = parseInt(formData.customerGoal, 10) || 100;
    const dailyNote = formData.dailyNote.trim();
    const savedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newProgress: DailyProgressData = {
      customers,
      revenue,
      orders,
      returningCustomers,
      customerGoal,
      dailyNote,
      savedAt
    };

    setDailyProgress(newProgress);
    try {
      localStorage.setItem('tg_daily_business_progress', JSON.stringify(newProgress));
    } catch (err) {
      console.error('Failed to save to localStorage', err);
    }

    setIsModalOpen(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Derived progress calculations
  const goal = dailyProgress?.customerGoal || 100;
  const customers = dailyProgress?.customers || 0;
  const revenue = dailyProgress?.revenue || 0;
  const orders = dailyProgress?.orders || 0;
  const returningCustomers = dailyProgress?.returningCustomers || 0;
  const dailyNote = dailyProgress?.dailyNote || '';

  const percentAchieved = Math.round((customers / (goal || 1)) * 100);
  const customersToGo = Math.max(0, goal - customers);
  const avgBill = orders > 0 ? Math.round(revenue / orders) : 0;

  // Chart pace data generated dynamically from actual saved count
  const hourlyProgressData = dailyProgress ? [
    { time: '10 AM', customers: Math.round(customers * 0.12), targetPace: Math.round(goal * 0.15) },
    { time: '12 PM', customers: Math.round(customers * 0.32), targetPace: Math.round(goal * 0.30) },
    { time: '2 PM', customers: Math.round(customers * 0.52), targetPace: Math.round(goal * 0.48) },
    { time: '4 PM', customers: Math.round(customers * 0.72), targetPace: Math.round(goal * 0.65) },
    { time: '6 PM', customers: Math.round(customers * 0.88), targetPace: Math.round(goal * 0.82) },
    { time: '8 PM', customers: customers, targetPace: goal },
  ] : [];

  return (
    <div className="space-y-4 max-w-[1600px] w-full mx-auto pb-14 text-navy">
      
      {/* ========================================================
          1. PAGE HEADER & PROGRESS ACTION BUTTON
          ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl glass-panel border border-white/80 shadow-soft-glass">
        <div>
          <h1 className="font-display font-extrabold text-xl sm:text-2xl text-navy">
            Today's Business Progress
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Your daily snapshot of customers, sales, goals, and business growth.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 flex-shrink-0 self-start sm:self-auto">
          {/* Prominent Action Button: + Add Today's Progress or Edit Today's Progress */}
          {dailyProgress ? (
            <button
              onClick={handleOpenModal}
              className="btn-primary py-2 px-3.5 text-xs font-bold shadow-soft-glass flex items-center space-x-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Today's Progress</span>
            </button>
          ) : (
            <button
              onClick={handleOpenModal}
              className="btn-primary py-2 px-4 text-xs font-bold shadow-soft-glass flex items-center space-x-1.5 cursor-pointer animate-pulse"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Add Today's Progress</span>
            </button>
          )}

          <div className="px-3 py-1.5 rounded-xl bg-white/70 backdrop-blur-md border border-white/90 text-right shadow-xs flex items-center space-x-2">
            <span className="text-xs font-bold text-navy">Thursday, 22 October 2026</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-growthgreen/15 text-growthgreen border border-growthgreen/30 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-growthgreen animate-pulse"></span>
              <span>Today</span>
            </span>
          </div>
        </div>
      </div>

      {/* Temporary Success Toast */}
      {saveSuccess && (
        <div className="p-3 rounded-xl bg-lightgreen border border-growthgreen/30 text-darkgreen text-xs font-bold flex items-center space-x-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-growthgreen" />
          <span>Today's business progress saved successfully!</span>
        </div>
      )}

      {/* ========================================================
          CASE A: NO DATA ENTERED YET (PROMPT STATE)
          ======================================================== */}
      {!dailyProgress && (
        <div className="glass-panel p-8 sm:p-12 rounded-[28px] border border-white/90 shadow-glass-panel text-center space-y-4 max-w-2xl mx-auto my-6">
          <div className="w-16 h-16 rounded-2xl bg-primaryblue/10 border border-primaryblue/20 flex items-center justify-center text-primaryblue mx-auto shadow-sm">
            <Target className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-display font-black text-xl sm:text-2xl text-navy">
              No progress recorded for today yet
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-medium">
              Manually enter your customer footfall, daily revenue, and shift targets to see your progress, key metrics, and daily focus.
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className="btn-primary py-3 px-6 text-sm font-bold shadow-soft-glass flex items-center space-x-2 mx-auto cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add Today's Progress</span>
          </button>
        </div>
      )}

      {/* ========================================================
          CASE B: SAVED DATA ENTERED (DASHBOARD DISPLAY)
          ======================================================== */}
      {dailyProgress && (
        <div className="space-y-4">

          {/* Section: Today's Progress Heading */}
          <div className="flex items-center justify-between px-1">
            <h2 className="font-display font-extrabold text-lg text-navy flex items-center space-x-2">
              <Target className="w-4 h-4 text-primaryblue" />
              <span>Today's Progress</span>
            </h2>
            {dailyProgress.savedAt && (
              <span className="text-[11px] text-slate-500 font-medium">
                Last updated at {dailyProgress.savedAt}
              </span>
            )}
          </div>

          {/* 2. TODAY'S PROGRESS SUMMARY (MAIN VISUAL FOCUS) */}
          <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/80 shadow-soft-glass bg-gradient-to-r from-white/90 via-lightblue/20 to-white/90 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-primaryblue flex items-center space-x-1.5">
                  <Target className="w-3.5 h-3.5 text-primaryblue" />
                  <span>Today's Goal</span>
                </span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="font-display font-black text-3xl sm:text-4xl text-navy">
                    {customers}
                  </span>
                  <span className="text-sm font-bold text-slate-500">
                    / {goal} Customers Today
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-primaryblue">
                  {percentAchieved}%
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  of today's target
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="h-4 w-full bg-slate-200/70 rounded-full overflow-hidden p-0.5 border border-slate-300/40">
                <div 
                  className="h-full bg-gradient-to-r from-primaryblue via-teal to-growthgreen rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${Math.min(100, Math.max(0, percentAchieved))}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600">{customers} customers reached</span>
                <span className={customersToGo > 0 ? "text-amber-600 font-bold" : "text-growthgreen font-bold"}>
                  {customersToGo > 0 ? `${customersToGo} customers to go` : "Target achieved! 🎉"}
                </span>
              </div>
            </div>
          </div>

          {/* 3. KEY DAILY NUMBERS (5 Compact Metric Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            
            {/* Card 1: Customers */}
            <div className="p-4 rounded-2xl bg-white/85 border border-white/90 shadow-xs flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-primaryblue" />
                  <span>Customers</span>
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                  customers >= goal 
                    ? 'bg-lightgreen text-darkgreen border-growthgreen/20' 
                    : percentAchieved >= 70
                    ? 'bg-lightblue text-darkblue border-primaryblue/20'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {customers >= goal ? 'Ahead' : percentAchieved >= 70 ? 'On Track' : 'Behind'}
                </span>
              </div>
              <div>
                <div className="font-display font-black text-2xl text-navy">{customers}</div>
                <div className="text-[11px] font-semibold text-slate-400 mt-0.5">Target: {goal}</div>
              </div>
            </div>

            {/* Card 2: Revenue */}
            <div className="p-4 rounded-2xl bg-white/85 border border-white/90 shadow-xs flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 flex items-center space-x-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-growthgreen" />
                  <span>Revenue</span>
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                  revenue >= 10000 
                    ? 'bg-lightgreen text-darkgreen border-growthgreen/20' 
                    : revenue >= 7000
                    ? 'bg-lightblue text-darkblue border-primaryblue/20'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {revenue >= 10000 ? 'Ahead' : revenue >= 7000 ? 'On Track' : 'Behind'}
                </span>
              </div>
              <div>
                <div className="font-display font-black text-2xl text-navy">₹{revenue.toLocaleString('en-IN')}</div>
                <div className="text-[11px] font-semibold text-slate-400 mt-0.5">Target: ₹10,000</div>
              </div>
            </div>

            {/* Card 3: Orders */}
            <div className="p-4 rounded-2xl bg-white/85 border border-white/90 shadow-xs flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 flex items-center space-x-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-teal" />
                  <span>Orders</span>
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                  orders >= 75 
                    ? 'bg-lightgreen text-darkgreen border-growthgreen/20' 
                    : orders >= 50
                    ? 'bg-lightblue text-darkblue border-primaryblue/20'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {orders >= 75 ? 'Ahead' : orders >= 50 ? 'On Track' : 'Behind'}
                </span>
              </div>
              <div>
                <div className="font-display font-black text-2xl text-navy">{orders}</div>
                <div className="text-[11px] font-semibold text-slate-400 mt-0.5">Target: 75</div>
              </div>
            </div>

            {/* Card 4: Average Bill */}
            <div className="p-4 rounded-2xl bg-white/85 border border-white/90 shadow-xs flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 flex items-center space-x-1.5">
                  <Receipt className="w-3.5 h-3.5 text-primaryblue" />
                  <span>Average Bill</span>
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                  avgBill >= 150 
                    ? 'bg-lightgreen text-darkgreen border-growthgreen/20' 
                    : 'bg-lightblue text-darkblue border-primaryblue/20'
                }`}>
                  {avgBill >= 150 ? 'Ahead' : 'On Track'}
                </span>
              </div>
              <div>
                <div className="font-display font-black text-2xl text-navy">₹{avgBill}</div>
                <div className="text-[11px] font-semibold text-slate-400 mt-0.5">Target: ₹150</div>
              </div>
            </div>

            {/* Card 5: Returning Customers */}
            <div className="p-4 rounded-2xl bg-white/85 border border-white/90 shadow-xs flex flex-col justify-between space-y-2 col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 flex items-center space-x-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Returning Customers</span>
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                  returningCustomers >= 30 
                    ? 'bg-lightgreen text-darkgreen border-growthgreen/20' 
                    : returningCustomers >= 20
                    ? 'bg-lightblue text-darkblue border-primaryblue/20'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {returningCustomers >= 30 ? 'Ahead' : 'Behind'}
                </span>
              </div>
              <div>
                <div className="font-display font-black text-2xl text-navy">{returningCustomers}</div>
                <div className="text-[11px] font-semibold text-slate-400 mt-0.5">Target: 30</div>
              </div>
            </div>

          </div>

          {/* 4. TODAY VS TARGET & 5. BUSINESS HEALTH (2 Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Left: Today's Progress (Target Bars) */}
            <div className="glass-panel p-5 rounded-2xl border border-white/80 shadow-soft-glass space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="font-display font-extrabold text-base text-navy flex items-center space-x-2">
                  <Target className="w-4 h-4 text-primaryblue" />
                  <span>Target Progress</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-semibold">Shift Metrics</span>
              </div>

              <div className="space-y-3.5">
                {/* Customers */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-navy">Customers</span>
                    <span className="text-primaryblue">{customers} / {goal} <span className="text-slate-400 font-normal">({percentAchieved}%)</span></span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primaryblue rounded-full" style={{ width: `${Math.min(100, percentAchieved)}%` }} />
                  </div>
                </div>

                {/* Revenue */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-navy">Revenue</span>
                    <span className="text-growthgreen">₹{revenue.toLocaleString('en-IN')} / ₹10,000 <span className="text-slate-400 font-normal">({Math.round((revenue / 10000) * 100)}%)</span></span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-growthgreen rounded-full" style={{ width: `${Math.min(100, Math.round((revenue / 10000) * 100))}%` }} />
                  </div>
                </div>

                {/* Orders */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-navy">Orders</span>
                    <span className="text-teal">{orders} / 75 <span className="text-slate-400 font-normal">({Math.round((orders / 75) * 100)}%)</span></span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal rounded-full" style={{ width: `${Math.min(100, Math.round((orders / 75) * 100))}%` }} />
                  </div>
                </div>

                {/* Returning Customers */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-navy">Returning Customers</span>
                    <span className="text-amber-600">{returningCustomers} / 30 <span className="text-slate-400 font-normal">({Math.round((returningCustomers / 30) * 100)}%)</span></span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, Math.round((returningCustomers / 30) * 100))}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Business Health (4 Practical Indicators) */}
            <div className="glass-panel p-5 rounded-2xl border border-white/80 shadow-soft-glass space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="font-display font-extrabold text-base text-navy flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-growthgreen" />
                  <span>Business Health</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-semibold">vs Previous Week</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/80 border border-white/90 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 block">Customer Growth</span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-display font-extrabold text-xl text-growthgreen">+18%</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-lightgreen text-darkgreen">
                      Growing
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">Strong daytime footfall</span>
                </div>

                <div className="p-3 rounded-xl bg-white/80 border border-white/90 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 block">Sales Growth</span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-display font-extrabold text-xl text-growthgreen">+12%</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-lightgreen text-darkgreen">
                      Growing
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">Upward ticket trajectory</span>
                </div>

                <div className="p-3 rounded-xl bg-white/80 border border-white/90 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 block">Repeat Customers</span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-display font-extrabold text-xl text-primaryblue">+8%</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-lightblue text-darkblue">
                      Stable
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">Healthy core audience</span>
                </div>

                <div className="p-3 rounded-xl bg-white/80 border border-white/90 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 block">Average Order Value</span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-display font-extrabold text-xl text-primaryblue">+5%</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-lightblue text-darkblue">
                      Stable
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">₹{avgBill || 146} average spend</span>
                </div>
              </div>
            </div>

          </div>

          {/* Daily Note (If written by business owner) */}
          {dailyNote && (
            <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-primaryblue/20 bg-lightblue/20 shadow-xs flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-primaryblue text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-extrabold uppercase text-primaryblue tracking-wider">
                    Owner's Daily Shift Note
                  </span>
                  <span className="text-[10px] text-slate-400">• Recorded today</span>
                </div>
                <p className="text-xs sm:text-sm text-navy font-medium leading-relaxed">
                  "{dailyNote}"
                </p>
              </div>
            </div>
          )}

          {/* 6. WHAT SHOULD I FOCUS ON TODAY? */}
          <div className="glass-panel p-5 rounded-2xl border border-white/80 shadow-soft-glass space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-display font-extrabold text-base text-navy flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-warningorange" />
                <span>Today's Focus</span>
              </h3>
              <span className="text-xs text-slate-500 font-semibold">Actionable priorities for your shift</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              
              {/* Priority 1 */}
              <div className="p-4 rounded-xl bg-white/85 border border-white/90 space-y-2 shadow-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-primaryblue text-white font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                    1
                  </span>
                  <h4 className="font-bold text-navy text-xs sm:text-sm">
                    {customersToGo > 0 ? `Bring in ${customersToGo} more customers` : "Maintain evening customer pace"}
                  </h4>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed">
                  {customersToGo > 0 
                    ? `You are currently at ${percentAchieved}% of today's customer target (${customers} / ${goal}).`
                    : `You have successfully hit your target of ${goal} customers today!`
                  }
                </p>
                <div className="p-2.5 rounded-lg bg-lightblue/40 border border-primaryblue/20 text-slate-700">
                  <span className="font-extrabold text-primaryblue block text-[10px] uppercase tracking-wider">Suggested action</span>
                  Promote the evening student combo between 4 PM–8 PM.
                </div>
              </div>

              {/* Priority 2 */}
              <div className="p-4 rounded-xl bg-white/85 border border-white/90 space-y-2 shadow-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-primaryblue text-white font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                    2
                  </span>
                  <h4 className="font-bold text-navy text-xs sm:text-sm">
                    Increase evening orders
                  </h4>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Evening traffic is currently running below your expected pace.
                </p>
                <div className="p-2.5 rounded-lg bg-lightgreen/40 border border-growthgreen/20 text-slate-700">
                  <span className="font-extrabold text-growthgreen block text-[10px] uppercase tracking-wider">Suggested action</span>
                  Promote your highest-performing combo during 5 PM–8 PM.
                </div>
              </div>

              {/* Priority 3 */}
              <div className="p-4 rounded-xl bg-white/85 border border-white/90 space-y-2 shadow-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-primaryblue text-white font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                    3
                  </span>
                  <h4 className="font-bold text-navy text-xs sm:text-sm">
                    Improve repeat visits
                  </h4>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed">
                  You have {returningCustomers} returning customers against a target of 30 today.
                </p>
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-slate-700">
                  <span className="font-extrabold text-amber-700 block text-[10px] uppercase tracking-wider">Suggested action</span>
                  Offer a simple returning-customer incentive on bill counter.
                </div>
              </div>

            </div>
          </div>

          {/* 7. WHAT'S WORKING & 8. NEEDS ATTENTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Left: What's Working Today? */}
            <div className="glass-panel p-5 rounded-2xl border border-white/80 shadow-soft-glass space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="font-display font-extrabold text-base text-navy flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-growthgreen" />
                  <span>What's Working Today?</span>
                </h3>
                <span className="text-[11px] font-semibold text-slate-400">Strongest drivers</span>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-white/80 border border-white/90 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-lg">🔥</span>
                    <div>
                      <div className="font-bold text-xs text-navy">Loaded Fries Combo</div>
                      <div className="text-[11px] text-slate-500">Top selling commercial item</div>
                    </div>
                  </div>
                  <div className="font-extrabold text-xs text-growthgreen bg-lightgreen px-2.5 py-1 rounded-lg">
                    42 orders
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/80 border border-white/90 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-lg">☕</span>
                    <div>
                      <div className="font-bold text-xs text-navy">Cold Coffee</div>
                      <div className="text-[11px] text-slate-500">Steady afternoon beverage</div>
                    </div>
                  </div>
                  <div className="font-extrabold text-xs text-growthgreen bg-lightgreen px-2.5 py-1 rounded-lg">
                    28 orders
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/80 border border-white/90 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-lg">👥</span>
                    <div>
                      <div className="font-bold text-xs text-navy">Evening Customers</div>
                      <div className="text-[11px] text-slate-500">Peak footfall window</div>
                    </div>
                  </div>
                  <div className="font-extrabold text-xs text-growthgreen bg-lightgreen px-2.5 py-1 rounded-lg">
                    +24% vs last week
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/80 border border-white/90 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-lg">📈</span>
                    <div>
                      <div className="font-bold text-xs text-navy">Student Customers</div>
                      <div className="text-[11px] text-slate-500">Core campus demographic</div>
                    </div>
                  </div>
                  <div className="font-extrabold text-xs text-growthgreen bg-lightgreen px-2.5 py-1 rounded-lg">
                    +18% vs last week
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Needs Attention */}
            <div className="glass-panel p-5 rounded-2xl border border-white/80 shadow-soft-glass space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="font-display font-extrabold text-base text-navy flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Needs Attention</span>
                </h3>
                <span className="text-[11px] font-semibold text-slate-400">Key gaps to bridge</span>
              </div>

              <div className="space-y-2.5">
                {customersToGo > 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start space-x-3">
                    <span className="text-base flex-shrink-0 mt-0.5">⚠️</span>
                    <div>
                      <div className="font-bold text-xs text-amber-900">
                        Customer target is {customersToGo} customers behind
                      </div>
                      <div className="text-[11px] text-amber-800/80 mt-0.5 leading-relaxed">
                        Requires accelerated dinner rush uptake between 6:00 PM and 9:30 PM.
                      </div>
                    </div>
                  </div>
                )}

                {revenue < 10000 && (
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start space-x-3">
                    <span className="text-base flex-shrink-0 mt-0.5">⚠️</span>
                    <div>
                      <div className="font-bold text-xs text-amber-900">
                        Revenue is ₹{(10000 - revenue).toLocaleString('en-IN')} below today's target
                      </div>
                      <div className="text-[11px] text-amber-800/80 mt-0.5 leading-relaxed">
                        Upsell add-on dips or drinks to lift average ticket size towards ₹150+.
                      </div>
                    </div>
                  </div>
                )}

                {returningCustomers < 30 && (
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start space-x-3">
                    <span className="text-base flex-shrink-0 mt-0.5">⚠️</span>
                    <div>
                      <div className="font-bold text-xs text-amber-900">
                        Repeat customers are {30 - returningCustomers} below target
                      </div>
                      <div className="text-[11px] text-amber-800/80 mt-0.5 leading-relaxed">
                        {returningCustomers} returning customers vs goal of 30. Mention next-visit discounts on payment.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* 9. DAILY PROGRESS GRAPH (Only shown when saved data exists) */}
          <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/80 shadow-soft-glass space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="font-display font-extrabold text-base text-navy flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-primaryblue" />
                  <span>Business Progress Today</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Hourly customer progress towards today's {goal} customer target.
                </p>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primaryblue"></span>
                  <span className="font-bold text-slate-600">Customers ({customers})</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-0.5 bg-growthgreen"></span>
                  <span className="font-bold text-growthgreen">Goal ({goal})</span>
                </span>
              </div>
            </div>

            <div className="h-56 sm:h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyProgressData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="customerGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, Math.max(goal + 10, customers + 10)]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg space-y-1">
                            <div className="font-bold text-slate-300">{label}</div>
                            {data.customers !== undefined && (
                              <div className="text-primaryblue font-extrabold">Customers: {data.customers}</div>
                            )}
                            <div className="text-growthgreen text-[10px]">Target: {goal}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine y={goal} stroke="#10B981" strokeDasharray="4 4" label={{ value: `Target: ${goal}`, fill: '#10B981', fontSize: 11, position: 'top' }} />
                  <Area 
                    type="monotone" 
                    dataKey="customers" 
                    stroke="#2563EB" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#customerGrad)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 10. END-OF-DAY SUMMARY & TOMORROW'S PRIORITY */}
          <div className="glass-panel p-5 rounded-2xl border border-white/80 shadow-soft-glass space-y-3">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="font-display font-extrabold text-base text-navy">
                Daily Business Summary
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Today's performance & priority for FreshBite Café
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="p-4 rounded-xl bg-white/80 border border-white/90 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Today's Result
                </div>
                <div className="flex items-center space-x-4 text-xs font-bold text-navy">
                  <div>Customers: <span className="text-primaryblue">{customers} / {goal}</span></div>
                  <div>Revenue: <span className="text-growthgreen">₹{revenue.toLocaleString('en-IN')}</span></div>
                  <div>Orders: <span className="text-teal">{orders}</span></div>
                </div>
                <p className="font-bold text-sm text-navy leading-snug pt-1">
                  {customersToGo > 0 
                    ? "You're on track, but evening customer traffic needs attention." 
                    : "Outstanding day! Today's customer target has been successfully met."
                  }
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-lightblue/30 to-lightgreen/30 border border-primaryblue/20 space-y-1">
                <div className="text-xs font-extrabold uppercase tracking-wider text-primaryblue flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tomorrow's Priority</span>
                </div>
                <h4 className="font-display font-black text-base text-navy leading-snug">
                  Increase evening customer visits.
                </h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Launch pre-order promotions for 4 PM–8 PM transit commuters and offer combo punch-cards to boost repeat footfall.
                </p>
              </div>
            </div>
          </div>

          {/* 11. AI BUSINESS ADVISOR CALLOUT */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-primaryblue/30 bg-gradient-to-r from-lightblue/40 via-white/80 to-lightgreen/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-soft-glass">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-primaryblue text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <BotMessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-display font-extrabold text-xs sm:text-sm text-navy">
                  Ask T→G Advisor
                </h4>
                <p className="text-xs text-slate-600 font-medium italic">
                  "What should I focus on tomorrow?"
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (onNavigateTab) onNavigateTab('ask-tg');
              }}
              className="btn-primary py-2 px-4 text-xs font-bold shadow-soft-glass cursor-pointer flex-shrink-0 self-start sm:self-auto flex items-center space-x-1.5"
            >
              <span>Open AI Advisor</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT TODAY'S PROGRESS
          ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg glass-panel bg-white/98 backdrop-blur-2xl p-6 sm:p-7 rounded-[28px] border border-white shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-black text-lg text-navy">
                  Today's Progress
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Record daily business numbers for Thursday, 22 October 2026
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl glass-card text-slate-400 hover:text-navy cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProgress} className="space-y-4">
              
              {/* 👥 Customers Today */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy flex items-center space-x-1.5">
                  <span className="text-base">👥</span>
                  <span>Customers Today</span>
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="Enter number of customers (e.g. 72)"
                  value={formData.customers}
                  onChange={(e) => setFormData({ ...formData, customers: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primaryblue bg-white"
                />
              </div>

              {/* 💰 Revenue Today */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy flex items-center space-x-1.5">
                  <span className="text-base">💰</span>
                  <span>Revenue Today (₹)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="Enter amount in ₹ (e.g. 8450)"
                  value={formData.revenue}
                  onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primaryblue bg-white"
                />
              </div>

              {/* 🧾 Orders Today */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy flex items-center space-x-1.5">
                  <span className="text-base">🧾</span>
                  <span>Orders Today</span>
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="Enter number of orders (e.g. 58)"
                  value={formData.orders}
                  onChange={(e) => setFormData({ ...formData, orders: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primaryblue bg-white"
                />
              </div>

              {/* 🔁 Returning Customers */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy flex items-center space-x-1.5">
                  <span className="text-base">🔁</span>
                  <span>Returning Customers</span>
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="Enter repeat customers (e.g. 24)"
                  value={formData.returningCustomers}
                  onChange={(e) => setFormData({ ...formData, returningCustomers: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primaryblue bg-white"
                />
              </div>

              {/* 🎯 Today's Goal */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy flex items-center space-x-1.5">
                  <span className="text-base">🎯</span>
                  <span>Today's Goal (Customer Target)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="Enter target customer goal (e.g. 100)"
                  value={formData.customerGoal}
                  onChange={(e) => setFormData({ ...formData, customerGoal: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primaryblue bg-white"
                />
              </div>

              {/* 📝 Daily Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy flex items-center space-x-1.5">
                  <span className="text-base">📝</span>
                  <span>Daily Note</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Write what happened today (e.g. Loaded fries combo was our top seller between 4 PM–8 PM)"
                  value={formData.dailyNote}
                  onChange={(e) => setFormData({ ...formData, dailyNote: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primaryblue bg-white resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl glass-card text-xs font-bold text-slate-600 hover:text-navy cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold shadow-soft-glass cursor-pointer"
                >
                  Save Today's Progress
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

// Export alias for semantic naming
export const GrowthTrackingPage = ExperimentCenterPage;
