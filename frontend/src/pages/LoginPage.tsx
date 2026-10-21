import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  UserCheck, 
  ShieldCheck, 
  Layers, 
  AlertCircle,
  Building2,
  MapPin,
  Users,
  ShoppingBag,
  Target,
  Sparkles,
  TrendingUp,
  Globe,
  HelpCircle,
  Tag
} from 'lucide-react';
import { api } from '../services/api/client';
import { UserRole } from '../types';
import tgLogo from '../assets/trend-to-growth-logo-transparent.png';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole) => void;
  onNavigateHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 1. Account Information
  const [fullName, setFullName] = useState('Gayatri Patil');
  const [email, setEmail] = useState('gayatri@freshbite.cafe');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 2. Business Information
  const [businessName, setBusinessName] = useState('FreshBite Café');
  const [businessType, setBusinessType] = useState('Restaurant / Café');
  const [industry, setIndustry] = useState('Food & Beverage');
  const [city, setCity] = useState('Pune');
  const [stateRegion, setStateRegion] = useState('Maharashtra');
  const [country, setCountry] = useState('India');

  // 3. Customer Information
  const [targetCustomers, setTargetCustomers] = useState('College students and young working professionals');
  const [targetMarketGeo, setTargetMarketGeo] = useState('City');
  const [customerAgeGroup, setCustomerAgeGroup] = useState('18–24');

  // 4. Products & Offerings
  const [productsServices, setProductsServices] = useState('Cold brews, artisanal sandwiches, pastries, and healthy grab-and-go bowls.');
  const [uniqueOffering, setUniqueOffering] = useState('Locally-roasted organic beans with zero-sugar signature syrups.');
  const [priceRange, setPriceRange] = useState('Mid-range');

  // 5. Business Position
  const [businessGoal, setBusinessGoal] = useState('Increase Sales');
  const [businessChallenge, setBusinessChallenge] = useState('Growing footfall and beverage orders during late-afternoon and evening hours.');
  const [businessStage, setBusinessStage] = useState('Growing');

  // 6. Trend Intelligence
  const [trendInterests, setTrendInterests] = useState<string[]>([
    'Consumer Trends',
    'Product Trends',
    'Social Media Trends',
    'Local Market Trends'
  ]);
  const [competitors, setCompetitors] = useState('Third Wave Coffee, Blue Tokai, local artisan cafes');
  const [marketingChannels, setMarketingChannels] = useState<string[]>([
    'Instagram',
    'Google',
    'WhatsApp'
  ]);
  const [seasonalPatterns, setSeasonalPatterns] = useState('Summer iced beverage surge; college semester exam periods see heavy evening study group traffic.');

  // 7. Optional Business Context
  const [websiteUrl, setWebsiteUrl] = useState('https://freshbite.cafe');
  const [socialMediaUrl, setSocialMediaUrl] = useState('@freshbite.cafe');
  const [monthlyVolume, setMonthlyVolume] = useState('2,000 – 10,000');
  const [businessSize, setBusinessSize] = useState('Small');
  const [yearsInBusiness, setYearsInBusiness] = useState('1–3 years');

  // 8. Final AI Context Question
  const [additionalAiContext, setAdditionalAiContext] = useState('Looking to introduce a health-focused grab-and-go evening menu tailored for fitness-conscious young adults in Pune.');

  // Quick helper options
  const businessTypes = [
    'Retail',
    'Restaurant / Café',
    'E-commerce',
    'Manufacturing',
    'Service',
    'Technology',
    'Healthcare',
    'Education',
    'Finance',
    'Agriculture',
    'Hospitality',
    'Logistics',
    'Other'
  ];

  const industryPresets = [
    'Food & Beverage',
    'Fashion',
    'Beauty & Cosmetics',
    'Electronics',
    'Travel & Tourism',
    'Automotive',
    'Real Estate',
    'Education & EdTech',
    'Fitness & Wellness',
    'Home & Living',
    'Healthcare',
    'Professional Services',
    'Other'
  ];

  const targetCustomerPresets = [
    'College students',
    'Working professionals',
    'Families',
    'Small businesses',
    'Premium customers',
    'Local consumers'
  ];

  const targetMarkets = [
    'Local',
    'City',
    'State',
    'India',
    'International'
  ];

  const ageGroups = [
    'Any / All Ages',
    'Under 18',
    '18–24',
    '25–34',
    '35–44',
    '45–54',
    '55+'
  ];

  const priceRanges = [
    'Budget',
    'Affordable',
    'Mid-range',
    'Premium',
    'Luxury'
  ];

  const businessGoals = [
    'Increase Sales',
    'Find New Customers',
    'Launch New Products',
    'Improve Customer Retention',
    'Expand to New Markets',
    'Increase Brand Awareness',
    'Discover New Opportunities',
    'Reduce Costs',
    'Other'
  ];

  const businessStages = [
    'New / Starting',
    'Growing',
    'Established',
    'Expanding'
  ];

  const availableTrendInterests = [
    'Consumer Trends',
    'Product Trends',
    'Social Media Trends',
    'Technology Trends',
    'Local Market Trends',
    'Competitor Trends',
    'Pricing Trends',
    'Seasonal Trends',
    'Search Trends',
    'E-commerce Trends',
    'Sustainability Trends',
    'Emerging Customer Needs',
    'Other'
  ];

  const availableMarketingChannels = [
    'Instagram',
    'Facebook',
    'YouTube',
    'TikTok',
    'Google',
    'Website',
    'WhatsApp',
    'Email',
    'Offline',
    'Other'
  ];

  const businessSizes = [
    'Solo',
    'Small',
    'Medium',
    'Large'
  ];

  const yearsInBusinessOptions = [
    '< 1 year',
    '1–3 years',
    '3–5 years',
    '5+ years'
  ];

  const toggleTrendInterest = (interest: string) => {
    setTrendInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleMarketingChannel = (channel: string) => {
    setMarketingChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  };

  const addCustomerPreset = (preset: string) => {
    if (!targetCustomers.includes(preset)) {
      setTargetCustomers((prev) => prev ? `${prev}, ${preset}` : preset);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!fullName.trim()) {
      errors.fullName = 'Full Name is required.';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email format (e.g. name@domain.com).';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    } else if (!/\d/.test(password)) {
      errors.password = 'Password must contain at least one number.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required.';
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!businessName.trim()) {
      errors.businessName = 'Business Name is required.';
    }

    if (!businessType.trim()) {
      errors.businessType = 'Business Type is required.';
    }

    if (!industry.trim()) {
      errors.industry = 'Industry / Category is required.';
    }

    if (!city.trim() || !stateRegion.trim() || !country.trim()) {
      errors.location = 'City, State/Region, and Country are all required for local trend discovery.';
    }

    if (!targetCustomers.trim()) {
      errors.targetCustomers = 'Target Customers is required.';
    }

    if (!productsServices.trim()) {
      errors.productsServices = 'Products / Services description is required.';
    }

    if (!businessGoal.trim()) {
      errors.businessGoal = 'Primary Business Goal is required.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isRegister) {
      const isValid = validateForm();
      if (!isValid) {
        setErrorMsg('Please complete all required fields indicated in red below.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isRegister) {
        await api.switchRole('BUSINESS');
        try {
          await api.updateBusinessProfile({
            business_name: businessName,
            business_type: businessType,
            industry: industry,
            location: `${city}, ${stateRegion}, ${country}`,
            target_customers: targetCustomers,
            target_market: targetMarketGeo,
            business_goal: businessGoal,
            description: [
              productsServices,
              uniqueOffering ? `Unique Offering: ${uniqueOffering}` : '',
              businessChallenge ? `Current Challenge: ${businessChallenge}` : '',
              additionalAiContext ? `Additional AI Context: ${additionalAiContext}` : '',
            ].filter(Boolean).join('\n\n'),
            products_services: productsServices.split(',').map((s) => s.trim()).filter(Boolean),
            platforms: marketingChannels,
          });
        } catch (saveErr) {
          console.warn('Profile save warning (demo mode):', saveErr);
        }
        onLoginSuccess('BUSINESS');
      } else {
        await api.switchRole('BUSINESS');
        onLoginSuccess('BUSINESS');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: UserRole, demoEmail: string) => {
    setLoading(true);
    setErrorMsg('');
    setEmail(demoEmail);

    try {
      await api.switchRole(role);
      onLoginSuccess(role);
    } catch (err: any) {
      setErrorMsg(err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ambient-bg relative flex flex-col items-center justify-center p-4 sm:p-8 lg:p-10 selection:bg-growth-100 selection:text-growth-800">
      {/* Uploaded Logo Fixed in Top-Left Corner (~40px padding from top & left) */}
      <div className="fixed top-6 left-6 sm:top-10 sm:left-10 z-20">
        <button
          type="button"
          onClick={onNavigateHome}
          className="cursor-pointer transition-opacity hover:opacity-90 focus:outline-none block"
          title="Back to Home"
        >
          <img
            src={tgLogo}
            alt="Trend to Growth"
            className="h-14 sm:h-16 md:h-20 w-auto object-contain drop-shadow-sm"
          />
        </button>
      </div>

      {/* Main Login/Register Content Centered in Viewport */}
      <div className={`w-full ${isRegister ? 'max-w-3xl' : 'max-w-lg'} space-y-4 my-auto transition-all duration-300`}>
        {/* Welcome Text */}
        <div className="text-center space-y-1">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-navy">
            {isRegister ? 'Create your T to G account' : 'Welcome back to T to G'}
          </h2>
          {isRegister && (
            <p className="text-xs text-slate-500 max-w-xl mx-auto">
              Configure your business profile so the T to G AI engine can detect high-velocity market trends tailored to your local geography and customers.
            </p>
          )}
        </div>

        {/* Main Glassmorphic Auth Card */}
        <div className="glass-panel p-5 sm:p-7 rounded-[28px] border border-white/80 shadow-soft-glass space-y-4">
          {/* Quick Demo Login Options */}
          <div className="p-3 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-sm">
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('BUSINESS', 'gayatri@freshbite.cafe')}
                className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-left border border-white/90 shadow-sm transition-all hover:scale-[1.02] hover:border-growth/40"
              >
                <div className="flex items-center space-x-1 text-growth font-bold text-xs">
                  <UserCheck className="w-3.5 h-3.5 text-growth" />
                  <span>Business</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">FreshBite Café</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('EXPERT', 'rajesh@growthworks.in')}
                className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-left border border-white/90 shadow-sm transition-all hover:scale-[1.02] hover:border-primary-blue/40"
              >
                <div className="flex items-center space-x-1 text-primary-blue font-bold text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary-blue" />
                  <span>Expert</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">Retail Strategist</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ADMIN', 'admin@trendtogrowth.com')}
                className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-left border border-white/90 shadow-sm transition-all hover:scale-[1.02] hover:border-amber-400/40"
              >
                <div className="flex items-center space-x-1 text-amber-700 font-bold text-xs">
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  <span>Admin</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">Ops Mission Ctrl</div>
              </button>
            </div>
          </div>

          {/* Toggle between Sign In / Sign Up */}
          <div className="flex rounded-2xl bg-slate-200/50 p-1 border border-white/70 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setErrorMsg('');
                setFormErrors({});
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                !isRegister ? 'bg-white text-navy shadow-sm font-bold' : 'text-slate-600 hover:text-navy'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setErrorMsg('');
                setFormErrors({});
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                isRegister ? 'bg-white text-navy shadow-sm font-bold' : 'text-slate-600 hover:text-navy'
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {resetSent && (
            <div className="p-3.5 rounded-xl bg-light-green border border-growth/20 text-dark-green text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-growth" />
              <span>Demo password reset link dispatched to {email}.</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister ? (
              /* ==========================================================
                 COMPREHENSIVE CREATE ACCOUNT FORM (SCROLLABLE & STRUCTURED)
                 ========================================================== */
              <div className="max-h-[64vh] sm:max-h-[68vh] overflow-y-auto pr-1.5 space-y-6">
                
                {/* 1. ACCOUNT INFORMATION */}
                <div className="p-4 rounded-2xl bg-white/60 border border-white/80 space-y-3.5">
                  <div className="flex items-center space-x-2 pb-1 border-b border-slate-200/60">
                    <span className="w-5 h-5 rounded-full bg-primary-blue text-white text-[11px] font-bold flex items-center justify-center">1</span>
                    <h3 className="font-display font-bold text-xs uppercase tracking-wider text-navy">Account Information</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: '' });
                        }}
                        placeholder="Enter your full name"
                        className={`w-full px-3.5 py-2 text-xs rounded-xl border bg-white/90 focus:outline-none focus:ring-2 font-medium text-navy ${
                          formErrors.fullName
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                            : 'border-slate-200/80 focus:border-primary-blue focus:ring-primary-blue/20'
                        }`}
                      />
                      {formErrors.fullName && (
                        <p className="text-[10px] text-rose-500 font-medium mt-1">{formErrors.fullName}</p>
                      )}
                    </div>

                    {/* Work Email Address */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Work Email Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                          }}
                          placeholder="owner@yourbusiness.com"
                          className={`w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border bg-white/90 focus:outline-none focus:ring-2 font-medium text-navy ${
                            formErrors.email
                              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                              : 'border-slate-200/80 focus:border-primary-blue focus:ring-primary-blue/20'
                          }`}
                        />
                      </div>
                      {formErrors.email && (
                        <p className="text-[10px] text-rose-500 font-medium mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Password <span className="text-rose-500">*</span> <span className="text-[10px] text-slate-400 font-normal">(min 8 chars, 1 number)</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (formErrors.password) setFormErrors({ ...formErrors, password: '' });
                          }}
                          placeholder="••••••••"
                          className={`w-full pl-9 pr-9 py-2 text-xs rounded-xl border bg-white/90 focus:outline-none focus:ring-2 font-medium text-navy ${
                            formErrors.password
                              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                              : 'border-slate-200/80 focus:border-primary-blue focus:ring-primary-blue/20'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      {formErrors.password && (
                        <p className="text-[10px] text-rose-500 font-medium mt-1">{formErrors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Confirm Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (formErrors.confirmPassword) setFormErrors({ ...formErrors, confirmPassword: '' });
                          }}
                          placeholder="••••••••"
                          className={`w-full pl-9 pr-9 py-2 text-xs rounded-xl border bg-white/90 focus:outline-none focus:ring-2 font-medium text-navy ${
                            formErrors.confirmPassword
                              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                              : 'border-slate-200/80 focus:border-primary-blue focus:ring-primary-blue/20'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      {formErrors.confirmPassword && (
                        <p className="text-[10px] text-rose-500 font-medium mt-1">{formErrors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. BUSINESS INFORMATION */}
                <div className="p-4 rounded-2xl bg-white/60 border border-white/80 space-y-3.5">
                  <div className="flex items-center space-x-2 pb-1 border-b border-slate-200/60">
                    <span className="w-5 h-5 rounded-full bg-primary-blue text-white text-[11px] font-bold flex items-center justify-center">2</span>
                    <h3 className="font-display font-bold text-xs uppercase tracking-wider text-navy">Business Information</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Business Name */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Business Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => {
                          setBusinessName(e.target.value);
                          if (formErrors.businessName) setFormErrors({ ...formErrors, businessName: '' });
                        }}
                        placeholder="Enter your business name"
                        className={`w-full px-3.5 py-2 text-xs rounded-xl border bg-white/90 focus:outline-none focus:ring-2 font-medium text-navy ${
                          formErrors.businessName
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                            : 'border-slate-200/80 focus:border-primary-blue focus:ring-primary-blue/20'
                        }`}
                      />
                      {formErrors.businessName && (
                        <p className="text-[10px] text-rose-500 font-medium mt-1">{formErrors.businessName}</p>
                      )}
                    </div>

                    {/* Business Type */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Business Type <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={businessType}
                        onChange={(e) => {
                          setBusinessType(e.target.value);
                          if (formErrors.businessType) setFormErrors({ ...formErrors, businessType: '' });
                        }}
                        className={`w-full px-3.5 py-2 text-xs rounded-xl border bg-white/90 focus:outline-none focus:ring-2 font-medium text-navy ${
                          formErrors.businessType
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                            : 'border-slate-200/80 focus:border-primary-blue focus:ring-primary-blue/20'
                        }`}
                      >
                        <option value="">Select Business Type</option>
                        {businessTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {formErrors.businessType && (
                        <p className="text-[10px] text-rose-500 font-medium mt-1">{formErrors.businessType}</p>
                      )}
                    </div>

                    {/* Industry / Category */}
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Industry / Category <span className="text-rose-500">*</span> <span className="text-[10px] text-slate-400 font-normal">(select preset or type specific category)</span>
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <select
                          value={industryPresets.includes(industry) ? industry : 'Other'}
                          onChange={(e) => {
                            if (e.target.value !== 'Other') {
                              setIndustry(e.target.value);
                              if (formErrors.industry) setFormErrors({ ...formErrors, industry: '' });
                            }
                          }}
                          className="sm:w-1/2 px-3.5 py-2 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue font-medium text-navy"
                        >
                          {industryPresets.map((ind) => (
                            <option key={ind} value={ind}>{ind}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={industry}
                          onChange={(e) => {
                            setIndustry(e.target.value);
                            if (formErrors.industry) setFormErrors({ ...formErrors, industry: '' });
                          }}
                          placeholder="e.g. Food & Beverage, Fashion, Fitness"
                          className={`sm:w-1/2 px-3.5 py-2 text-xs rounded-xl border bg-white/90 focus:outline-none focus:ring-2 font-medium text-navy ${
                            formErrors.industry
                              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                              : 'border-slate-200/80 focus:border-primary-blue focus:ring-primary-blue/20'
                          }`}
                        />
                      </div>
                      {formErrors.industry && (
                        <p className="text-[10px] text-rose-500 font-medium mt-1">{formErrors.industry}</p>
                      )}
                    </div>

                    {/* Business Location (City, State, Country) */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-semibold text-slate-700">
                          Business Location <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-slate-400 font-medium">Used for local & regional trend intelligence</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => {
                              setCity(e.target.value);
                              if (formErrors.location) setFormErrors({ ...formErrors, location: '' });
                            }}
                            placeholder="City (e.g. Pune)"
                            className={`w-full px-3.5 py-2 text-xs rounded-xl border bg-white/90 focus:outline-none focus:ring-2 font-medium text-navy ${
                              formErrors.location
                                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                                : 'border-slate-200/80 focus:border-primary-blue focus:ring-primary-blue/20'
                            }`}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={stateRegion}
                            onChange={(e) => {
                              setStateRegion(e.target.value);
                              if (formErrors.location) setFormErrors({ ...formErrors, location: '' });
                            }}
                            placeholder="State/Region (e.g. Maharashtra)"
                            className={`w-full px-3.5 py-2 text-xs rounded-xl border bg-white/90 focus:outline-none focus:ring-2 font-medium text-navy ${
                              formErrors.location
                                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                                : 'border-slate-200/80 focus:border-primary-blue focus:ring-primary-blue/20'
                            }`}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={country}
                            onChange={(e) => {
                              setCountry(e.target.value);
                              if (formErrors.location) setFormErrors({ ...formErrors, location: '' });
                            }}
                            placeholder="Country (e.g. India)"
                            className={`w-full px-3.5 py-2 text-xs rounded-xl border bg-white/90 focus:outline-none focus:ring-2 font-medium text-navy ${
                              formErrors.location
                                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                                : 'border-slate-200/80 focus:border-primary-blue focus:ring-primary-blue/20'
                            }`}
                          />
                        </div>
                      </div>
                      {formErrors.location && (
                        <p className="text-[10px] text-rose-500 font-medium">{formErrors.location}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. CUSTOMER INFORMATION */}
                <div className="p-4 rounded-2xl bg-white/60 border border-white/80 space-y-3.5">
                  <div className="flex items-center space-x-2 pb-1 border-b border-slate-200/60">
                    <span className="w-5 h-5 rounded-full bg-primary-blue text-white text-[11px] font-bold flex items-center justify-center">3</span>
                    <h3 className="font-display font-bold text-xs uppercase tracking-wider text-navy">Customer Information</h3>
                  </div>

                  <div className="space-y-3">
                    {/* Target Customers */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Target Customers <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={targetCustomers}
                        onChange={(e) => {
                          setTargetCustomers(e.target.value);
                          if (formErrors.targetCustomers) setFormErrors({ ...formErrors, targetCustomers: '' });
                        }}
                        placeholder="Who are your main customers? (e.g. College students, young professionals)"
                        className={`w-full px-3.5 py-2 text-xs rounded-xl border bg-white/90 focus:outline-none focus:ring-2 font-medium text-navy ${
                          formErrors.targetCustomers
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                            : 'border-slate-200/80 focus:border-primary-blue focus:ring-primary-blue/20'
                        }`}
                      />
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        <span className="text-[10px] text-slate-400 py-0.5">Quick add:</span>
                        {targetCustomerPresets.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => addCustomerPreset(preset)}
                            className="text-[10px] px-2 py-0.5 rounded-lg bg-white/80 hover:bg-white text-slate-600 hover:text-navy border border-slate-200/70 transition-all"
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                      {formErrors.targetCustomers && (
                        <p className="text-[10px] text-rose-500 font-medium mt-1">{formErrors.targetCustomers}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Target Market / Geography */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Target Market / Geography
                        </label>
                        <select
                          value={targetMarketGeo}
                          onChange={(e) => setTargetMarketGeo(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue font-medium text-navy"
                        >
                          {targetMarkets.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>

                      {/* Customer Age Group */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Customer Age Group <span className="text-[10px] text-slate-400 font-normal">(optional)</span>
                        </label>
                        <select
                          value={customerAgeGroup}
                          onChange={(e) => setCustomerAgeGroup(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue font-medium text-navy"
                        >
                          {ageGroups.map((age) => (
                            <option key={age} value={age}>{age}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. PRODUCTS & OFFERINGS */}
                <div className="p-4 rounded-2xl bg-white/60 border border-white/80 space-y-3.5">
                  <div className="flex items-center space-x-2 pb-1 border-b border-slate-200/60">
                    <span className="w-5 h-5 rounded-full bg-primary-blue text-white text-[11px] font-bold flex items-center justify-center">4</span>
                    <h3 className="font-display font-bold text-xs uppercase tracking-wider text-navy">Products & Offerings</h3>
                  </div>

                  <div className="space-y-3">
                    {/* Products / Services */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Products / Services <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        value={productsServices}
                        onChange={(e) => {
                          setProductsServices(e.target.value);
                          if (formErrors.productsServices) setFormErrors({ ...formErrors, productsServices: '' });
                        }}
                        placeholder="What products or services does your business offer?"
                        className={`w-full px-3.5 py-2 text-xs rounded-xl border bg-white/90 focus:outline-none focus:ring-2 font-medium text-navy resize-none ${
                          formErrors.productsServices
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                            : 'border-slate-200/80 focus:border-primary-blue focus:ring-primary-blue/20'
                        }`}
                      />
                      {formErrors.productsServices && (
                        <p className="text-[10px] text-rose-500 font-medium mt-1">{formErrors.productsServices}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Unique Offering / Special Item */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Unique Offering / Special Item
                        </label>
                        <input
                          type="text"
                          value={uniqueOffering}
                          onChange={(e) => setUniqueOffering(e.target.value)}
                          placeholder="What makes your product or service different?"
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue font-medium text-navy"
                        />
                      </div>

                      {/* Price Range */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Price Range <span className="text-[10px] text-slate-400 font-normal">(optional)</span>
                        </label>
                        <select
                          value={priceRange}
                          onChange={(e) => setPriceRange(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue font-medium text-navy"
                        >
                          {priceRanges.map((pr) => (
                            <option key={pr} value={pr}>{pr}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. BUSINESS POSITION */}
                <div className="p-4 rounded-2xl bg-white/60 border border-white/80 space-y-3.5">
                  <div className="flex items-center space-x-2 pb-1 border-b border-slate-200/60">
                    <span className="w-5 h-5 rounded-full bg-primary-blue text-white text-[11px] font-bold flex items-center justify-center">5</span>
                    <h3 className="font-display font-bold text-xs uppercase tracking-wider text-navy">Business Position & Goals</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Primary Business Goal */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Primary Business Goal <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={businessGoal}
                          onChange={(e) => {
                            setBusinessGoal(e.target.value);
                            if (formErrors.businessGoal) setFormErrors({ ...formErrors, businessGoal: '' });
                          }}
                          className={`w-full px-3.5 py-2 text-xs rounded-xl border bg-white/90 focus:outline-none focus:ring-2 font-medium text-navy ${
                            formErrors.businessGoal
                              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                              : 'border-slate-200/80 focus:border-primary-blue focus:ring-primary-blue/20'
                          }`}
                        >
                          <option value="">Select Primary Goal</option>
                          {businessGoals.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                        {formErrors.businessGoal && (
                          <p className="text-[10px] text-rose-500 font-medium mt-1">{formErrors.businessGoal}</p>
                        )}
                      </div>

                      {/* Business Stage */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Business Stage
                        </label>
                        <select
                          value={businessStage}
                          onChange={(e) => setBusinessStage(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue font-medium text-navy"
                        >
                          {businessStages.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Current Business Challenge */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Current Business Challenge
                      </label>
                      <textarea
                        rows={2}
                        value={businessChallenge}
                        onChange={(e) => setBusinessChallenge(e.target.value)}
                        placeholder="What is the biggest challenge your business is facing right now?"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue font-medium text-navy resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 6. TREND INTELLIGENCE INFORMATION */}
                <div className="p-4 rounded-2xl bg-white/60 border border-white/80 space-y-3.5">
                  <div className="flex items-center space-x-2 pb-1 border-b border-slate-200/60">
                    <span className="w-5 h-5 rounded-full bg-primary-blue text-white text-[11px] font-bold flex items-center justify-center">6</span>
                    <h3 className="font-display font-bold text-xs uppercase tracking-wider text-navy">Trend Intelligence Information</h3>
                  </div>

                  <div className="space-y-3">
                    {/* Trend Interests (Multi-select) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] font-semibold text-slate-700">
                          Trend Interests <span className="text-[10px] text-slate-400 font-normal">(select all that apply)</span>
                        </label>
                        <span className="text-[10px] text-primary-blue font-semibold">{trendInterests.length} selected</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {availableTrendInterests.map((interest) => {
                          const active = trendInterests.includes(interest);
                          return (
                            <button
                              key={interest}
                              type="button"
                              onClick={() => toggleTrendInterest(interest)}
                              className={`text-[11px] px-3 py-1.5 rounded-xl font-semibold transition-all border ${
                                active
                                  ? 'bg-light-blue text-dark-blue border-primary-blue/60 shadow-xs'
                                  : 'bg-white/80 text-slate-600 border-slate-200/70 hover:bg-white hover:text-navy'
                              }`}
                            >
                              {active ? '✓ ' : '+ '}{interest}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Competitors */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Competitors <span className="text-[10px] text-slate-400 font-normal">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={competitors}
                        onChange={(e) => setCompetitors(e.target.value)}
                        placeholder="Who are your main competitors? (e.g. Brands, local stores, online platforms)"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue font-medium text-navy"
                      />
                    </div>

                    {/* Current Marketing Channels (Multi-select) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] font-semibold text-slate-700">
                          Current Marketing Channels <span className="text-[10px] text-slate-400 font-normal">(select all active channels)</span>
                        </label>
                        <span className="text-[10px] text-growth font-semibold">{marketingChannels.length} active</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {availableMarketingChannels.map((channel) => {
                          const active = marketingChannels.includes(channel);
                          return (
                            <button
                              key={channel}
                              type="button"
                              onClick={() => toggleMarketingChannel(channel)}
                              className={`text-[11px] px-2.5 py-1 rounded-xl font-semibold transition-all border ${
                                active
                                  ? 'bg-light-green text-dark-green border-growth/60 shadow-xs'
                                  : 'bg-white/80 text-slate-600 border-slate-200/70 hover:bg-white hover:text-navy'
                              }`}
                            >
                              {active ? '✓ ' : '+ '}{channel}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Seasonal / Demand Patterns */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Seasonal / Demand Patterns <span className="text-[10px] text-slate-400 font-normal">(optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        value={seasonalPatterns}
                        onChange={(e) => setSeasonalPatterns(e.target.value)}
                        placeholder="Are there specific seasons, festivals, events, or periods when demand changes?"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue font-medium text-navy resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 7. OPTIONAL BUSINESS CONTEXT */}
                <div className="p-4 rounded-2xl bg-white/60 border border-white/80 space-y-3.5">
                  <div className="flex items-center space-x-2 pb-1 border-b border-slate-200/60">
                    <span className="w-5 h-5 rounded-full bg-slate-400 text-white text-[11px] font-bold flex items-center justify-center">7</span>
                    <h3 className="font-display font-bold text-xs uppercase tracking-wider text-navy">Additional Business Context</h3>
                    <span className="text-[10px] text-slate-400 font-normal ml-auto">Optional</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Website */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Website URL
                      </label>
                      <input
                        type="url"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="https://yourbusiness.com"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue font-medium text-navy"
                      />
                    </div>

                    {/* Social Media */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Social Media Handle / Link
                      </label>
                      <input
                        type="text"
                        value={socialMediaUrl}
                        onChange={(e) => setSocialMediaUrl(e.target.value)}
                        placeholder="@yourbusiness or page link"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue font-medium text-navy"
                      />
                    </div>

                    {/* Monthly Customer Volume */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Monthly Customer Volume
                      </label>
                      <select
                        value={monthlyVolume}
                        onChange={(e) => setMonthlyVolume(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue font-medium text-navy"
                      >
                        <option value="">Select Volume</option>
                        <option value="Under 500">Under 500</option>
                        <option value="500 – 2,000">500 – 2,000</option>
                        <option value="2,000 – 10,000">2,000 – 10,000</option>
                        <option value="10,000+">10,000+</option>
                      </select>
                    </div>

                    {/* Approximate Business Size */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Approximate Business Size
                      </label>
                      <select
                        value={businessSize}
                        onChange={(e) => setBusinessSize(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue font-medium text-navy"
                      >
                        {businessSizes.map((sz) => (
                          <option key={sz} value={sz}>{sz}</option>
                        ))}
                      </select>
                    </div>

                    {/* Years in Business */}
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Years in Business
                      </label>
                      <select
                        value={yearsInBusiness}
                        onChange={(e) => setYearsInBusiness(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue font-medium text-navy"
                      >
                        <option value="">Select duration</option>
                        {yearsInBusinessOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 8. FINAL AI CONTEXT QUESTION */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-problue-50/70 to-growth-50/70 border border-primary-blue/20 space-y-2.5">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-primary-blue flex-shrink-0" />
                    <h3 className="font-display font-bold text-xs text-navy">
                      Anything else T to G should know about your business?
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Tell us anything that could help T to G understand your business, customers, products, competitors, or growth opportunities.
                  </p>
                  <textarea
                    rows={3}
                    value={additionalAiContext}
                    onChange={(e) => setAdditionalAiContext(e.target.value)}
                    placeholder="Tell us anything that could help T to G understand your business, customers, products, competitors, or growth opportunities."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue font-medium text-navy resize-none"
                  />
                </div>

              </div>
            ) : (
              /* ==========================================================
                 COMPACT SIGN IN FORM
                 ========================================================== */
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="owner@yourbusiness.com"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 font-medium text-navy"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-600">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setResetSent(true)}
                      className="text-[11px] font-semibold text-primary-blue hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 font-medium text-navy"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-xs font-bold shadow-soft-glass flex items-center justify-center space-x-2 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{isRegister ? 'Create Account & Enter Platform' : 'Sign In to Workspace'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bottom disclaimer */}
        <p className="text-center text-[11px] text-slate-500 font-medium">
          T to G Business Intelligence • Enterprise Soft Glassmorphism Architecture
        </p>
      </div>
    </div>
  );
};
