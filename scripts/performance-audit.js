const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

async function runPerformanceAudit() {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
  });

  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance'],
    port: chrome.port,
  };

  // URLs to test
  const urls = [
    'http://localhost:3000',
    'http://localhost:3000/tenantadmin/patients', // CommonPage patients
    'http://localhost:3000/tenantadmin/patients/details',
  ];

  const results = [];

  for (const url of urls) {
    console.log(`Running Lighthouse audit for: ${url}`);
    
    try {
      const runnerResult = await lighthouse(url, options);
      
      // Extract key metrics
      const { lhr } = runnerResult;
      const performance = lhr.categories.performance;
      
      const metrics = {
        url,
        performanceScore: Math.round(performance.score * 100),
        metrics: {
          'First Contentful Paint': lhr.audits['first-contentful-paint']?.displayValue,
          'Largest Contentful Paint': lhr.audits['largest-contentful-paint']?.displayValue,
          'Cumulative Layout Shift': lhr.audits['cumulative-layout-shift']?.displayValue,
          'Total Blocking Time': lhr.audits['total-blocking-time']?.displayValue,
          'Speed Index': lhr.audits['speed-index']?.displayValue,
        },
        opportunities: lhr.audits['diagnostics'] ? 
          Object.entries(lhr.audits)
            .filter(([key, audit]) => audit.scoreDisplayMode === 'binary' && audit.score < 1)
            .map(([key, audit]) => ({
              id: key,
              title: audit.title,
              description: audit.description,
              details: audit.details
            }))
            .slice(0, 10) : []
      };
      
      results.push(metrics);
      
      // Save detailed HTML report
      const reportHtml = runnerResult.report;
      const filename = `lighthouse-${url.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.html`;
      fs.writeFileSync(path.join(__dirname, '..', 'lighthouse-reports', filename), reportHtml);
      
    } catch (error) {
      console.error(`Error auditing ${url}:`, error.message);
    }
  }

  await chrome.kill();

  // Generate summary report
  const summaryReport = {
    timestamp: new Date().toISOString(),
    results,
    recommendations: [
      'Enable compression and caching headers',
      'Optimize images with WebP/AVIF formats',
      'Implement code splitting and lazy loading',
      'Minimize third-party scripts impact',
      'Use service worker for better caching',
      'Optimize Critical Rendering Path',
      'Reduce unused JavaScript and CSS',
      'Implement resource hints (preload, prefetch)',
    ]
  };

  // Create reports directory if it doesn't exist
  const reportsDir = path.join(__dirname, '..', 'lighthouse-reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // Save summary
  fs.writeFileSync(
    path.join(reportsDir, `performance-summary-${Date.now()}.json`),
    JSON.stringify(summaryReport, null, 2)
  );

  console.log('\n=== Performance Audit Results ===');
  results.forEach(result => {
    console.log(`\n${result.url}`);
    console.log(`Performance Score: ${result.performanceScore}/100`);
    console.log('Key Metrics:');
    Object.entries(result.metrics).forEach(([metric, value]) => {
      console.log(`  ${metric}: ${value}`);
    });
    
    if (result.opportunities.length > 0) {
      console.log('Top Opportunities:');
      result.opportunities.slice(0, 5).forEach(opp => {
        console.log(`  - ${opp.title}`);
      });
    }
  });

  console.log(`\nDetailed reports saved to: ${reportsDir}`);
}

if (require.main === module) {
  runPerformanceAudit().catch(console.error);
}

module.exports = { runPerformanceAudit };