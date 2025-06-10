# HR System Test Automation Framework

This repository contains automated tests for the HR system using Playwright.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Project Structure

```
├── tests/                    # Test files
│   ├── auth/                # Authentication related tests
│   ├── employees/           # Employee management tests
│   └── common/             # Common test utilities
├── page-objects/            # Page Object Models
├── fixtures/               # Test fixtures and data
├── utils/                  # Utility functions
├── playwright-report/       # HTML test reports
└── test-results/           # Screenshots, videos, traces
```

## Running Tests

Run all tests:
```bash
npx playwright test
```

Run specific test file:
```bash
npx playwright test tests/auth/login.spec.ts
```

Run tests in headed mode:
```bash
npx playwright test --headed
```

View test report:
```bash
npx playwright show-report
```

## 📊 Test Reporting Requirements

**ALL test scripts MUST include comprehensive reporting with:**

### 1. **Step-by-Step Logging**
- Every test action must be logged with descriptive console output
- Use emojis for visual clarity: 🧪 🔧 📝 ✅ ❌ ⚠️ 📊 📍
- Include test purpose, steps, and outcomes
- Example:
```javascript
console.log('🧪 Testing: User login validation');
console.log('📝 Step 1: Filling email field with test@example.com');
console.log('✅ Login successful - navigated to dashboard');
```

### 2. **Screenshots**
- Automatic screenshots on test failures
- Screenshots saved to `test-results/` directory
- Viewable in HTML report for debugging

### 3. **Videos**
- Video recording of failed tests
- Helps debugging complex UI interactions
- Stored in `test-results/` with test artifacts

### 4. **HTML Reports**
- Comprehensive HTML report generated after test runs
- Includes test results, screenshots, videos, and traces
- View with: `npx playwright show-report`
- Located in `playwright-report/` directory

### 5. **Trace Files**
- Complete trace of all test actions
- Network requests, DOM snapshots, console logs
- Enables post-mortem debugging
- View traces in Playwright Inspector

### 6. **Test Artifacts Structure**
```
test-results/
├── screenshots/           # Failure screenshots
├── videos/               # Test execution videos  
├── traces/               # Playwright traces
└── test-results.json     # JSON test results
```

## 🎯 Test Writing Standards

### Console Logging Requirements
```javascript
// ✅ GOOD - Descriptive step-by-step logging
console.log('🧪 Testing: Email validation with invalid formats');
console.log('📝 Step 1: Filling email field with: invalid@email');
console.log('📝 Step 2: Checking validation response');
console.log('✅ Validation working - login button disabled');

// ❌ BAD - No logging or unclear messages
await loginPage.fill('email');
await loginPage.click();
```

### Test Organization
- Group related tests in `describe` blocks
- Use descriptive test names
- Include both positive and negative test cases
- Test edge cases and boundary conditions

### Error Handling
- All tests must handle modal popups and overlays
- Include fallback selectors for robust element location
- Log all validation checks and their outcomes
- Handle timeouts gracefully with meaningful error messages

## Best Practices

1. **Page Object Model**: Use consistent page object patterns
2. **Test Independence**: Each test runs in isolation
3. **Descriptive Names**: Use meaningful test and function names
4. **Proper Assertions**: Include comprehensive validation checks
5. **Dynamic Elements**: Handle loading states and dynamic content
6. **Clean Test Data**: Ensure tests don't interfere with each other
7. **Comprehensive Logging**: Document every test step and outcome

## Browser Configuration

- **Primary Browser**: Chrome (Chromium)
- **Viewport**: 1920x1080 for consistent screenshots
- **Slow Motion**: 100ms for better video capture
- **Timeout**: 30s for test completion, 10s for actions

## Reporting Configuration

The framework automatically generates:
- HTML reports with embedded screenshots/videos
- JSON results for CI/CD integration
- Console output for real-time feedback
- Trace files for detailed debugging

## Contributing

1. Create a feature branch
2. Add or update tests following reporting standards
3. Ensure all tests include step-by-step logging
4. Verify screenshots/videos are captured on failures
5. Test your changes with: `npx playwright test --headed`
6. Review HTML report before submitting
7. Submit a pull request with test report screenshots 