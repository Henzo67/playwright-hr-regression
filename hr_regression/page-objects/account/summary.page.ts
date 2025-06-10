import { Page, Locator } from '@playwright/test';

export class SummaryPage {
    readonly page: Page;
    
    // Basic Information selectors
    readonly personTypeSelect: Locator;
    readonly titleSelect: Locator;
    readonly firstNameInput: Locator;
    readonly middleNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly pronounsSelect: Locator;
    readonly knownAsInput: Locator;
    readonly refInput: Locator;
    
    // Contact Details selectors
    readonly ddiInput: Locator;
    readonly workExtInput: Locator;
    readonly workMobileInput: Locator;
    readonly skypeInput: Locator;
    
    // Social Networks selectors
    readonly linkedinInput: Locator;
    readonly twitterInput: Locator;
    readonly facebookInput: Locator;
    
    // Email section
    readonly emailInput: Locator;
    readonly updateEmailButton: Locator;
    
    // Action buttons
    readonly updateProfileButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Basic Information selectors
        this.personTypeSelect = page.locator('#employee_person_type');
        this.titleSelect = page.locator('#employee_title');
        this.firstNameInput = page.locator('#employee_first_name');
        this.middleNameInput = page.locator('#employee_middle_name');
        this.lastNameInput = page.locator('#employee_last_name');
        this.pronounsSelect = page.locator('#employee_pronouns');
        this.knownAsInput = page.locator('#employee_known_as');
        this.refInput = page.locator('#employee_reference');
        
        // Contact Details selectors
        this.ddiInput = page.locator('#employee_ddi');
        this.workExtInput = page.locator('#employee_work_ext');
        this.workMobileInput = page.locator('#employee_work_mobile');
        this.skypeInput = page.locator('#employee_skype_username');
        
        // Social Networks selectors
        this.linkedinInput = page.locator('#employee_linkedin_username');
        this.twitterInput = page.locator('#employee_twitter_username');
        this.facebookInput = page.locator('#employee_facebook_username');
        
        // Email section
        this.emailInput = page.locator('#employee_email');
        this.updateEmailButton = page.locator('button:has-text("update email address")');
        
        // Action buttons
        this.updateProfileButton = page.getByRole('button', { name: 'update profile' });
        this.cancelButton = page.getByRole('link', { name: 'cancel' });
    }

    async goto(): Promise<void> {
        console.log('📍 Navigating to profile summary page...');
        
        await this.page.goto('https://hr.breathehrstaging.com/employees/41279');
        await this.page.waitForTimeout(2000);
        
        console.log('✅ Profile summary page loaded');
    }

    async gotoEdit(): Promise<void> {
        console.log('📍 Navigating to summary edit form...');
        
        await this.page.goto('https://hr.breathehrstaging.com/employees/41279/profile/summary/edit');
        await this.page.waitForTimeout(2000);
        
        console.log('✅ Summary edit form loaded');
    }

    async updateBasicInfo(basicInfo: {
        personType?: string;
        title?: string;
        firstName?: string;
        middleName?: string;
        lastName?: string;
        pronouns?: string;
        knownAs?: string;
        ref?: string;
    }): Promise<void> {
        console.log('📝 Updating basic information...');
        
        if (basicInfo.personType && await this.personTypeSelect.count() > 0) {
            console.log(`📝 Setting person type: ${basicInfo.personType}`);
            await this.personTypeSelect.selectOption({ label: basicInfo.personType });
        }
        
        if (basicInfo.title && await this.titleSelect.count() > 0) {
            console.log(`📝 Setting title: ${basicInfo.title}`);
            await this.titleSelect.selectOption({ label: basicInfo.title });
        }
        
        if (basicInfo.firstName && await this.firstNameInput.count() > 0) {
            console.log(`📝 Setting first name: ${basicInfo.firstName}`);
            await this.firstNameInput.fill(basicInfo.firstName);
        }
        
        if (basicInfo.middleName && await this.middleNameInput.count() > 0) {
            console.log(`📝 Setting middle name: ${basicInfo.middleName}`);
            await this.middleNameInput.fill(basicInfo.middleName);
        }
        
        if (basicInfo.lastName && await this.lastNameInput.count() > 0) {
            console.log(`📝 Setting last name: ${basicInfo.lastName}`);
            await this.lastNameInput.fill(basicInfo.lastName);
        }
        
        if (basicInfo.pronouns && await this.pronounsSelect.count() > 0) {
            console.log(`📝 Setting pronouns: ${basicInfo.pronouns}`);
            await this.pronounsSelect.selectOption({ label: basicInfo.pronouns });
        }
        
        if (basicInfo.knownAs && await this.knownAsInput.count() > 0) {
            console.log(`📝 Setting known as: ${basicInfo.knownAs}`);
            await this.knownAsInput.fill(basicInfo.knownAs);
        }
        
        if (basicInfo.ref && await this.refInput.count() > 0) {
            console.log(`📝 Setting reference: ${basicInfo.ref}`);
            await this.refInput.fill(basicInfo.ref);
        }
        
        console.log('✅ Basic information updated');
    }

    async updateContactDetails(contactDetails: {
        ddi?: string;
        workExt?: string;
        workMobile?: string;
        skype?: string;
    }): Promise<void> {
        console.log('📝 Updating contact details...');
        
        if (contactDetails.ddi && await this.ddiInput.count() > 0) {
            console.log(`📝 Setting DDI: ${contactDetails.ddi}`);
            await this.ddiInput.fill(contactDetails.ddi);
        }
        
        if (contactDetails.workExt && await this.workExtInput.count() > 0) {
            console.log(`📝 Setting work extension: ${contactDetails.workExt}`);
            await this.workExtInput.fill(contactDetails.workExt);
        }
        
        if (contactDetails.workMobile && await this.workMobileInput.count() > 0) {
            console.log(`📝 Setting work mobile: ${contactDetails.workMobile}`);
            await this.workMobileInput.fill(contactDetails.workMobile);
        }
        
        if (contactDetails.skype && await this.skypeInput.count() > 0) {
            console.log(`📝 Setting Skype: ${contactDetails.skype}`);
            await this.skypeInput.fill(contactDetails.skype);
        }
        
        console.log('✅ Contact details updated');
    }

    async updateSocialNetworks(socialNetworks: {
        linkedin?: string;
        twitter?: string;
        facebook?: string;
    }): Promise<void> {
        console.log('📝 Updating social networks...');
        
        if (socialNetworks.linkedin && await this.linkedinInput.count() > 0) {
            console.log(`📝 Setting LinkedIn: ${socialNetworks.linkedin}`);
            await this.linkedinInput.fill(socialNetworks.linkedin);
        }
        
        if (socialNetworks.twitter && await this.twitterInput.count() > 0) {
            console.log(`📝 Setting Twitter: ${socialNetworks.twitter}`);
            await this.twitterInput.fill(socialNetworks.twitter);
        }
        
        if (socialNetworks.facebook && await this.facebookInput.count() > 0) {
            console.log(`📝 Setting Facebook: ${socialNetworks.facebook}`);
            await this.facebookInput.fill(socialNetworks.facebook);
        }
        
        console.log('✅ Social networks updated');
    }

    async saveChanges(): Promise<void> {
        console.log('📝 Saving summary changes...');
        
        await this.updateProfileButton.click();
        await this.page.waitForTimeout(2000);
        
        console.log('✅ Summary changes saved');
    }

    async validateRequiredFields(): Promise<string[]> {
        console.log('📝 Validating required fields...');
        
        const errors: string[] = [];
        
        // Check first name (required)
        const firstNameValue = await this.firstNameInput.inputValue();
        if (!firstNameValue || firstNameValue.trim() === '') {
            errors.push('First name is required');
        }
        
        // Check last name (required)
        const lastNameValue = await this.lastNameInput.inputValue();
        if (!lastNameValue || lastNameValue.trim() === '') {
            errors.push('Last name is required');
        }
        
        console.log(`✅ Validation completed: ${errors.length} errors found`);
        return errors;
    }

    async getTitleOptions(): Promise<string[]> {
        console.log('📝 Getting available title options...');
        
        const options: string[] = [];
        
        if (await this.titleSelect.count() > 0) {
            const optionElements = await this.titleSelect.locator('option').all();
            
            for (const option of optionElements) {
                const text = await option.textContent();
                if (text && text.trim() !== '- select -' && text.trim() !== 'choose') {
                    options.push(text.trim());
                }
            }
        }
        
        console.log(`✅ Found ${options.length} title options: ${options.join(', ')}`);
        return options;
    }

    async clearAllFields(): Promise<void> {
        console.log('📝 Clearing all summary fields...');
        
        const fields = [
            this.firstNameInput,
            this.middleNameInput,
            this.lastNameInput,
            this.knownAsInput,
            this.refInput,
            this.ddiInput,
            this.workExtInput,
            this.workMobileInput,
            this.skypeInput,
            this.linkedinInput,
            this.twitterInput,
            this.facebookInput
        ];
        
        for (const field of fields) {
            if (await field.count() > 0) {
                await field.clear();
            }
        }
        
        console.log('✅ All summary fields cleared');
    }
} 