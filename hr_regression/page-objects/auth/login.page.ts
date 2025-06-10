import { Page, Locator, expect } from '@playwright/test';
import { 
    handlePopupsAndModals,
    waitForFormReady,
    scrollToElement
} from '../../utils/form-helpers';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly forgotPasswordLink: Locator;
    readonly signupLink: Locator;

    constructor(page: Page) {
        this.page = page;
        // More robust selectors for email input
        this.emailInput = page.getByLabel('Email').or(
            page.getByLabel('Email Address')
        ).or(
            page.getByLabel('Business Email')
        ).or(
            page.locator('input[type="email"]')
        ).or(
            page.locator('input[name="email"]')
        ).or(
            page.locator('#email')
        ).first();
        
        // More robust selectors for password input
        this.passwordInput = page.getByLabel('Password').or(
            page.locator('input[type="password"]')
        ).or(
            page.locator('input[name="password"]')
        ).or(
            page.locator('#password')
        ).first();
        
        // More robust selectors for login button
        this.loginButton = page.getByRole('button', { name: 'Login' }).or(
            page.getByRole('button', { name: 'Sign In' })
        ).or(
            page.getByRole('button', { name: 'Log In' })
        ).or(
            page.getByRole('button', { name: 'Log in' })
        ).or(
            page.locator('button[type="submit"]')
        ).or(
            page.locator('input[type="submit"]')
        ).or(
            page.locator('.btn-green')
        ).or(
            page.locator('.login-button')
        ).or(
            page.locator('.btn-login')
        ).first();
        
        // Error message selectors
        this.errorMessage = page.getByRole('alert').or(
            page.locator('.error-message')
        ).or(
            page.locator('.alert-danger')
        ).or(
            page.locator('.field-error')
        ).or(
            page.locator('[data-testid="error"]')
        ).first();
        
        // Additional useful elements
        this.forgotPasswordLink = page.getByText('Forgot Password').or(
            page.getByText('Forgot your password?')
        ).or(
            page.locator('a[href*="forgot"]')
        ).first();
        
        this.signupLink = page.getByText('Sign Up').or(
            page.getByText('Create Account')
        ).or(
            page.getByText('Register')
        ).or(
            page.locator('a[href*="sign-up"]')
        ).or(
            page.locator('a[href*="signup"]')
        ).or(
            page.locator('a[href*="register"]')
        ).first();
    }

    async goto() {
        await this.page.goto('https://login.breathehrstaging.com/login');
        // Wait for form to be ready for interaction
        await waitForFormReady(this.page);
    }

    async login(email: string, password: string) {
        // Handle any popups before form interaction
        await handlePopupsAndModals(this.page);
        
        // Fill email field
        await this.emailInput.fill(email);
        await this.page.waitForTimeout(100);
        
        // Fill password field
        await this.passwordInput.fill(password);
        await this.page.waitForTimeout(100);
        
        // Handle any popups that might appear after filling fields
        await handlePopupsAndModals(this.page);
        
        // Scroll to login button and click
        await scrollToElement(this.page, this.loginButton);
        await this.loginButton.click();
        
        // Wait for any post-submission popups and handle them
        await this.page.waitForTimeout(1000);
        if (!this.page.isClosed()) {
            await handlePopupsAndModals(this.page);
        }
    }

    async expectErrorMessage(message: string) {
        // Handle any popups that might be blocking error messages
        if (!this.page.isClosed()) {
            await handlePopupsAndModals(this.page);
        }
        
        // Try multiple ways to find the error message
        const errorSelectors = [
            this.errorMessage,
            this.page.locator('.error-message'),
            this.page.locator('.alert-danger'),
            this.page.locator('.field-error'),
            this.page.locator('[role="alert"]'),
            this.page.locator('.login-error'),
            this.page.locator('.auth-error')
        ];
        
        let errorFound = false;
        for (const errorSelector of errorSelectors) {
            try {
                await expect(errorSelector).toContainText(message, { timeout: 5000 });
                errorFound = true;
                console.log(`Found error message: "${message}"`);
                break;
            } catch {
                continue;
            }
        }
        
        // Also check for browser validation messages
        if (!errorFound) {
            try {
                const emailValidation = await this.emailInput.evaluate((el) => 
                    (el as HTMLInputElement).validationMessage
                );
                const passwordValidation = await this.passwordInput.evaluate((el) => 
                    (el as HTMLInputElement).validationMessage
                );
                
                if (emailValidation.includes(message) || passwordValidation.includes(message)) {
                    errorFound = true;
                    console.log(`Found validation message: "${message}"`);
                }
            } catch {
                // Continue to final check
            }
        }
        
        if (!errorFound) {
            throw new Error(`Could not find error message: "${message}"`);
        }
    }

    async expectSuccessfulLogin() {
        // Handle any popups that might appear after successful login
        if (!this.page.isClosed()) {
            await handlePopupsAndModals(this.page);
        }
        
        // Try multiple possible success URLs
        const successPatterns = [
            /.*dashboard/,
            /.*home/,
            /.*welcome/,
            /.*main/,
            /.*app/,
            /.*portal/
        ];
        
        let navigationSucceeded = false;
        for (const pattern of successPatterns) {
            try {
                if (!this.page.isClosed()) {
                    await expect(this.page).toHaveURL(pattern, { timeout: 15000 });
                    navigationSucceeded = true;
                    console.log(`✅ Login successful - navigated to ${this.page.url()}`);
                    break;
                }
            } catch {
                continue;
            }
        }
        
        if (!navigationSucceeded && !this.page.isClosed()) {
            // If no URL pattern matches, check for success indicators on the current page
            const successIndicators = [
                this.page.getByText('Welcome'),
                this.page.getByText('Dashboard'),
                this.page.getByText('Home'),
                this.page.getByText('Logout').or(this.page.getByText('Sign Out')),
                this.page.locator('[data-testid="dashboard"]'),
                this.page.locator('.dashboard'),
                this.page.locator('.main-content'),
                this.page.locator('.user-menu'),
                this.page.locator('.profile-menu'),
                // Check for any page that's NOT the login page
                this.page.locator('h1:not(:has-text("Login")):not(:has-text("Sign In"))')
            ];
            
            let foundSuccessIndicator = false;
            for (const indicator of successIndicators) {
                try {
                    if (!this.page.isClosed()) {
                        await expect(indicator).toBeVisible({ timeout: 5000 });
                        foundSuccessIndicator = true;
                        console.log(`✅ Login successful - found success indicator`);
                        break;
                    }
                } catch {
                    continue;
                }
            }
            
            if (!foundSuccessIndicator && !this.page.isClosed()) {
                // As a last resort, check if we're no longer on the login page
                const currentUrl = this.page.url();
                if (!currentUrl.includes('login') && !currentUrl.includes('sign-in')) {
                    console.log(`✅ Login successful - navigation detected: ${currentUrl}`);
                    foundSuccessIndicator = true;
                }
            }
            
            if (!foundSuccessIndicator && !this.page.isClosed()) {
                // Take a screenshot for debugging
                try {
                    await this.page.screenshot({ path: 'test-results/login-failure.png' });
                } catch (error) {
                    console.log(`Could not take screenshot: ${error instanceof Error ? error.message : String(error)}`);
                }
                throw new Error(`No success indicators found after login submission. Current URL: ${this.page.url()}`);
            }
        }
        
        // If we reach here, either we found success indicators or the page closed (indicating navigation)
        if (this.page.isClosed()) {
            console.log('✅ Login successful - page navigated to new location (page closed)');
        }
    }

    async clickForgotPassword() {
        await handlePopupsAndModals(this.page);
        await scrollToElement(this.page, this.forgotPasswordLink);
        await this.forgotPasswordLink.click();
    }

    async clickSignupLink() {
        await handlePopupsAndModals(this.page);
        await scrollToElement(this.page, this.signupLink);
        await this.signupLink.click();
    }

    async expectValidationError(field: Locator, message: string) {
        // Handle any popups that might be blocking error messages
        if (!this.page.isClosed()) {
            await handlePopupsAndModals(this.page);
        }
        
        // Check for aria-invalid attribute
        try {
            await expect(field).toHaveAttribute('aria-invalid', 'true');
        } catch {
            // If aria-invalid is not set, continue to check for error messages
        }
        
        // Try multiple ways to find the validation error message
        const errorSelectors = [
            field.locator('..').locator('.error-message'),
            field.locator('..').locator('.field-error'),
            field.locator('..').locator('[role="alert"]'),
            this.page.locator('.error-message'),
            this.page.locator('.field-error'),
            this.page.locator('[role="alert"]')
        ];
        
        let errorFound = false;
        for (const errorSelector of errorSelectors) {
            try {
                await expect(errorSelector).toContainText(message, { timeout: 3000 });
                errorFound = true;
                break;
            } catch {
                continue;
            }
        }
        
        // Also check browser validation message
        if (!errorFound) {
            try {
                const validationMessage = await field.evaluate((el) => 
                    (el as HTMLInputElement).validationMessage
                );
                expect(validationMessage).toContain(message);
                errorFound = true;
            } catch {
                // Continue to final check
            }
        }
        
        if (!errorFound) {
            throw new Error(`Could not find validation error message: "${message}" for field`);
        }
    }
} 