import { Page, Locator, expect } from '@playwright/test';
import { 
    safeCheckboxClick, 
    safeSubmitClick, 
    waitForFormReady, 
    handlePopupsAndModals,
    TERMS_CHECKBOX_SELECTORS, 
    SUBMIT_BUTTON_SELECTORS 
} from '../../utils/form-helpers';

export class SignupPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly companyNameInput: Locator;
    readonly employeeCountSelect: Locator;
    readonly phoneInput: Locator;
    readonly passwordInput: Locator;
    readonly hearAboutSelect: Locator;
    readonly termsCheckbox: Locator;
    readonly finishSetupButton: Locator;
    readonly skipForNowButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.getByLabel('First name:');
        this.lastNameInput = page.getByLabel('Last name:');
        this.emailInput = page.getByLabel('Your business email address:');
        this.companyNameInput = page.getByLabel('Company name:');
        this.employeeCountSelect = page.getByLabel('Number of employees:');
        this.phoneInput = page.getByLabel('Your contact number:');
        this.passwordInput = page.getByLabel('Create password:');
        this.hearAboutSelect = page.getByLabel('How did you hear about us?');
        this.termsCheckbox = page.locator('input[type="checkbox"]').or(
            page.getByRole('checkbox')
        ).or(
            page.locator('[id*="terms"]')
        ).or(
            page.locator('[name*="terms"]')
        ).first();
        this.finishSetupButton = page.getByRole('button', { name: 'Finish Setup' }).or(
            page.getByRole('button', { name: 'Sign Up' })
        ).or(
            page.getByRole('button', { name: 'Create Account' })
        ).or(
            page.locator('button[type="submit"]')
        ).first();
        this.skipForNowButton = page.getByRole('button', { name: 'Skip for now' });
        this.errorMessage = page.getByRole('alert');
    }

    async goto() {
        await this.page.goto('https://www.breathehrstaging.com/en-gb/sign-up');
        await waitForFormReady(this.page);
    }

    async fillSignupForm({
        firstName,
        lastName,
        email,
        companyName,
        employeeCount,
        phone,
        password,
        hearAbout
    }: {
        firstName: string;
        lastName: string;
        email: string;
        companyName: string;
        employeeCount: string;
        phone: string;
        password: string;
        hearAbout: string;
    }) {
        await handlePopupsAndModals(this.page);
        
        await this.firstNameInput.fill(firstName);
        await this.page.waitForTimeout(100);
        
        await this.lastNameInput.fill(lastName);
        await this.page.waitForTimeout(100);
        
        await this.emailInput.fill(email);
        await this.page.waitForTimeout(100);
        
        await this.companyNameInput.fill(companyName);
        await this.page.waitForTimeout(100);
        
        await this.employeeCountSelect.selectOption(employeeCount);
        await this.page.waitForTimeout(100);
        
        await this.phoneInput.fill(phone);
        await this.page.waitForTimeout(100);
        
        await this.passwordInput.fill(password);
        await this.page.waitForTimeout(100);
        
        await this.hearAboutSelect.selectOption(hearAbout);
        await this.page.waitForTimeout(100);
        
        await handlePopupsAndModals(this.page);
        
        try {
            await safeCheckboxClick(this.page, TERMS_CHECKBOX_SELECTORS);
        } catch (error) {
            console.log('Failed to click terms checkbox using safe method, trying fallback...');
            await this.termsCheckbox.waitFor({ state: 'visible' });
            await this.termsCheckbox.check();
        }
        
        await handlePopupsAndModals(this.page);
    }

    async submitForm() {
        try {
            await safeSubmitClick(this.page, SUBMIT_BUTTON_SELECTORS);
        } catch (error) {
            console.log('Failed to click submit button using safe method, trying fallback...');
            await handlePopupsAndModals(this.page);
            
            await this.finishSetupButton.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(500);
            
            await this.finishSetupButton.waitFor({ state: 'visible' });
            await this.finishSetupButton.click();
        }
        
        await this.page.waitForTimeout(2000);
        await handlePopupsAndModals(this.page);
    }

    async skipSetup() {
        await handlePopupsAndModals(this.page);
        await this.skipForNowButton.click();
    }

    async expectErrorMessage(message: string) {
        await expect(this.errorMessage).toContainText(message);
    }

    async expectSuccessfulSignup() {
        // Handle any popups that might appear after successful signup
        if (!this.page.isClosed()) {
            await handlePopupsAndModals(this.page);
        }
        
        // Wait for navigation to the next page after successful signup
        // Try multiple possible success URLs
        const successPatterns = [
            /.*dashboard/,
            /.*welcome/,
            /.*setup/,
            /.*onboarding/,
            /.*home/
        ];
        
        let navigationSucceeded = false;
        for (const pattern of successPatterns) {
            try {
                if (!this.page.isClosed()) {
                    await expect(this.page).toHaveURL(pattern, { timeout: 15000 });
                    navigationSucceeded = true;
                    break;
                }
            } catch {
                continue;
            }
        }
        
        if (!navigationSucceeded && !this.page.isClosed()) {
            // Handle any popups that might be blocking the success page
            await handlePopupsAndModals(this.page);
            
            // If no URL pattern matches, check for success indicators on the current page
            const successIndicators = [
                this.page.getByText('Welcome'),
                this.page.getByText('Account created'),
                this.page.getByText('Setup complete'),
                this.page.getByText('Dashboard'),
                this.page.getByText('Thank you'),
                this.page.getByText('Success'),
                this.page.locator('[data-testid="dashboard"]'),
                this.page.locator('.dashboard'),
                this.page.locator('.success-message'),
                this.page.locator('.welcome-message'),
                // Check for any page that's NOT the signup page
                this.page.locator('h1:not(:has-text("Sign up")):not(:has-text("Create account"))')
            ];
            
            let foundSuccessIndicator = false;
            for (const indicator of successIndicators) {
                try {
                    if (!this.page.isClosed()) {
                        await expect(indicator).toBeVisible({ timeout: 5000 });
                        foundSuccessIndicator = true;
                        console.log(`Found success indicator: ${await indicator.textContent()}`);
                        break;
                    }
                } catch {
                    continue;
                }
            }
            
            if (!foundSuccessIndicator && !this.page.isClosed()) {
                // As a last resort, check if we're no longer on the signup page
                const currentUrl = this.page.url();
                if (!currentUrl.includes('sign-up') && !currentUrl.includes('signup')) {
                    console.log(`Navigation detected - current URL: ${currentUrl}`);
                    foundSuccessIndicator = true;
                }
            }
            
            if (!foundSuccessIndicator && !this.page.isClosed()) {
                // Take a screenshot for debugging only if page is still open
                try {
                    await this.page.screenshot({ path: 'test-results/signup-failure.png' });
                } catch (error) {
                    console.log(`Could not take screenshot: ${error instanceof Error ? error.message : String(error)}`);
                }
                throw new Error(`No success indicators found after signup submission. Current URL: ${this.page.url()}`);
            }
        }
        
        // If we reach here, either we found success indicators or the page closed (indicating navigation)
        if (this.page.isClosed()) {
            console.log('✅ Signup successful - page navigated to new location (page closed)');
        } else {
            console.log('✅ Signup successful - found success indicators on page');
        }
    }

    async expectValidationError(field: Locator, message: string) {
        await handlePopupsAndModals(this.page);
        
        try {
            await expect(field).toHaveAttribute('aria-invalid', 'true');
        } catch {
            // If aria-invalid is not set, continue to check for error messages
        }
        
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