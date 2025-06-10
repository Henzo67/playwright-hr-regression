import { Page, Locator, expect } from '@playwright/test';

/**
 * Utility functions for reliable form interactions
 */

/**
 * Scroll element into view and ensure it's not blocked by sticky elements
 */
export async function scrollToElement(page: Page, element: Locator): Promise<void> {
    // First scroll the element into view
    await element.scrollIntoViewIfNeeded();
    
    // Wait a moment for scrolling to complete
    await page.waitForTimeout(500);
    
    // Check if there are any sticky/fixed elements that might be blocking
    const stickySelectors = [
        '.sticky-header',
        '.fixed-header',
        '.navbar-fixed',
        '[style*="position: fixed"]',
        '[style*="position: sticky"]',
        '.banner',
        '.cookie-banner',
        '.notification-bar'
    ];
    
    for (const selector of stickySelectors) {
        try {
            const stickyElement = page.locator(selector);
            const isVisible = await stickyElement.isVisible();
            
            if (isVisible) {
                // Get the height of the sticky element
                const stickyHeight = await stickyElement.boundingBox();
                if (stickyHeight) {
                    // Scroll additional pixels to account for sticky element
                    await page.evaluate((offset) => {
                        window.scrollBy(0, -offset - 20); // Extra 20px margin
                    }, stickyHeight.height);
                    await page.waitForTimeout(300);
                }
            }
        } catch {
            continue;
        }
    }
}

/**
 * Comprehensive popup and modal handler with timeout
 */
export async function handlePopupsAndModals(page: Page): Promise<void> {
    // Check if page is still open
    if (page.isClosed()) {
        console.log('Page is closed, skipping popup handling');
        return;
    }

    console.log('Handling popups and modals...');
    
    const startTime = Date.now();
    const timeout = 2000; // 2 seconds timeout
    
    // Handle different types of popups in sequence with timeout checks
    try {
        await Promise.race([
            dismissCookieBanners(page),
            new Promise(resolve => setTimeout(resolve, timeout))
        ]);
        
        // Check if we've exceeded our timeout or page is closed
        if (Date.now() - startTime > timeout || page.isClosed()) {
            console.log('Modal handling timed out after 2 seconds or page closed, continuing...');
            return;
        }
        
        await Promise.race([
            closeModals(page),
            new Promise(resolve => setTimeout(resolve, timeout - (Date.now() - startTime)))
        ]);
        
        // Check timeout again or page closure
        if (Date.now() - startTime > timeout || page.isClosed()) {
            console.log('Modal handling timed out after 2 seconds or page closed, continuing...');
            return;
        }
        
        await Promise.race([
            handleRecaptcha(page),
            new Promise(resolve => setTimeout(resolve, timeout - (Date.now() - startTime)))
        ]);
        
    } catch (error) {
        console.log(`Error in popup handling: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Final page check before waiting
    if (page.isClosed()) {
        console.log('Page closed during modal handling');
        return;
    }
    
    const elapsed = Date.now() - startTime;
    if (elapsed < 1000) {
        // Wait a shorter time for animations if we finished quickly
        try {
            await page.waitForTimeout(Math.min(1000 - elapsed, 500));
        } catch (error) {
            // Page might have been closed
            console.log('Page closed while waiting for animation timeout');
            return;
        }
    }
    
    console.log(`Modal handling completed in ${elapsed}ms`);
}

/**
 * Close any open modals or popups using common close button selectors
 */
export async function closeModals(page: Page): Promise<void> {
    // Check if page is still open
    if (page.isClosed()) {
        console.log('Page is closed, skipping modal close');
        return;
    }

    const modalCloseSelectors = [
        // Start with most specific modal close buttons first
        '.leadinModal-close', // Specific for leadinModal
        '.modal-close',
        '.close-button',
        '.modal-header .close',
        '.modal-header button[aria-label="Close"]',
        '[data-dismiss="modal"]',
        '[data-testid="close"]',
        '[data-testid="modal-close"]',
        'button:has-text("×")',
        'button:has-text("✕")',
        // More generic ones
        'button[aria-label="Close"]:not([class*="main"]):not([class*="primary"])',
        'button[aria-label="close"]:not([class*="main"]):not([class*="primary"])',
        'button[title="Close"]:not([class*="main"]):not([class*="primary"])',
        'button[title="close"]:not([class*="main"]):not([class*="primary"])',
        '.fa-times',
        '.fa-close',
        'span:has-text("×")',
        'span:has-text("✕")',
        // Generic close button patterns with exclusions
        'button[class*="close"]:not([class*="main"]):not([class*="primary"])',
        'div[class*="close"]:not([class*="main"]):not([class*="primary"])',
        'span[class*="close"]:not([class*="main"]):not([class*="primary"])'
    ];

    console.log('Attempting to close any open modals...');
    
    let modalFound = false;
    
    for (const selector of modalCloseSelectors) {
        try {
            // Check if page is still open before each operation
            if (page.isClosed()) {
                console.log('Page was closed during modal handling');
                return;
            }

            const closeButtons = page.locator(selector);
            const count = await closeButtons.count();
            
            if (count > 0) {
                // Check each close button to ensure it's part of a modal
                for (let i = 0; i < count; i++) {
                    if (page.isClosed()) {
                        console.log('Page was closed during modal button iteration');
                        return;
                    }

                    const closeButton = closeButtons.nth(i);
                    const isVisible = await closeButton.isVisible();
                    
                    if (isVisible) {
                        // For leadinModal, just click it directly
                        if (selector === '.leadinModal-close') {
                            console.log(`Found leadinModal close button`);
                            try {
                                await closeButton.click({ force: true, timeout: 2000 });
                                await page.waitForTimeout(500);
                                modalFound = true;
                                console.log('Successfully closed leadinModal');
                                break;
                            } catch (error) {
                                console.log(`Could not close leadinModal: ${error instanceof Error ? error.message : String(error)}`);
                                continue;
                            }
                        } else {
                            // Check if this close button is within a modal context
                            const parentModal = closeButton.locator('xpath=ancestor::div[contains(@class, "modal") or contains(@class, "dialog") or contains(@class, "popup") or contains(@role, "dialog")]');
                            const hasModalParent = await parentModal.count() > 0;
                            
                            // Also check if it's in a reCAPTCHA or similar overlay
                            const isInOverlay = await closeButton.locator('xpath=ancestor::div[contains(@class, "overlay") or contains(@class, "recaptcha")]').count() > 0;
                            
                            if (hasModalParent || isInOverlay) {
                                console.log(`Found modal close button: ${selector} (index ${i})`);
                                try {
                                    await scrollToElement(page, closeButton);
                                    await closeButton.click({ timeout: 2000 });
                                    await page.waitForTimeout(500);
                                    modalFound = true;
                                    break;
                                } catch (error) {
                                    console.log(`Could not click modal close button: ${error instanceof Error ? error.message : String(error)}`);
                                    continue;
                                }
                            }
                        }
                    }
                }
            }
        } catch (error) {
            // Continue to next selector if this one fails
            console.log(`Error handling close button ${selector}: ${error instanceof Error ? error.message : String(error)}`);
            continue;
        }
        
        // If we found and closed a modal, break out to let other functions handle remaining popups
        if (modalFound) break;
    }
    
    if (!modalFound) {
        console.log('No modals found to close');
    }
}

/**
 * Handle reCAPTCHA popups and challenges
 */
export async function handleRecaptcha(page: Page): Promise<void> {
    console.log('Checking for reCAPTCHA...');
    
    const recaptchaSelectors = [
        'iframe[src*="recaptcha"]',
        'iframe[title*="reCAPTCHA"]',
        '.g-recaptcha',
        '[data-sitekey]',
        '#recaptcha-anchor',
        '.recaptcha-checkbox'
    ];

    let recaptchaFound = false;

    for (const selector of recaptchaSelectors) {
        try {
            const recaptchaElement = page.locator(selector);
            const isVisible = await recaptchaElement.isVisible();
            
            if (isVisible) {
                console.log(`Found reCAPTCHA element: ${selector}`);
                recaptchaFound = true;
                
                // Scroll to reCAPTCHA element
                await scrollToElement(page, recaptchaElement);
                
                // Try to click the reCAPTCHA checkbox if it's a simple checkbox
                if (selector.includes('checkbox') || selector.includes('anchor')) {
                    try {
                        await recaptchaElement.click();
                        await page.waitForTimeout(2000); // Wait for reCAPTCHA to process
                    } catch (error) {
                        console.log(`Could not click reCAPTCHA element: ${error instanceof Error ? error.message : String(error)}`);
                    }
                }
                
                // For now, we'll just wait and let the user handle reCAPTCHA manually
                // Don't try to close reCAPTCHA automatically as it might close the page
                console.log('reCAPTCHA detected - continuing with form submission (manual interaction may be required)');
                break;
            }
        } catch (error) {
            continue;
        }
    }
    
    if (!recaptchaFound) {
        console.log('No reCAPTCHA found');
    }
}

/**
 * Dismiss cookie banners and consent popups
 */
export async function dismissCookieBanners(page: Page): Promise<void> {
    console.log('Checking for cookie banners...');
    
    const cookieBannerSelectors = [
        'button:has-text("Accept")',
        'button:has-text("Accept All")',
        'button:has-text("Allow All")',
        'button:has-text("OK")',
        'button:has-text("Agree")',
        'button:has-text("Continue")',
        'button[id*="accept"]',
        'button[class*="accept"]',
        'button[data-testid*="accept"]',
        '.cookie-banner button',
        '.consent-banner button',
        '#cookie-banner button',
        '[data-testid="cookie-banner"] button'
    ];

    let bannerFound = false;

    for (const selector of cookieBannerSelectors) {
        try {
            const cookieButton = page.locator(selector);
            const isVisible = await cookieButton.isVisible();
            
            if (isVisible) {
                console.log(`Found and clicking cookie banner button: ${selector}`);
                await scrollToElement(page, cookieButton);
                await cookieButton.click();
                await page.waitForTimeout(500);
                bannerFound = true;
                break;
            }
        } catch (error) {
            continue;
        }
    }
    
    if (!bannerFound) {
        console.log('No cookie banners found');
    }
}

/**
 * Safely click a checkbox, trying multiple strategies
 */
export async function safeCheckboxClick(page: Page, checkboxSelectors: string[]): Promise<void> {
    for (const selector of checkboxSelectors) {
        try {
            const checkbox = page.locator(selector);
            await checkbox.waitFor({ state: 'visible', timeout: 5000 });
            
            // Scroll to checkbox before clicking
            await scrollToElement(page, checkbox);
            
            // Check if it's already checked
            const isChecked = await checkbox.isChecked();
            if (!isChecked) {
                await checkbox.check();
            }
            return; // Success, exit function
        } catch (error) {
            console.log(`Failed to click checkbox with selector: ${selector}`);
            continue; // Try next selector
        }
    }
    throw new Error('Could not find or click any checkbox with the provided selectors');
}

/**
 * Find and click submit button with multiple possible selectors
 */
export async function safeSubmitClick(page: Page, submitSelectors: string[]): Promise<void> {
    // Handle any popups before clicking submit
    await handlePopupsAndModals(page);
    
    for (const selector of submitSelectors) {
        try {
            const button = page.locator(selector);
            await button.waitFor({ state: 'visible', timeout: 5000 });
            
            // Check if button is enabled
            const isEnabled = await button.isEnabled();
            if (!isEnabled) {
                console.log(`Submit button ${selector} is disabled, trying next...`);
                continue;
            }
            
            // Scroll to the submit button to ensure it's in view
            console.log(`Scrolling to submit button: ${selector}`);
            await scrollToElement(page, button);
            
            // Additional wait to ensure button is clickable after scrolling
            await page.waitForTimeout(500);
            
            console.log(`Clicking submit button: ${selector}`);
            await button.click();
            return; // Success, exit function
        } catch (error) {
            console.log(`Failed to click submit button with selector: ${selector} - Error: ${error instanceof Error ? error.message : String(error)}`);
            continue; // Try next selector
        }
    }
    throw new Error('Could not find or click any submit button with the provided selectors');
}

/**
 * Wait for page to load and be ready for form interaction
 */
export async function waitForFormReady(page: Page): Promise<void> {
    // Wait for page to be loaded
    await page.waitForLoadState('domcontentloaded');
    
    // Wait a bit more for any dynamic content
    await page.waitForTimeout(1000);
    
    // Handle any initial popups
    await handlePopupsAndModals(page);
    
    // Wait for any loading indicators to disappear
    const loadingIndicators = [
        '.loading',
        '.spinner',
        '[data-loading="true"]',
        '.loader'
    ];
    
    for (const indicator of loadingIndicators) {
        try {
            await page.locator(indicator).waitFor({ state: 'hidden', timeout: 5000 });
        } catch {
            // Ignore if loading indicator doesn't exist
        }
    }
}

/**
 * Get common checkbox selectors for terms and conditions
 */
export const TERMS_CHECKBOX_SELECTORS = [
    'input[type="checkbox"][name*="terms"]',
    'input[type="checkbox"][id*="terms"]',
    'input[type="checkbox"][class*="terms"]',
    '[role="checkbox"]',
    'input[type="checkbox"]',
    'label:has-text("By signing up") input[type="checkbox"]',
    'label:has-text("agree") input[type="checkbox"]',
    '.terms-checkbox input',
    '.checkbox input[type="checkbox"]'
];

/**
 * Get common submit button selectors
 */
export const SUBMIT_BUTTON_SELECTORS = [
    'button[type="submit"]',
    'input[type="submit"]',
    'button:has-text("Sign Up")',
    'button:has-text("Create Account")',
    'button:has-text("Finish Setup")',
    'button:has-text("Submit")',
    'button:has-text("Register")',
    '.submit-button',
    '.btn-submit',
    '[data-testid="submit"]'
]; 