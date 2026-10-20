-- T→G DEMO SEED DATA
-- Fulfills requirement for 7 seeded demo trends, FreshBite Café, metrics, and actions

-- Insert Demo Profiles (Business owner, Expert, Admin)
INSERT INTO profiles (id, auth_user_id, full_name, email, role, avatar_url)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'auth-freshbite-owner', 'Gayatri Patil', 'gayatri@freshbite.cafe', 'BUSINESS', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'),
  ('22222222-2222-2222-2222-222222222222', 'auth-expert-rajesh', 'Rajesh Kulkarni (Retail & F&B Strategist)', 'rajesh@growthworks.in', 'EXPERT', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'),
  ('33333333-3333-3333-3333-333333333333', 'auth-admin-growth', 'T→G System Admin', 'admin@trendtogrowth.com', 'ADMIN', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80')
ON CONFLICT (id) DO NOTHING;

-- Insert FreshBite Café (Section 66 Sample Business)
INSERT INTO businesses (id, owner_id, business_name, industry, business_type, location, target_market, business_goal, description, products_services, target_customers, budget, platforms, status)
VALUES (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '11111111-1111-1111-1111-111111111111',
  'FreshBite Café',
  'Food & Beverage',
  'Cafe / Restaurant',
  'Sangamner & Pune Suburban',
  'Local college & tech corridor customers',
  'Increase evening sales & average order value',
  'Modern casual cafe serving artisan beverages, artisanal snacks, and fresh quick-bites to youth and working professionals.',
  '["Pizza", "Sandwiches", "Coffee", "Mocktails", "Loaded Fries"]'::jsonb,
  'College students, tech campus commuters, evening snackers',
  '₹5,000–₹20,000',
  '["Instagram", "YouTube", "WhatsApp Business", "Zomato"]'::jsonb,
  'active'
) ON CONFLICT (id) DO NOTHING;

-- Insert Data Sources
INSERT INTO data_sources (id, source_type, source_name, base_url, access_method, baseline_trust, dynamic_trust)
VALUES 
  ('s1111111-1111-1111-1111-111111111111', 'search', 'Google Search & Trends India', 'https://trends.google.com', 'api', 0.92, 0.94),
  ('s2222222-2222-2222-2222-222222222222', 'social', 'Instagram Culinary Signals', 'https://instagram.com', 'collector', 0.85, 0.88),
  ('s3333333-3333-3333-3333-333333333333', 'ecommerce', 'Swiggy & Zomato Market Intelligence', 'https://zomato.com', 'api', 0.90, 0.92),
  ('s4444444-4444-4444-4444-444444444444', 'news', 'Economic Times Retail & Hospitality', 'https://economictimes.indiatimes.com', 'rss', 0.89, 0.90)
ON CONFLICT (id) DO NOTHING;

-- Insert 7 Initial Seed Trends (Loaded Fries, Matcha Drinks, Protein Snacks, Affordable Combos, Cold Coffee, Healthy Bowls, Pizza Combos)
INSERT INTO trends (
  id, name, slug, category, headline, description, image_url, lifecycle_status,
  momentum, velocity, acceleration, consistency, source_diversity, geographic_spread,
  persistence, trend_score, trend_probability, confidence, risk, is_demo
) VALUES 
(
  't1111111-1111-1111-1111-111111111111',
  'Loaded Fries',
  'loaded-fries',
  'Food & Beverage',
  'Loaded Fries Are Gaining Attention with 18-24 Evening Diners',
  'Massive surge in localized searches for indulgent, sauce-drizzled gourmet fries with cheese & spice blends. Peak orders cluster tightly between 4:00 PM and 8:30 PM among college students.',
  'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
  'RISING',
  88.5, 92.4, 78.0, 89.2, 85.0, 76.5, 84.0, 91.2, 0.94, 0.88, 'LOW', true
),
(
  't2222222-2222-2222-2222-222222222222',
  'Matcha Drinks & Coolers',
  'matcha-drinks',
  'Beverages',
  'Matcha Coolers & Lattes Spark High-Margin Wellness Wave',
  'Japanese ceremonial green tea drinks transitioning from niche metro cafes into Tier 2 student towns as clean-energy aesthetic alternatives to sugary sodas.',
  'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
  'EMERGING',
  74.2, 81.0, 84.5, 72.0, 78.0, 68.0, 75.0, 78.5, 0.82, 0.81, 'MEDIUM', true
),
(
  't3333333-3333-3333-3333-333333333333',
  'Protein Snacks & Bites',
  'protein-snacks',
  'Health & Fitness',
  'Grab-and-Go High-Protein Energy Bites in Rapid Ascendance',
  'Consumers prioritizing 15g+ protein per snack. High cross-over from gym-goers to desk workers looking for guilt-free 4 PM energy snacks.',
  'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=800&q=80',
  'VALIDATING',
  82.0, 85.0, 72.0, 91.0, 88.0, 82.0, 87.0, 85.4, 0.89, 0.86, 'LOW', true
),
(
  't4444444-4444-4444-4444-444444444444',
  'Affordable Combos',
  'affordable-combos',
  'Marketing & Pricing',
  'Fixed-Price ₹99 & ₹149 Value Combos Capture Daily Footfall',
  'Price-anchored combo meals dominating student decision-making over single a la carte items. Accelerates trial and builds habitual footfall.',
  'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=80',
  'PEAKING',
  94.0, 88.0, 62.0, 95.0, 92.0, 91.0, 90.0, 93.0, 0.96, 0.92, 'LOW', true
),
(
  't5555555-5555-5555-5555-555555555555',
  'Cold Coffee Innovations',
  'cold-coffee-innovations',
  'Beverages',
  'Vietnamese Sweet Cream & Biscoff Iced Brews Spike in Youth Hubs',
  'Cold brew with flavored cold foam, Lotus Biscoff drizzle, and hazelnut infusions showing 3x year-on-year social buzz during warm afternoons.',
  'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
  'RISING',
  86.0, 89.0, 79.0, 87.0, 84.0, 79.0, 81.0, 88.0, 0.91, 0.87, 'LOW', true
),
(
  't6666666-6666-6666-6666-666666666666',
  'Healthy Salad & Grain Bowls',
  'healthy-bowls',
  'Food & Beverage',
  'Custom Grain Bowls Replacing Heavy Lunches Among Campus Staff',
  'Millets, quinoa, and paneer/tofu warm bowls showing steady uptake across health-conscious consumers seeking quick, non-sluggish meals.',
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
  'VALIDATING',
  69.0, 71.0, 65.0, 83.0, 76.0, 64.0, 79.0, 73.0, 0.76, 0.79, 'MEDIUM', true
),
(
  't7777777-7777-7777-7777-777777777777',
  'Artisan Pizza Combos',
  'pizza-combos',
  'Food & Beverage',
  'Single-Serve Pan Pizza & Mocktail Pairings Surge for Group Hangouts',
  'Mini 7-inch sourdough pizzas paired with refreshing coolers priced for shared peer dining between 5 PM and 9 PM.',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  'RISING',
  83.0, 84.0, 76.0, 88.0, 82.0, 75.0, 83.0, 84.5, 0.88, 0.85, 'LOW', true
)
ON CONFLICT (id) DO NOTHING;

-- Insert Audiences for Loaded Fries
INSERT INTO audiences (trend_id, age_group, location, interest, percentage, activity_signal)
VALUES
  ('t1111111-1111-1111-1111-111111111111', '18–24', 'College campuses & student housing', 'Fast Casual, Street Food, Instagram aesthetics', 58.0, 'Peak social posting 5-8 PM'),
  ('t1111111-1111-1111-1111-111111111111', '25–34', 'Suburban tech corridors', 'Late-night snacks, Delivery combos', 28.0, 'Weekend order spikes'),
  ('t1111111-1111-1111-1111-111111111111', '35–44', 'Family weekend diners', 'Kid-friendly sharing platters', 10.0, 'Sunday evening walk-ins'),
  ('t1111111-1111-1111-1111-111111111111', '45+', 'General neighborhood', 'Curiosity trials', 4.0, 'Low frequency');

-- Insert Geographic Signals for Loaded Fries
INSERT INTO geographic_signals (trend_id, country, state, city, interest_score, growth_rate)
VALUES
  ('t1111111-1111-1111-1111-111111111111', 'India', 'Maharashtra', 'Pune Suburban', 94.0, 34.5),
  ('t1111111-1111-1111-1111-111111111111', 'India', 'Maharashtra', 'Sangamner Regional', 88.0, 42.0),
  ('t1111111-1111-1111-1111-111111111111', 'India', 'Maharashtra', 'Nashik Central', 82.0, 29.0),
  ('t1111111-1111-1111-1111-111111111111', 'India', 'Karnataka', 'Bengaluru South', 96.0, 38.0);

-- Insert Business Matches for FreshBite Café with Loaded Fries
INSERT INTO business_matches (
  business_id, trend_id, customer_fit, product_fit, location_fit, goal_alignment,
  budget_fit, business_fit, risk, confidence, reasoning, intelligence_version
) VALUES (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  't1111111-1111-1111-1111-111111111111',
  94.0, 89.0, 87.0, 95.0, 88.0, 91.0, 'LOW', 0.88,
  'Loaded Fries directly overlaps with FreshBite’s student demographic, evening footfall gap, existing fryer/cheese inventory, and under ₹10,000 launch budget requirement.',
  'tgo-v1'
) ON CONFLICT (business_id, trend_id) DO NOTHING;

-- Insert Opportunities
INSERT INTO opportunities (
  id, business_id, trend_id, name, description, opportunity_score, business_fit,
  risk, confidence, potential_action, status, score_version, intelligence_version
) VALUES (
  'o1111111-1111-1111-1111-111111111111',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  't1111111-1111-1111-1111-111111111111',
  'Loaded Fries Student Evening Combo',
  'Introduce signature Cheesy Masala & Peri-Peri Loaded Fries paired with mini iced coolers targeting college students between 4 PM and 8 PM.',
  8.8, 91.0, 'LOW', 0.88,
  'Launch a ₹99 student combo between 4–8 PM and test demand for 7 days.',
  'active',
  'v1.2',
  'tgo-v1'
) ON CONFLICT (id) DO NOTHING;

-- Insert Action Plan
INSERT INTO action_plans (
  id, business_id, trend_id, opportunity_id, title, why_now, why_this_business,
  target_customer, what_to_launch, suggested_price, promotion_strategy,
  test_timing, test_duration, success_metrics, risks, stop_criteria,
  continue_criteria, expected_learning, status, intelligence_version
) VALUES (
  'a1111111-1111-1111-1111-111111111111',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  't1111111-1111-1111-1111-111111111111',
  'o1111111-1111-1111-1111-111111111111',
  'Launch ₹99 Student Evening Loaded Fries Combo',
  'Local searches for loaded fries and cheese street foods up 42% this quarter while evening cafe footfall is currently running at 45% capacity.',
  'FreshBite already maintains standard fries in stock and has dedicated counter space right opposite the college bus stand.',
  'College students, young engineers, and evening transit commuters',
  'Double-fried crispy French fries topped with warm cheese sauce, spicy mayo drizzle, and crushed jalapenos in paper boat packaging.',
  '₹99 introductory price point (cost of goods ₹34)',
  'Chalkboard sign at entrance, 3 Instagram story reels with cheese pull, WhatsApp status blast with voucher code',
  '4:00 PM – 8:00 PM Monday through Sunday',
  '7 days',
  '["15+ combo orders per evening", "40% customer repeat or peer recommendation", "₹1,500 daily incremental revenue"]'::jsonb,
  '["Kitchen fryer bottleneck during peak 6 PM rush", "Cheese sauce quality consistency"]'::jsonb,
  '["Under 5 orders daily after day 3", "Wastage exceeding 20%"]'::jsonb,
  '["12+ orders daily with positive student verbal ratings", "Margin maintained above 60%"]'::jsonb,
  'Will validate whether price-anchored ₹99 finger foods unlock high-margin beverage cross-sells in evening hours.',
  'approved',
  'tgo-v1'
) ON CONFLICT (id) DO NOTHING;

-- Insert Expert Review for the Action Plan
INSERT INTO expert_reviews (
  id, action_plan_id, expert_id, risk, confidence, status, comments,
  suggested_changes, decision_reason, reviewed_at
) VALUES (
  'e1111111-1111-1111-1111-111111111111',
  'a1111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'LOW', 0.90, 'approved',
  'Solid low-risk execution plan. Food cost is tightly bounded and equipment already exists. Recommend pre-portioning cheese bags to avoid evening delay.',
  'Pre-portion cheese sauce toppings in advance to maintain 4-minute ticket time.',
  'Low capital expenditure, immediate alignment with college demographics, and clear stop/go criteria.',
  now() - interval '1 day'
) ON CONFLICT (id) DO NOTHING;

-- Insert Active Experiment
INSERT INTO experiments (
  id, business_id, opportunity_id, action_plan_id, name, hypothesis,
  baseline, start_date, end_date, status, decision
) VALUES (
  'x1111111-1111-1111-1111-111111111111',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'o1111111-1111-1111-1111-111111111111',
  'a1111111-1111-1111-1111-111111111111',
  '7-Day ₹99 Loaded Fries Pilot',
  'Offering an introductory ₹99 Loaded Fries combo during 4-8 PM will increase total evening covers by 25% and drive drink cross-sells.',
  '{"avg_evening_orders": 12, "avg_evening_revenue": 1450, "drink_attach_rate": 0.22}'::jsonb,
  CURRENT_DATE - interval '3 days',
  CURRENT_DATE + interval '4 days',
  'in_progress',
  'pending_evaluation'
) ON CONFLICT (id) DO NOTHING;

-- Insert Experiment Daily Metrics
INSERT INTO experiment_metrics (experiment_id, metric_name, metric_value, metric_unit, metric_date, baseline_value, target_value)
VALUES
  ('x1111111-1111-1111-1111-111111111111', 'Daily Orders', 18.0, 'orders', CURRENT_DATE - interval '3 days', 12.0, 15.0),
  ('x1111111-1111-1111-1111-111111111111', 'Daily Orders', 22.0, 'orders', CURRENT_DATE - interval '2 days', 12.0, 15.0),
  ('x1111111-1111-1111-1111-111111111111', 'Daily Orders', 26.0, 'orders', CURRENT_DATE - interval '1 day', 12.0, 15.0),
  ('x1111111-1111-1111-1111-111111111111', 'Evening Revenue', 2350.0, 'INR', CURRENT_DATE - interval '1 day', 1450.0, 2000.0);

-- Insert Smart Alerts
INSERT INTO alerts (business_id, trend_id, alert_type, title, message, severity, confidence, is_read)
VALUES
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    't1111111-1111-1111-1111-111111111111',
    'Trend Acceleration',
    'Loaded Fries Search Velocity Spiked +42%',
    'Evening demand in your local college zone has surged over the past 72 hours. Your active experiment is well timed.',
    'high', 0.92, false
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    't5555555-5555-5555-5555-555555555555',
    'Emerging Demand',
    'Cold Brew Flavors Showing High Youth Fit',
    'New search clusters around flavored cold foams and iced coffee in Sangamner / Pune regional hub.',
    'medium', 0.85, false
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    't4444444-4444-4444-4444-444444444444',
    'Expert Review Required',
    'Affordable Combo Action Plan Awaiting Sign-off',
    'Expert Rajesh Kulkarni reviewed the combo launch plan and added preparation suggestions.',
    'info', 0.95, true
  );
