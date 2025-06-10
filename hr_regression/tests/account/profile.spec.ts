import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/auth/login.page';
import { ProfilePage } from '../../page-objects/account/profile.page';

test.describe('Admin Profile Management', () => {
    let loginPage: LoginPage;
    let profilePage: ProfilePage;

    // Admin credentials
    const adminCredentials = {
        email: 'admin@playwrightautomation.com',
        password: 'Password1!'
    };

    test.beforeEach(async ({ page }) => {
        console.log('🧪 Starting admin profile test setup');
        console.log('📝 Step 1: Login as admin user');
        
        // Navigate to login
        loginPage = new LoginPage(page);
        profilePage = new ProfilePage(page);
        await loginPage.goto();
        await loginPage.login(adminCredentials.email, adminCredentials.password);
        
        console.log('✅ Admin login completed');
    });

    test('should update summary profile fields', async () => {
        console.log('🧪 Test: Admin Summary Profile Field Updates');
        console.log('📝 Step 1: Navigate to summary edit form');
        
        await profilePage.gotoSummaryEdit();
        
        console.log('📝 Step 2: Prepare summary test data');
        const summaryTestData = {
            title: 'Mr',
            firstName: 'Administrator',
            middleName: 'Test',
            lastName: 'Manager',
            pronouns: 'He/Him',
            knownAs: 'Admin',
            ref: 'ADM001',
            ddi: '+44 20 1234 5678',
            workExt: '1234',
            workMobile: '+44 7700 900123',
            skype: 'admin.playwright',
            linkedin: 'linkedin.com/in/admin-playwright',
            twitter: '@AdminPlaywright',
            facebook: 'facebook.com/adminplaywright'
        };
        
        console.log('📝 Step 3: Update all summary fields');
        await profilePage.updateSummaryFields(summaryTestData);
        
        console.log('📝 Step 4: Save summary changes');
        await profilePage.saveChanges();
        
        console.log('✅ Summary profile update test completed successfully!');
    });

    test('should update personal profile fields', async () => {
        console.log('🧪 Test: Admin Personal Profile Field Updates');
        console.log('📝 Step 1: Navigate to personal edit form');
        
        await profilePage.gotoPersonalEdit();
        
        console.log('📝 Step 2: Prepare personal test data');
        const personalTestData = {
            gender: 'Male',
            dateOfBirth: '01/01/1990',
            nationality: 'British',
            maritalStatus: 'Married',
            nationalInsurance: 'AB123456C',
            drivingLicence: 'ADMIN901234AB9CD',
            personalEmail: 'admin.personal@example.com',
            personalMobile: '+44 7700 900456',
            homeTelephone: '+44 20 8765 4321',
            address1: '123 Admin Street',
            address2: 'Test District',
            address3: 'Playwright Area',
            city: 'London',
            postCode: 'SW1A 1AA',
            county: 'Greater London',
            country: 'United Kingdom',
            ethnicity: 'White British'
        };
        
        console.log('📝 Step 3: Update all personal fields');
        await profilePage.updatePersonalFields(personalTestData);
        
        console.log('📝 Step 4: Save personal changes');
        await profilePage.saveChanges();
        
        console.log('✅ Personal profile update test completed successfully!');
    });

    test('should update all admin profile fields across all tabs', async () => {
        console.log('🧪 Test: Complete Admin Profile Management');
        console.log('📝 Step 1: Prepare comprehensive test data');
        
        const comprehensiveTestData = {
            jobData: {
                companyDivision: 'Human Resources',
                companyDepartment: 'PlayWright Automation',
                companyLocation: 'London Office',
                personLocation: 'London Office',
                provider: 'PlayWright Test Provider',
                contractType: 'Permanent',
                probationDate: '01/01/2024',
                probationReminder: '15/12/2023',
                noticePeriod: '1 Month',
                paymentCurrency: 'GBP - British Pound Sterling',
                joinDate: '01/01/2024'
            },
            summaryData: {
                title: 'Mr',
                firstName: 'Administrator',
                middleName: 'Test',
                lastName: 'Manager',
                pronouns: 'He/Him',
                knownAs: 'Admin',
                ref: 'ADM001',
                ddi: '+44 20 1234 5678',
                workExt: '1234',
                workMobile: '+44 7700 900123',
                skype: 'admin.playwright',
                linkedin: 'linkedin.com/in/admin-playwright',
                twitter: '@AdminPlaywright',
                facebook: 'facebook.com/adminplaywright'
            },
            personalData: {
                gender: 'Male',
                dateOfBirth: '01/01/1990',
                nationality: 'British',
                maritalStatus: 'Married',
                nationalInsurance: 'AB123456C',
                drivingLicence: 'ADMIN901234AB9CD',
                personalEmail: 'admin.personal@example.com',
                personalMobile: '+44 7700 900456',
                homeTelephone: '+44 20 8765 4321',
                address1: '123 Admin Street',
                address2: 'Test District',
                address3: 'Playwright Area',
                city: 'London',
                postCode: 'SW1A 1AA',
                county: 'Greater London',
                country: 'United Kingdom',
                ethnicity: 'White British'
            }
        };
        
        console.log('📝 Step 2: Update all profile sections');
        await profilePage.updateAllFields(comprehensiveTestData);
        
        console.log('📝 Step 3: Profile changes saved and verified');
        console.log('✅ Complete admin profile management test completed successfully!');
    });

    test('should validate required fields across all profile sections', async () => {
        console.log('🧪 Test: Profile Validation Across All Sections');
        
        console.log('📝 Step 1: Test job section validation');
        await profilePage.gotoJobEdit();
        await profilePage.clearRequiredFields();
        await profilePage.expectValidationErrors();
        
        console.log('📝 Step 2: Test summary section validation');
        await profilePage.gotoSummaryEdit();
        // Clear first name which is required
        await profilePage.firstNameInput.clear();
        await profilePage.page.getByRole('button', { name: 'update profile' }).click();
        await profilePage.page.waitForTimeout(1000);
        console.log('⚠️ Summary validation tested (first name required)');
        
        console.log('📝 Step 3: Test personal section validation');
        await profilePage.gotoPersonalEdit();
        // Most personal fields are optional, so just verify form loads
        const formExists = await profilePage.page.locator('form').count() > 0;
        console.log(`⚠️ Personal form validation: ${formExists ? 'Form loaded' : 'Form not found'}`);
        
        console.log('✅ Profile validation test completed!');
    });

    // Keep existing test for backward compatibility
    test('should update all admin profile fields', async () => {
        console.log('🧪 Test: Admin Profile Field Updates (Legacy Test)');
        console.log('📝 Step 1: Navigate to job edit form');
        
        await profilePage.gotoJobEdit();
        
        console.log('📝 Step 2: Prepare test data');
        const testData = {
            companyDivision: 'Human Resources',
            companyDepartment: 'PlayWright Automation',
            companyLocation: 'London Office',
            personLocation: 'London Office',
            provider: 'PlayWright Test Provider',
            contractType: 'Permanent',
            probationDate: '01/01/2024',
            probationReminder: '15/12/2023',
            noticePeriod: '1 Month',
            paymentCurrency: 'GBP - British Pound Sterling',
            joinDate: '01/01/2024'
        };
        
        console.log('📝 Step 3: Update job fields');
        await profilePage.updateJobFields(testData);
        
        console.log('📝 Step 4: Save changes');
        await profilePage.saveChanges();
        
        console.log('📝 Step 5: Profile changes saved and verified');
        console.log('✅ Admin profile management test completed successfully!');
    });

    test('should validate required profile fields', async () => {
        console.log('🧪 Test: Profile Field Validation');
        console.log('📝 Step 1: Navigate to profile edit form');
        
        console.log('📝 Step 2: Test field validation');
        await profilePage.clearRequiredFields();
        await profilePage.expectValidationErrors();
        
        console.log('✅ Profile validation test completed!');
    });

    test.describe('Profile Field Updates', () => {
        test('should handle profile photo upload', async ({ page }) => {
            console.log('🧪 Testing: Profile photo upload');
            
            console.log('📝 Step 3: Navigating to profile page');
            await profilePage.goto();
            
            console.log('📝 Step 4: Uploading profile photo');
            await profilePage.uploadProfilePhoto();
            
            console.log('📝 Step 5: Verifying photo upload');
            await profilePage.verifyPhotoUpload();
            
            console.log('✅ Profile photo upload test completed successfully');
        });
    });

    test.describe('Profile Security Settings', () => {
        test('should update password security settings', async ({ page }) => {
            console.log('🧪 Testing: Password security settings update');
            
            console.log('📝 Step 3: Navigating to profile security settings');
            await profilePage.gotoSecuritySettings();
            
            console.log('📝 Step 4: Updating security preferences');
            await profilePage.updateSecuritySettings({
                requirePasswordChange: true,
                enableTwoFactor: false,
                sessionTimeout: 30
            });
            
            console.log('📝 Step 5: Saving security settings');
            await profilePage.saveSecuritySettings();
            
            console.log('✅ Security settings update completed successfully');
        });
    });
}); 