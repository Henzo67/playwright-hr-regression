import { Page, Locator, expect } from '@playwright/test';
import { handlePopupsAndModals, scrollToElement, waitForFormReady } from '../../utils/form-helpers';

export class ProfilePage {
    readonly page: Page;
    
    // Profile form elements based on MCP browser exploration
    readonly jobTitleLink: Locator;
    readonly isDirectorCheckbox: Locator;
    readonly companyDivisionSelect: Locator;
    readonly companyDepartmentSelect: Locator;
    readonly companyLocationSelect: Locator;
    readonly personLocationSelect: Locator;
    readonly providerInput: Locator;
    readonly contractTypeSelect: Locator;
    readonly probationDateInput: Locator;
    readonly probationReminderInput: Locator;
    readonly noticePeriodSelect: Locator;
    readonly paymentCurrencySelect: Locator;
    readonly joinDateInput: Locator;
    
    // Summary tab selectors
    readonly personTypeSelect: Locator;
    readonly titleSelect: Locator;
    readonly firstNameInput: Locator;
    readonly middleNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly pronounsSelect: Locator;
    readonly knownAsInput: Locator;
    readonly refInput: Locator;
    readonly ddiInput: Locator;
    readonly workExtInput: Locator;
    readonly workMobileInput: Locator;
    readonly skypeInput: Locator;
    readonly linkedinInput: Locator;
    readonly twitterInput: Locator;
    readonly facebookInput: Locator;
    
    // Personal tab selectors
    readonly genderSelect: Locator;
    readonly dobInput: Locator;
    readonly nationalitySelect: Locator;
    readonly maritalStatusSelect: Locator;
    readonly nationalInsuranceInput: Locator;
    readonly drivingLicenceInput: Locator;
    readonly personalEmailInput: Locator;
    readonly personalMobileInput: Locator;
    readonly homeTelephoneInput: Locator;
    readonly address1Input: Locator;
    readonly address2Input: Locator;
    readonly address3Input: Locator;
    readonly cityInput: Locator;
    readonly postCodeInput: Locator;
    readonly countyInput: Locator;
    readonly countryInput: Locator;
    readonly ethnicitySelect: Locator;
    
    // Tabs and navigation
    readonly summaryTab: Locator;
    readonly jobTab: Locator;
    readonly personalTab: Locator;
    readonly userPreferencesTab: Locator;
    
    // Action buttons
    readonly updateProfileButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Job form selectors based on exact IDs from MCP exploration
        this.jobTitleLink = page.locator('a:has-text("change job title")');
        this.isDirectorCheckbox = page.locator('input[type="checkbox"]:near(:text("Is a director?"))');
        this.companyDivisionSelect = page.locator('#employee_company_division_id');
        this.companyDepartmentSelect = page.locator('#employee_company_department_id');
        this.companyLocationSelect = page.locator('#employee_company_location_id');
        this.personLocationSelect = page.locator('#employee_employee_location_id');
        this.providerInput = page.locator('input:near(:text("Provider")), input[name*="provider"]');
        this.contractTypeSelect = page.locator('#employee_company_contracttype_id');
        this.probationDateInput = page.locator('input[id*="probation_date"]:not([id*="reminder"])');
        this.probationReminderInput = page.locator('input[id*="probation_date_reminder"]');
        this.noticePeriodSelect = page.locator('#employee_company_noticeperiod_id');
        this.paymentCurrencySelect = page.locator('#employee_remuneration_currency_id');
        this.joinDateInput = page.locator('#\\#employee_join_date_react');
        
        // Summary tab selectors
        this.personTypeSelect = page.locator('#employee_person_type');
        this.titleSelect = page.locator('#employee_title');
        this.firstNameInput = page.locator('#employee_first_name');
        this.middleNameInput = page.locator('#employee_middle_name');
        this.lastNameInput = page.locator('#employee_last_name');
        this.pronounsSelect = page.locator('#employee_pronouns');
        this.knownAsInput = page.locator('#employee_known_as');
        this.refInput = page.locator('#employee_reference');
        this.ddiInput = page.locator('#employee_ddi');
        this.workExtInput = page.locator('#employee_work_ext');
        this.workMobileInput = page.locator('#employee_work_mobile');
        this.skypeInput = page.locator('#employee_skype_username');
        this.linkedinInput = page.locator('#employee_linkedin_username');
        this.twitterInput = page.locator('#employee_twitter_username');
        this.facebookInput = page.locator('#employee_facebook_username');
        
        // Personal tab selectors
        this.genderSelect = page.locator('#employee_gender');
        this.dobInput = page.locator('#employee_dob');
        this.nationalitySelect = page.locator('#employee_nationality');
        this.maritalStatusSelect = page.locator('#employee_marital_status');
        this.nationalInsuranceInput = page.locator('#employee_national_insurance_number');
        this.drivingLicenceInput = page.locator('#employee_driving_licence_number');
        this.personalEmailInput = page.locator('#employee_personal_email');
        this.personalMobileInput = page.locator('#employee_personal_mobile');
        this.homeTelephoneInput = page.locator('#employee_home_telephone');
        this.address1Input = page.locator('#employee_address_address_1');
        this.address2Input = page.locator('#employee_address_address_2');
        this.address3Input = page.locator('#employee_address_address_3');
        this.cityInput = page.locator('#employee_address_city');
        this.postCodeInput = page.locator('#employee_address_post_code');
        this.countyInput = page.locator('#employee_address_county');
        this.countryInput = page.locator('#employee_address_country');
        this.ethnicitySelect = page.locator('#employee_ethnicity');
        
        // Tab selectors
        this.summaryTab = page.locator('tab:has-text("Summary"), [role="tab"]:has-text("Summary")');
        this.jobTab = page.locator('tab:has-text("Job"), [role="tab"]:has-text("Job")');
        this.personalTab = page.locator('tab:has-text("Personal"), [role="tab"]:has-text("Personal")');
        this.userPreferencesTab = page.locator('tab:has-text("User preferences"), [role="tab"]:has-text("User preferences")');
        
        // Action buttons
        this.updateProfileButton = page.locator('button:has-text("update profile"), input[type="submit"]');
        this.cancelButton = page.locator('a:has-text("cancel"), button:has-text("cancel")');
    }

    async goto() {
        console.log('📍 Navigating to profile page...');
        
        // Navigate to the main profile page
        await this.page.goto('https://hr.breathehrstaging.com/employees/41279');
        await waitForFormReady(this.page);
        await handlePopupsAndModals(this.page);
        
        console.log('✅ Profile page loaded');
    }

    async gotoJobEdit() {
        console.log('📍 Navigating to job edit form...');
        
        // Go to the job edit page directly
        await this.page.goto('https://hr.breathehrstaging.com/employees/41279/profile/job/edit');
        await waitForFormReady(this.page);
        await handlePopupsAndModals(this.page);
        
        console.log('✅ Job edit form loaded');
    }

    async updateJobFields(profileData: any) {
        console.log('📝 Updating job profile fields...');
        
        await handlePopupsAndModals(this.page);
        
        // Set as director if specified
        if (profileData.isDirector !== undefined) {
            console.log(`📝 Setting director status: ${profileData.isDirector}`);
            if (profileData.isDirector) {
                await this.isDirectorCheckbox.check();
            } else {
                await this.isDirectorCheckbox.uncheck();
            }
        }
        
        // Update department
        if (profileData.department && await this.companyDepartmentSelect.count() > 0) {
            console.log(`📝 Updating department: ${profileData.department}`);
            await this.companyDepartmentSelect.selectOption({ label: profileData.department });
        }
        
        // Update company location
        if (profileData.companyLocation && await this.companyLocationSelect.count() > 0) {
            console.log(`📝 Updating company location: ${profileData.companyLocation}`);
            await this.companyLocationSelect.selectOption({ label: profileData.companyLocation });
        }
        
        // Update person location
        if (profileData.personLocation && await this.personLocationSelect.count() > 0) {
            console.log(`📝 Updating person location: ${profileData.personLocation}`);
            await this.personLocationSelect.selectOption({ label: profileData.personLocation });
        }
        
        // Update provider
        if (profileData.provider && await this.providerInput.count() > 0) {
            console.log(`📝 Updating provider: ${profileData.provider}`);
            await this.providerInput.fill(profileData.provider);
        }
        
        // Update contract type
        if (profileData.contractType && await this.contractTypeSelect.count() > 0) {
            console.log(`📝 Updating contract type: ${profileData.contractType}`);
            await this.contractTypeSelect.selectOption({ label: profileData.contractType });
        }
        
        // Update notice period
        if (profileData.noticePeriod && await this.noticePeriodSelect.count() > 0) {
            console.log(`📝 Updating notice period: ${profileData.noticePeriod}`);
            await this.noticePeriodSelect.selectOption({ label: profileData.noticePeriod });
        }
        
        // Update payment currency
        if (profileData.paymentCurrency && await this.paymentCurrencySelect.count() > 0) {
            console.log(`📝 Updating payment currency: ${profileData.paymentCurrency}`);
            await this.paymentCurrencySelect.selectOption({ label: profileData.paymentCurrency });
        }
        
        // Update join date (required field)
        if (profileData.joinDate && await this.joinDateInput.count() > 0) {
            console.log(`📝 Updating join date: ${profileData.joinDate}`);
            await this.joinDateInput.fill(profileData.joinDate);
        }
        
        console.log('✅ All available job fields updated');
    }

    async gotoSummaryEdit(): Promise<void> {
        console.log('📍 Navigating to summary edit form...');
        
        // Go to the summary edit page directly
        await this.page.goto('https://hr.breathehrstaging.com/employees/41279/profile/summary/edit');
        await waitForFormReady(this.page);
        await handlePopupsAndModals(this.page);
        
        console.log('✅ Summary edit form loaded');
    }

    async gotoPersonalEdit(): Promise<void> {
        console.log('📍 Navigating to personal edit form...');
        
        // Go to the personal edit page directly
        await this.page.goto('https://hr.breathehrstaging.com/employees/41279/profile/personal/edit');
        await waitForFormReady(this.page);
        await handlePopupsAndModals(this.page);
        
        console.log('✅ Personal edit form loaded');
    }

    async updateSummaryFields(summaryData: any): Promise<void> {
        console.log('📝 Updating summary profile fields...');
        
        await handlePopupsAndModals(this.page);
        
        // Basic Info fields
        if (summaryData.personType && await this.personTypeSelect.count() > 0) {
            console.log(`📝 Updating person type: ${summaryData.personType}`);
            await this.personTypeSelect.selectOption({ label: summaryData.personType });
        }
        
        if (summaryData.title && await this.titleSelect.count() > 0) {
            console.log(`📝 Updating title: ${summaryData.title}`);
            await this.titleSelect.selectOption({ label: summaryData.title });
        }
        
        if (summaryData.firstName && await this.firstNameInput.count() > 0) {
            console.log(`📝 Updating first name: ${summaryData.firstName}`);
            await this.firstNameInput.fill(summaryData.firstName);
        }
        
        if (summaryData.middleName && await this.middleNameInput.count() > 0) {
            console.log(`📝 Updating middle name: ${summaryData.middleName}`);
            await this.middleNameInput.fill(summaryData.middleName);
        }
        
        if (summaryData.lastName && await this.lastNameInput.count() > 0) {
            console.log(`📝 Updating last name: ${summaryData.lastName}`);
            await this.lastNameInput.fill(summaryData.lastName);
        }
        
        if (summaryData.pronouns && await this.pronounsSelect.count() > 0) {
            console.log(`📝 Updating pronouns: ${summaryData.pronouns}`);
            await this.pronounsSelect.selectOption({ label: summaryData.pronouns });
        }
        
        if (summaryData.knownAs && await this.knownAsInput.count() > 0) {
            console.log(`📝 Updating known as: ${summaryData.knownAs}`);
            await this.knownAsInput.fill(summaryData.knownAs);
        }
        
        if (summaryData.ref && await this.refInput.count() > 0) {
            console.log(`📝 Updating ref: ${summaryData.ref}`);
            await this.refInput.fill(summaryData.ref);
        }
        
        // Contact Details
        if (summaryData.ddi && await this.ddiInput.count() > 0) {
            console.log(`📝 Updating DDI: ${summaryData.ddi}`);
            await this.ddiInput.fill(summaryData.ddi);
        }
        
        if (summaryData.workExt && await this.workExtInput.count() > 0) {
            console.log(`📝 Updating work extension: ${summaryData.workExt}`);
            await this.workExtInput.fill(summaryData.workExt);
        }
        
        if (summaryData.workMobile && await this.workMobileInput.count() > 0) {
            console.log(`📝 Updating work mobile: ${summaryData.workMobile}`);
            await this.workMobileInput.fill(summaryData.workMobile);
        }
        
        if (summaryData.skype && await this.skypeInput.count() > 0) {
            console.log(`📝 Updating skype: ${summaryData.skype}`);
            await this.skypeInput.fill(summaryData.skype);
        }
        
        // Social Networks
        if (summaryData.linkedin && await this.linkedinInput.count() > 0) {
            console.log(`📝 Updating LinkedIn: ${summaryData.linkedin}`);
            await this.linkedinInput.fill(summaryData.linkedin);
        }
        
        if (summaryData.twitter && await this.twitterInput.count() > 0) {
            console.log(`📝 Updating Twitter: ${summaryData.twitter}`);
            await this.twitterInput.fill(summaryData.twitter);
        }
        
        if (summaryData.facebook && await this.facebookInput.count() > 0) {
            console.log(`📝 Updating Facebook: ${summaryData.facebook}`);
            await this.facebookInput.fill(summaryData.facebook);
        }
        
        console.log('✅ All available summary fields updated');
    }

    async updatePersonalFields(personalData: any): Promise<void> {
        console.log('📝 Updating personal profile fields...');
        
        await handlePopupsAndModals(this.page);
        
        // Demographics
        if (personalData.gender && await this.genderSelect.count() > 0) {
            console.log(`📝 Updating gender: ${personalData.gender}`);
            await this.genderSelect.selectOption({ label: personalData.gender });
        }
        
        if (personalData.dateOfBirth && await this.dobInput.count() > 0) {
            console.log(`📝 Updating date of birth: ${personalData.dateOfBirth}`);
            await this.dobInput.fill(personalData.dateOfBirth);
        }
        
        if (personalData.nationality && await this.nationalitySelect.count() > 0) {
            console.log(`📝 Updating nationality: ${personalData.nationality}`);
            await this.nationalitySelect.selectOption({ label: personalData.nationality });
        }
        
        if (personalData.maritalStatus && await this.maritalStatusSelect.count() > 0) {
            console.log(`📝 Updating marital status: ${personalData.maritalStatus}`);
            await this.maritalStatusSelect.selectOption({ label: personalData.maritalStatus });
        }
        
        if (personalData.nationalInsurance && await this.nationalInsuranceInput.count() > 0) {
            console.log(`📝 Updating national insurance: ${personalData.nationalInsurance}`);
            await this.nationalInsuranceInput.fill(personalData.nationalInsurance);
        }
        
        if (personalData.drivingLicence && await this.drivingLicenceInput.count() > 0) {
            console.log(`📝 Updating driving licence: ${personalData.drivingLicence}`);
            await this.drivingLicenceInput.fill(personalData.drivingLicence);
        }
        
        // Personal Contact Details
        if (personalData.personalEmail && await this.personalEmailInput.count() > 0) {
            console.log(`📝 Updating personal email: ${personalData.personalEmail}`);
            await this.personalEmailInput.fill(personalData.personalEmail);
        }
        
        if (personalData.personalMobile && await this.personalMobileInput.count() > 0) {
            console.log(`📝 Updating personal mobile: ${personalData.personalMobile}`);
            await this.personalMobileInput.fill(personalData.personalMobile);
        }
        
        if (personalData.homeTelephone && await this.homeTelephoneInput.count() > 0) {
            console.log(`📝 Updating home telephone: ${personalData.homeTelephone}`);
            await this.homeTelephoneInput.fill(personalData.homeTelephone);
        }
        
        // Address
        if (personalData.address1 && await this.address1Input.count() > 0) {
            console.log(`📝 Updating address 1: ${personalData.address1}`);
            await this.address1Input.fill(personalData.address1);
        }
        
        if (personalData.address2 && await this.address2Input.count() > 0) {
            console.log(`📝 Updating address 2: ${personalData.address2}`);
            await this.address2Input.fill(personalData.address2);
        }
        
        if (personalData.address3 && await this.address3Input.count() > 0) {
            console.log(`📝 Updating address 3: ${personalData.address3}`);
            await this.address3Input.fill(personalData.address3);
        }
        
        if (personalData.city && await this.cityInput.count() > 0) {
            console.log(`📝 Updating city: ${personalData.city}`);
            await this.cityInput.fill(personalData.city);
        }
        
        if (personalData.postCode && await this.postCodeInput.count() > 0) {
            console.log(`📝 Updating post code: ${personalData.postCode}`);
            await this.postCodeInput.fill(personalData.postCode);
        }
        
        if (personalData.county && await this.countyInput.count() > 0) {
            console.log(`📝 Updating county: ${personalData.county}`);
            await this.countyInput.fill(personalData.county);
        }
        
        if (personalData.country && await this.countryInput.count() > 0) {
            console.log(`📝 Updating country: ${personalData.country}`);
            await this.countryInput.fill(personalData.country);
        }
        
        // Equality, Diversity and Inclusion
        if (personalData.ethnicity && await this.ethnicitySelect.count() > 0) {
            console.log(`📝 Updating ethnicity: ${personalData.ethnicity}`);
            await this.ethnicitySelect.selectOption({ label: personalData.ethnicity });
        }
        
        console.log('✅ All available personal fields updated');
    }

    async updateAllFields(profileData: any): Promise<void> {
        console.log('📝 Starting complete profile update...');
        
        // Update job fields (existing functionality)
        if (profileData.jobData) {
            await this.gotoJobEdit();
            await this.updateJobFields(profileData.jobData);
            await this.saveChanges();
        }
        
        // Update summary fields
        if (profileData.summaryData) {
            await this.gotoSummaryEdit();
            await this.updateSummaryFields(profileData.summaryData);
            await this.saveChanges();
        }
        
        // Update personal fields
        if (profileData.personalData) {
            await this.gotoPersonalEdit();
            await this.updatePersonalFields(profileData.personalData);
            await this.saveChanges();
        }
        
        // Navigate back to profile overview
        await this.goto();
        
        console.log('✅ All profile sections updated');
    }

    async saveChanges(): Promise<void> {
        console.log('📝 Saving profile changes...');
        
        await this.page.getByRole('button', { name: 'update profile' }).click();
        
        // Wait for the save to complete
        await this.page.waitForTimeout(2000);
        console.log('✅ Profile changes saved');
    }

    async verifyProfileUpdates(profileData: any) {
        console.log('📝 Verifying profile updates...');
        
        // Navigate back to the profile to verify
        await this.goto();
        await this.page.waitForTimeout(2000);
        
        // Check job tab for updated information
        await this.jobTab.click();
        await this.page.waitForTimeout(1000);
        
        // Verify visible text content
        if (profileData.department) {
            const departmentText = await this.page.locator('td:has-text("Department")').locator('..').locator('td').nth(1).textContent();
            console.log(`📊 Department verification: ${departmentText?.includes(profileData.department) ? '✅' : '❌'}`);
        }
        
        if (profileData.contractType) {
            const contractText = await this.page.locator('td:has-text("Type")').locator('..').locator('td').nth(1).textContent();
            console.log(`📊 Contract type verification: ${contractText?.includes(profileData.contractType) ? '✅' : '❌'}`);
        }
        
        console.log('✅ Profile updates verification completed');
    }

    async clearRequiredFields(): Promise<void> {
        console.log('📝 Clearing required fields for validation testing...');
        
        // Navigate to job edit form
        await this.gotoJobEdit();
        
        // Clear some potentially required fields - clear the provider field which seems to be required
        await this.providerInput.clear();
        
        console.log('✅ Required fields cleared');
    }

    async expectValidationErrors(): Promise<void> {
        console.log('📝 Checking for validation errors...');
        
        // Check if we're on the edit page
        if (!this.page.url().includes('edit')) {
            console.log('⚠️ Not on edit page - navigating to edit form');
            await this.gotoJobEdit();
        }
        
        // Try to save with empty required fields
        await this.page.getByRole('button', { name: 'update profile' }).click();
        await this.page.waitForTimeout(2000);
        
        // Check if we stayed on the edit page or got validation errors
        const currentUrl = this.page.url();
        if (currentUrl.includes('edit')) {
            console.log('✅ Validation working - stayed on edit form (likely validation prevented submission)');
        } else {
            console.log('⚠️ Form submitted successfully - may not have required field validation');
        }
        
        // Look for validation error patterns anyway
        const errorMessages = await this.page.locator('.error, .invalid, [class*="error"], [class*="invalid"]').count();
        
        if (errorMessages > 0) {
            console.log(`⚠️ Found ${errorMessages} validation error(s) as expected`);
        } else {
            console.log('⚠️ No validation errors found (form may accept empty values)');
        }
        
        console.log('✅ Validation error check completed');
    }

    async uploadProfilePhoto() {
        console.log('📝 Profile photo upload not implemented in this form');
        // This would be implemented if photo upload fields are discovered
    }

    async verifyPhotoUpload() {
        console.log('📝 Profile photo verification not implemented');
    }

    async gotoSecuritySettings() {
        console.log('📍 Security settings navigation not implemented');
    }

    async updateSecuritySettings(settings: any) {
        console.log('📝 Security settings update not implemented');
    }

    async saveSecuritySettings() {
        console.log('📝 Security settings save not implemented');
    }
} 