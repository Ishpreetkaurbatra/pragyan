import { createApp } from '../app';
import { IntelligenceService } from '../intelligence/intelligence.service';

async function runTests() {
  console.log('--- Running T→G Backend API Verification Tests ---');
  const app = createApp();
  const intService = IntelligenceService.getInstance();

  // Test 1: Intelligence provider analysis
  console.log('[Test 1] Testing IntelligenceService mock analyzeTrend...');
  const trendAnalysis = await intService.analyzeTrend({
    trendContext: {
      trendId: 't1111111-1111-1111-1111-111111111111',
      name: 'Loaded Fries',
      category: 'Food & Beverage',
      momentum: 88,
    },
  });
  if (trendAnalysis.success && trendAnalysis.data.momentum === 'HIGH') {
    console.log('✓ Test 1 Passed: analyzeTrend returned HIGH momentum with reasoning.');
  } else {
    throw new Error('Test 1 Failed: analyzeTrend output invalid');
  }

  // Test 2: Business matching
  console.log('[Test 2] Testing IntelligenceService business matching...');
  const matchResult = await intService.matchBusiness({
    businessContext: {
      businessName: 'FreshBite Café',
      industry: 'Food & Beverage',
      businessType: 'Cafe',
      location: 'Sangamner',
      businessGoal: 'Increase evening sales',
      products: ['Pizza', 'Fries', 'Coffee'],
      targetCustomers: 'College students',
    },
    trendContext: {
      trendId: 't1111111-1111-1111-1111-111111111111',
      name: 'Loaded Fries',
      category: 'Food & Beverage',
    },
  });
  if (matchResult.success && matchResult.data.businessFit >= 85) {
    console.log(`✓ Test 2 Passed: Business Fit calculated at ${matchResult.data.businessFit}%`);
  } else {
    throw new Error('Test 2 Failed: matchBusiness output invalid');
  }

  // Test 3: Action plan generation
  console.log('[Test 3] Testing Action Plan Generation...');
  const actionPlan = await intService.generateActionPlan({
    businessContext: {
      businessName: 'FreshBite Café',
      industry: 'Food & Beverage',
      businessType: 'Cafe',
      location: 'Sangamner',
      businessGoal: 'Increase evening sales',
      products: ['Pizza', 'Fries', 'Coffee'],
    },
    trendContext: {
      trendId: 't1111111-1111-1111-1111-111111111111',
      name: 'Loaded Fries',
      category: 'Food & Beverage',
    },
  });
  if (actionPlan.success && actionPlan.data.whatToLaunch && actionPlan.data.testDuration === '7 days') {
    console.log(`✓ Test 3 Passed: Action plan generated: "${actionPlan.data.title}"`);
  } else {
    throw new Error('Test 3 Failed: action plan generation invalid');
  }

  // Test 4: Ask T→G
  console.log('[Test 4] Testing Ask T→G reasoning...');
  const askResult = await intService.answerBusinessQuestion({
    question: 'What should I launch this month?',
    businessContext: {
      businessName: 'FreshBite Café',
      industry: 'Food & Beverage',
      businessType: 'Cafe',
      location: 'Sangamner',
      businessGoal: 'Increase evening sales',
      products: ['Pizza', 'Fries', 'Coffee'],
    },
  });
  if (askResult.success && askResult.data.citedTrends.length > 0) {
    console.log(`✓ Test 4 Passed: Ask T→G cited ${askResult.data.citedTrends.length} trends and recommendations.`);
  } else {
    throw new Error('Test 4 Failed: Ask T→G answer invalid');
  }

  console.log('All T→G Backend API verification tests passed successfully!\n');
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
