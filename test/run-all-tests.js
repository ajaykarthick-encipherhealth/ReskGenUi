#!/usr/bin/env node

/**
 * Comprehensive Test Runner for CogentAI UI
 * This script runs all test files and provides a summary report
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test file patterns to run
const testPatterns = [
  'test/dashboard/components/**/*.test.js',
  'test/components/**/*.test.js',
  'test/pages/**/*.test.js',
  'test/utils/**/*.test.js'
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function findTestFiles() {
  const testFiles = [];
  
  testPatterns.forEach(pattern => {
    const glob = require('glob');
    const files = glob.sync(pattern);
    testFiles.push(...files);
  });
  
  return testFiles;
}

function runTestFile(testFile) {
  try {
    log(`Running: ${testFile}`, 'cyan');
    const result = execSync(`yarn test ${testFile} --verbose --no-coverage`, { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    log(`✅ PASSED: ${testFile}`, 'green');
    return { file: testFile, status: 'passed', output: result };
  } catch (error) {
    log(`❌ FAILED: ${testFile}`, 'red');
    log(`Error: ${error.message}`, 'red');
    return { file: testFile, status: 'failed', output: error.stdout || error.message };
  }
}

function generateReport(results) {
  const passed = results.filter(r => r.status === 'passed');
  const failed = results.filter(r => r.status === 'failed');
  
  log('\n' + '='.repeat(60), 'bright');
  log('📊 TEST EXECUTION SUMMARY', 'bright');
  log('='.repeat(60), 'bright');
  
  log(`\nTotal Tests: ${results.length}`, 'blue');
  log(`✅ Passed: ${passed.length}`, 'green');
  log(`❌ Failed: ${failed.length}`, 'red');
  
  const passRate = ((passed.length / results.length) * 100).toFixed(1);
  log(`📈 Pass Rate: ${passRate}%`, passRate >= 80 ? 'green' : 'yellow');
  
  if (failed.length > 0) {
    log('\n❌ FAILED TESTS:', 'red');
    failed.forEach(result => {
      log(`  - ${result.file}`, 'red');
    });
  }
  
  if (passed.length > 0) {
    log('\n✅ PASSED TESTS:', 'green');
    passed.forEach(result => {
      log(`  - ${result.file}`, 'green');
    });
  }
  
  log('\n' + '='.repeat(60), 'bright');
}

function runAllTests() {
  log('🚀 Starting Comprehensive Test Suite for CogentAI UI', 'bright');
  log('='.repeat(60), 'bright');
  
  const testFiles = findTestFiles();
  
  if (testFiles.length === 0) {
    log('❌ No test files found!', 'red');
    log('Make sure test files exist in the following patterns:', 'yellow');
    testPatterns.forEach(pattern => log(`  - ${pattern}`, 'yellow'));
    process.exit(1);
  }
  
  log(`\n📁 Found ${testFiles.length} test files:`, 'blue');
  testFiles.forEach(file => log(`  - ${file}`, 'cyan'));
  
  log('\n🔄 Running tests...', 'yellow');
  log('-'.repeat(60), 'yellow');
  
  const results = [];
  
  testFiles.forEach(testFile => {
    const result = runTestFile(testFile);
    results.push(result);
  });
  
  generateReport(results);
  
  // Exit with appropriate code
  const hasFailures = results.some(r => r.status === 'failed');
  if (hasFailures) {
    log('\n⚠️  Some tests failed. Please review the failures above.', 'yellow');
    process.exit(1);
  } else {
    log('\n🎉 All tests passed!', 'green');
    process.exit(0);
  }
}

// Run the test suite
if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests, findTestFiles, runTestFile }; 