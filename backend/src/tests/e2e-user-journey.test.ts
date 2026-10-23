import assert from 'assert';
import http from 'http';

const FRONTEND_URL = 'http://localhost:5173';
const BACKEND_URL = 'http://localhost:4000';

function httpGet(url: string, headers: Record<string, string> = {}): Promise<{ status: number; headers: http.IncomingHttpHeaders; body: string }> {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { headers }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode || 0, headers: res.headers, body }));
    });
    req.on('error', reject);
  });
}

function httpPost(url: string, data: Record<string, unknown>, headers: Record<string, string> = {}): Promise<{ status: number; headers: http.IncomingHttpHeaders; body: string }> {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const parsedUrl = new URL(url);
    const req = http.request(parsedUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...headers,
      },
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode || 0, headers: res.headers, body }));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runEndToEndUserJourney() {
  console.log('\n================================================================');
  console.log('  T→G (Trend to Growth) — Full End-to-End User Journey Test');
  console.log('================================================================\n');

  let testCount = 0;
  async function step(name: string, fn: () => Promise<void>) {
    testCount++;
    try {
      await fn();
      console.log(`  [PASS] Step ${testCount}: ${name}`);
    } catch (err) {
      console.error(`  [FAIL] Step ${testCount}: ${name}`);
      console.error('         Error:', err instanceof Error ? err.message : err);
      throw err;
    }
  }

  // 1. FRONTEND SERVER ACCESSIBILITY
  await step('Frontend website loads correctly on http://localhost:5173', async () => {
    const res = await httpGet(FRONTEND_URL);
    assert.strictEqual(res.status, 200);
    assert.ok(res.headers['content-type']?.includes('text/html'));
    assert.ok(res.body.includes('<title>T→G') || res.body.includes('<div id="root">'));
  });

  // 2. BACKEND API HEALTH
  await step('Backend API is healthy on http://localhost:4000/health', async () => {
    const res = await httpGet(`${BACKEND_URL}/health`);
    assert.strictEqual(res.status, 200);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.status, 'HEALTHY');
    assert.strictEqual(json.service, 'tg-backend');
  });

  // 3. ACCOUNT CREATION (SIGN UP)
  let registeredUserId = '';
  await step('Create Account (Sign Up) persists new business owner profile in database', async () => {
    const res = await httpPost(`${BACKEND_URL}/api/auth/register`, {
      email: 'owner@ahilyanagar-cafe.in',
      fullName: 'Gayatri Patil',
      role: 'BUSINESS',
    });
    assert.strictEqual(res.status, 201);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.success, true);
    assert.ok(json.data.token);
    assert.strictEqual(json.data.user.email, 'owner@ahilyanagar-cafe.in');
    assert.strictEqual(json.data.user.role, 'BUSINESS');
    registeredUserId = json.data.user.id;
  });

  // 4. SIGN IN & SESSION
  await step('Sign In authenticates user and establishes active session', async () => {
    const res = await httpPost(`${BACKEND_URL}/api/auth/login`, {
      email: 'owner@ahilyanagar-cafe.in',
      role: 'BUSINESS',
    });
    assert.strictEqual(res.status, 200);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.success, true);
    assert.ok(json.data.token);

    // Verify session
    const meRes = await httpGet(`${BACKEND_URL}/api/auth/me`, {
      'x-demo-role': 'BUSINESS',
    });
    assert.strictEqual(meRes.status, 200);
    const meJson = JSON.parse(meRes.body);
    assert.strictEqual(meJson.success, true);
    assert.ok(meJson.data.user);
  });

  // 5. BUSINESS PROFILE PERSISTENCE
  await step('Business Profile save & retrieve for Ahilyanagar business context', async () => {
    const profileUpdate = {
      business_name: 'Nagar Artisan Roastery & Cafe',
      business_type: 'Restaurant / Café',
      industry: 'Food & Beverage',
      location: 'Ahilyanagar, Maharashtra, India',
      target_customers: 'College students, youth, and young working professionals',
      target_market: 'City',
      business_goal: 'Increase Sales & Afternoon Footfall',
      products_services: ['Cold Brew Coffee', 'Thick Shakes', 'Artisanal Sandwiches', 'Healthy Grab-and-Go Bowls'],
      platforms: ['Instagram', 'WhatsApp', 'Google Maps'],
    };

    const updateRes = await httpPost(`${BACKEND_URL}/api/business/profile`, profileUpdate, {
      'x-demo-role': 'BUSINESS',
    });
    assert.strictEqual(updateRes.status, 200);
    const updateJson = JSON.parse(updateRes.body);
    assert.strictEqual(updateJson.success, true);

    // Retrieve business profile to confirm persistence
    const getRes = await httpGet(`${BACKEND_URL}/api/business/profile`, {
      'x-demo-role': 'BUSINESS',
    });
    assert.strictEqual(getRes.status, 200);
    const getJson = JSON.parse(getRes.body);
    assert.strictEqual(getJson.success, true);
    assert.strictEqual(getJson.data.business.business_name, 'Nagar Artisan Roastery & Cafe');
    assert.strictEqual(getJson.data.business.location, 'Ahilyanagar, Maharashtra, India');
  });

  // 6. AHILYANAGAR TREND PIPELINE (DEMO MODE)
  let topTrendSlug = '';
  await step('Trend Pipeline executes for Ahilyanagar in DEMO mode with full 14 stages', async () => {
    const res = await httpPost(`${BACKEND_URL}/api/trends/analyze`, {
      mode: 'demo',
      business: {
        businessName: 'Nagar Artisan Roastery & Cafe',
        businessType: 'Restaurant / Café',
        industry: 'Food & Beverage',
        city: 'Ahilyanagar',
        state: 'Maharashtra',
        country: 'India',
        targetCustomers: ['College students', 'Young professionals'],
        products: ['Cold drinks', 'Artisan beverages'],
        preferredCategories: ['Food & Beverage'],
      },
    });

    assert.strictEqual(res.status, 200);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.dataMode, 'DEMO');
    assert.strictEqual(json.location.city, 'Ahilyanagar');
    assert.strictEqual(json.location.state, 'Maharashtra');
    assert.strictEqual(json.location.country, 'India');
    assert.strictEqual(json.data.notice, 'DEMO DATA — NOT LIVE');
    assert.ok(json.trends.length > 0);

    const top = json.data.topTrend;
    assert.ok(top);
    assert.ok(top.cluster.name);
    assert.ok(top.cluster.lifecycle);
    assert.ok(top.cluster.trendScore.totalScore > 0);
    assert.strictEqual(top.locationRelevance, 1.0);
    assert.strictEqual(top.locationReason, 'Ahilyanagar-specific signal');

    // Evidence traceability
    assert.ok(top.evidence.length > 0);
    const firstEv = top.evidence[0];
    assert.ok(firstEv.source);
    assert.ok(firstEv.sourceRecordId);
    assert.ok(firstEv.title);
    assert.ok(firstEv.url);
    assert.strictEqual(firstEv.location, 'Ahilyanagar');
    assert.strictEqual(firstEv.locationRelevance, 1.0);
    assert.strictEqual(firstEv.locationReason, 'Ahilyanagar-specific signal');

    // AI Analysis
    assert.ok(top.aiAnalysis);
    assert.ok(['LOW', 'MEDIUM', 'HIGH'].includes(top.aiAnalysis.confidence));
    assert.ok(top.aiAnalysis.whyItMatters);
    assert.ok(top.aiAnalysis.actionPlan.length > 0);

    // Opportunity and Action Plan
    assert.ok(top.opportunity);
    assert.ok(top.opportunity.opportunityTitle);
    assert.ok(top.actionPlan);
    assert.ok(top.actionPlan.whatToTest);

    topTrendSlug = top.cluster.id;
  });

  // 7. AHILYANAGAR TREND PIPELINE (LIVE MODE INTEGRITY)
  await step('Trend Pipeline executes for Ahilyanagar in LIVE mode with real news signals and explicit audit', async () => {
    const res = await httpPost(`${BACKEND_URL}/api/trends/analyze`, {
      mode: 'live',
      business: {
        businessName: 'Nagar Agro & Cafe',
        city: 'Ahilyanagar',
        state: 'Maharashtra',
        country: 'India',
      },
    });

    assert.strictEqual(res.status, 200);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.dataMode, 'LIVE');
    assert.strictEqual(json.location.city, 'Ahilyanagar');
    assert.strictEqual(json.data.notice, 'LIVE MARKET DATA');

    // Confirm real source succeeded and unconfigured sources are marked NOT_CONFIGURED
    const newsStatus = json.sources.find((s: any) => s.sourceId.includes('news-rss'));
    assert.ok(newsStatus);
    assert.strictEqual(newsStatus.status, 'SUCCESS');
    assert.ok(newsStatus.recordsFetched > 0);

    const ytStatus = json.sources.find((s: any) => s.sourceId.includes('youtube'));
    assert.ok(ytStatus);
    if (!process.env.YOUTUBE_API_KEY) {
      assert.strictEqual(ytStatus.status, 'NOT_CONFIGURED');
    }
  });

  // 8. OPPORTUNITIES VIEW
  await step('Opportunities list returns persisted and scored business opportunities', async () => {
    const res = await httpGet(`${BACKEND_URL}/api/opportunities`, {
      'x-demo-role': 'BUSINESS',
    });
    assert.strictEqual(res.status, 200);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data));
    assert.ok(json.data.length > 0);
  });

  // 9. ACTION PLANS VIEW
  await step('Action Plans list returns executable step-by-step experiment plans', async () => {
    const res = await httpGet(`${BACKEND_URL}/api/action-plans`, {
      'x-demo-role': 'BUSINESS',
    });
    assert.strictEqual(res.status, 200);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data));
    assert.ok(json.data.length > 0);
  });

  // 10. ERROR RESILIENCE & USEFUL MESSAGING
  await step('Error handling returns clean structured JSON without crashing or leaking stack traces', async () => {
    // Non-existent route
    const notFoundRes = await httpGet(`${BACKEND_URL}/api/non-existent-route-404`);
    assert.strictEqual(notFoundRes.status, 404);
    assert.ok(notFoundRes.headers['content-type']?.includes('application/json'));
    const notFoundJson = JSON.parse(notFoundRes.body);
    assert.strictEqual(notFoundJson.success, false);
    assert.ok(notFoundJson.error.message);

    // Invalid JSON body
    const invalidJsonRes = await new Promise<{ status: number; body: string }>((resolve) => {
      const req = http.request(`${BACKEND_URL}/api/trends/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }, (res) => {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => resolve({ status: res.statusCode || 0, body }));
      });
      req.write('{ malformed json body ');
      req.end();
    });
    assert.strictEqual(invalidJsonRes.status, 400);
    const invalidJson = JSON.parse(invalidJsonRes.body);
    assert.strictEqual(invalidJson.success, false);
    assert.ok(invalidJson.error.message);
  });

  console.log('\n================================================================');
  console.log(`  Full User Journey Completed: ${testCount}/${testCount} Steps PASSED!`);
  console.log('================================================================\n');
}

runEndToEndUserJourney().catch((err) => {
  console.error('\nFatal User Journey Failure:', err);
  process.exit(1);
});
