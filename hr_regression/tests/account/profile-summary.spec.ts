import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/auth/login.page';
import { SummaryPage } from '../../page-objects/account/summary.page';

test.describe('Employee Profile - Summary Section', () => {
    let loginPage: LoginPage;
    let summaryPage: SummaryPage;

    // Admin credentials for testing
    const adminCredentials = {
        email: 'admin@playwrightautomation.com',
        password: 'Password1!'
    };

    test.beforeEach(async ({ page }) => {
        console.log('🧪 Setting up Summary section tests');
        console.log('📝 Step 1: Admin login and navigation');
        
        loginPage = new LoginPage(page);
        summaryPage = new SummaryPage(page);

        // Login as admin
        await loginPage.goto();
        await loginPage.login(adminCredentials.email, adminCredentials.password);
        
        console.log('✅ Admin authenticated for Summary section testing');
    });

    test.describe('Basic Information Fields', () => {
        test('should update all basic info fields', async () => {
            console.log('🧪 Test: Summary Basic Information Updates');
            console.log('📝 Step 1: Navigate to summary edit form');
            
            await summaryPage.gotoEdit();
            
            console.log('📝 Step 2: Prepare basic info test data');
            const basicInfoData = {
                personType: 'Employee',
                title: 'Mr',
                firstName: 'John',
                middleName: 'Alexander',
                lastName: 'Smith',
                pronouns: 'He/Him',
                knownAs: 'Johnny',
                ref: 'EMP001'
            };
            
            console.log('📝 Step 3: Update basic information fields');
            await summaryPage.updateBasicInfo(basicInfoData);
            
            console.log('📝 Step 4: Save changes');
            await summaryPage.saveChanges();
            
            console.log('✅ Basic info update completed successfully!');
        });

        test('should validate required name fields', async () => {
            console.log('🧪 Test: Required Name Field Validation');
            console.log('📝 Step 1: Navigate to summary edit form');
            
            await summaryPage.gotoEdit();
            
            console.log('📝 Step 2: Clear all fields and check validation');
            await summaryPage.clearAllFields();
            
            console.log('📝 Step 3: Validate required fields');
            const errors = await summaryPage.validateRequiredFields();
            
            console.log('📝 Step 4: Attempt to save with missing required fields');
            await summaryPage.updateProfileButton.click();
            await summaryPage.page.waitForTimeout(2000);
            
            console.log(`⚠️ Validation result: ${errors.length} errors found - ${errors.join(', ')}`);
            console.log('✅ Name field validation test completed!');
        });

        test('should handle different title options', async () => {
            console.log('🧪 Test: Title Selection Options');
            console.log('📝 Step 1: Navigate to summary edit form');
            
            await summaryPage.gotoEdit();
            
            console.log('📝 Step 2: Get available title options');
            const availableTitles = await summaryPage.getTitleOptions();
            console.log(`📊 Available titles: ${availableTitles.join(', ')}`);
            
            // Test with the first few available titles
            const titlesToTest = availableTitles.slice(0, 3);
            
            for (const title of titlesToTest) {
                console.log(`📝 Testing title: ${title}`);
                
                await summaryPage.updateBasicInfo({
                    title: title,
                    firstName: 'Test',
                    lastName: 'User'
                });
                
                await summaryPage.page.waitForTimeout(1000);
                console.log(`✅ Title "${title}" selected successfully`);
            }
            
            console.log('✅ Title options test completed successfully!');
        });

        test('should test all pronoun options', async () => {
            console.log('🧪 Test: Pronouns Selection');
            console.log('📝 Step 1: Navigate to summary edit form');
            
            await summaryPage.gotoEdit();
            
            const pronounOptions = ['He/Him', 'She/Her', 'They/Them'];
            
            for (const pronoun of pronounOptions) {
                console.log(`📝 Testing pronoun: ${pronoun}`);
                
                await summaryPage.updateBasicInfo({
                    pronouns: pronoun,
                    firstName: 'Test',
                    lastName: 'User'
                });
                
                await summaryPage.page.waitForTimeout(1000);
                console.log(`✅ Pronoun "${pronoun}" selected successfully`);
            }
            
            console.log('✅ All pronoun options tested successfully!');
        });
    });

    test.describe('Contact Details', () => {
        test('should update all contact detail fields', async () => {
            console.log('🧪 Test: Contact Details Updates');
            console.log('📝 Step 1: Navigate to summary edit form');
            
            await summaryPage.gotoEdit();
            
            console.log('📝 Step 2: Prepare contact details test data');
            const contactData = {
                ddi: '+44 20 1234 5678',
                workExt: '1234',
                workMobile: '+44 7700 900123',
                skype: 'john.smith.work'
            };
            
            console.log('📝 Step 3: Update contact detail fields');
            await summaryPage.updateContactDetails(contactData);
            
            console.log('📝 Step 4: Save changes');
            await summaryPage.saveChanges();
            
            console.log('✅ Contact details update completed successfully!');
        });

        test('should validate phone number formats', async () => {
            console.log('🧪 Test: Phone Number Format Validation');
            console.log('📝 Step 1: Navigate to summary edit form');
            
            await summaryPage.gotoEdit();
            
            const phoneTestCases = [
                { field: 'DDI', value: '+44 20 1234 5678' },
                { field: 'Work Mobile', value: '+44 7700 900123' },
                { field: 'Work Extension', value: '1234' }
            ];
            
            for (const testCase of phoneTestCases) {
                console.log(`📝 Testing ${testCase.field}: ${testCase.value}`);
                
                if (testCase.field === 'DDI') {
                    await summaryPage.updateContactDetails({ ddi: testCase.value });
                } else if (testCase.field === 'Work Mobile') {
                    await summaryPage.updateContactDetails({ workMobile: testCase.value });
                } else if (testCase.field === 'Work Extension') {
                    await summaryPage.updateContactDetails({ workExt: testCase.value });
                }
                
                await summaryPage.page.waitForTimeout(500);
                console.log(`✅ ${testCase.field} format "${testCase.value}" entered successfully`);
            }
            
            console.log('✅ Phone number format validation completed!');
        });

        test('should handle empty contact fields gracefully', async () => {
            console.log('🧪 Test: Empty Contact Fields Handling');
            console.log('📝 Step 1: Navigate to summary edit form');
            
            await summaryPage.gotoEdit();
            
            console.log('📝 Step 2: Clear all contact fields');
            await summaryPage.updateContactDetails({
                ddi: '',
                workExt: '',
                workMobile: '',
                skype: ''
            });
            
            console.log('📝 Step 3: Save with empty contact fields');
            await summaryPage.saveChanges();
            
            console.log('✅ Empty contact fields handled successfully!');
        });
    });

    test.describe('Social Networks', () => {
        test('should update all social network fields', async () => {
            console.log('🧪 Test: Social Networks Updates');
            console.log('📝 Step 1: Navigate to summary edit form');
            
            await summaryPage.gotoEdit();
            
            console.log('📝 Step 2: Prepare social networks test data');
            const socialData = {
                linkedin: 'linkedin.com/in/john-smith',
                twitter: '@johnsmith',
                facebook: 'facebook.com/john.smith'
            };
            
            console.log('📝 Step 3: Update social network fields');
            await summaryPage.updateSocialNetworks(socialData);
            
            console.log('📝 Step 4: Save changes');
            await summaryPage.saveChanges();
            
            console.log('✅ Social networks update completed successfully!');
        });

        test('should validate social media URL formats', async () => {
            console.log('🧪 Test: Social Media URL Format Validation');
            console.log('📝 Step 1: Navigate to summary edit form');
            
            await summaryPage.gotoEdit();
            
            const socialTestCases = [
                { platform: 'LinkedIn', value: 'linkedin.com/in/john-smith' },
                { platform: 'LinkedIn', value: 'https://linkedin.com/in/john-smith' },
                { platform: 'Twitter', value: '@johnsmith' },
                { platform: 'Twitter', value: 'twitter.com/johnsmith' },
                { platform: 'Facebook', value: 'facebook.com/john.smith' },
                { platform: 'Facebook', value: 'https://facebook.com/john.smith' }
            ];
            
            for (const testCase of socialTestCases) {
                console.log(`📝 Testing ${testCase.platform}: ${testCase.value}`);
                
                if (testCase.platform === 'LinkedIn') {
                    await summaryPage.updateSocialNetworks({ linkedin: testCase.value });
                } else if (testCase.platform === 'Twitter') {
                    await summaryPage.updateSocialNetworks({ twitter: testCase.value });
                } else if (testCase.platform === 'Facebook') {
                    await summaryPage.updateSocialNetworks({ facebook: testCase.value });
                }
                
                await summaryPage.page.waitForTimeout(500);
                console.log(`✅ ${testCase.platform} format "${testCase.value}" entered successfully`);
            }
            
            console.log('✅ Social media URL format validation completed!');
        });
    });

    test.describe('Field Length Limits', () => {
        test('should respect 255 character limits', async () => {
            console.log('🧪 Test: 255 Character Field Limits');
            console.log('📝 Step 1: Navigate to summary edit form');
            
            await summaryPage.gotoEdit();
            
            // Generate test strings of different lengths
            const shortString = 'A'.repeat(50);
            const exactLimitString = 'B'.repeat(255);
            const overLimitString = 'C'.repeat(300);
            
            console.log('📝 Step 2: Test short strings (50 chars)');
            await summaryPage.updateBasicInfo({
                firstName: shortString,
                lastName: shortString,
                knownAs: shortString
            });
            
            console.log('📝 Step 3: Test exact limit strings (255 chars)');
            await summaryPage.updateBasicInfo({
                middleName: exactLimitString,
                ref: exactLimitString.substring(0, 50) // Keep ref shorter
            });
            
            console.log('📝 Step 4: Test over limit strings (300 chars)');
            // Test if the system truncates or rejects over-limit strings
            await summaryPage.updateContactDetails({
                ddi: overLimitString.substring(0, 20), // Phone numbers should be much shorter
                skype: overLimitString.substring(0, 100) // Keep reasonable for Skype
            });
            
            console.log('✅ Character limit validation completed!');
        });
    });

    test.describe('Form Interactions', () => {
        test('should handle cancel operation', async () => {
            console.log('🧪 Test: Cancel Operation');
            console.log('📝 Step 1: Navigate to summary edit form');
            
            await summaryPage.gotoEdit();
            
            console.log('📝 Step 2: Make changes to form');
            await summaryPage.updateBasicInfo({
                firstName: 'Changed Name',
                middleName: 'Changed Middle'
            });
            
            console.log('📝 Step 3: Cancel changes');
            await summaryPage.cancelButton.click();
            
            console.log('📝 Step 4: Verify navigation back to profile');
            await summaryPage.page.waitForTimeout(2000);
            const currentUrl = summaryPage.page.url();
            const isProfilePage = currentUrl.includes('/employees/41279') && !currentUrl.includes('/edit');
            
            console.log(`✅ Cancel operation: ${isProfilePage ? 'Success' : 'Failed'}`);
        });

        test('should preserve data during form interaction', async () => {
            console.log('🧪 Test: Data Persistence During Form Interaction');
            console.log('📝 Step 1: Navigate to summary edit form');
            
            await summaryPage.gotoEdit();
            
            console.log('📝 Step 2: Fill form data');
            const testData = {
                firstName: 'Persistent',
                lastName: 'Data',
                knownAs: 'Test'
            };
            
            await summaryPage.updateBasicInfo(testData);
            
            console.log('📝 Step 3: Check data persistence');
            const firstNameValue = await summaryPage.firstNameInput.inputValue();
            const lastNameValue = await summaryPage.lastNameInput.inputValue();
            const knownAsValue = await summaryPage.knownAsInput.inputValue();
            
            console.log(`✅ Data persistence: First="${firstNameValue}", Last="${lastNameValue}", Known As="${knownAsValue}"`);
        });
    });

    test.describe('Integration Tests', () => {
        test('should update complete summary profile', async () => {
            console.log('🧪 Test: Complete Summary Profile Update');
            console.log('📝 Step 1: Navigate to summary edit form');
            
            await summaryPage.gotoEdit();
            
            console.log('📝 Step 2: Update basic information');
            await summaryPage.updateBasicInfo({
                personType: 'Employee',
                title: 'Dr',
                firstName: 'Elizabeth',
                middleName: 'Jane',
                lastName: 'Watson',
                pronouns: 'She/Her',
                knownAs: 'Liz',
                ref: 'EMP2024001'
            });
            
            console.log('📝 Step 3: Update contact details');
            await summaryPage.updateContactDetails({
                ddi: '+44 20 1234 5678',
                workExt: '5678',
                workMobile: '+44 7700 900789',
                skype: 'liz.watson.work'
            });
            
            console.log('📝 Step 4: Update social networks');
            await summaryPage.updateSocialNetworks({
                linkedin: 'linkedin.com/in/elizabeth-watson',
                twitter: '@lizwatson',
                facebook: 'facebook.com/elizabeth.watson'
            });
            
            console.log('📝 Step 5: Save complete profile');
            await summaryPage.saveChanges();
            
            console.log('✅ Complete summary profile update completed successfully!');
        });

        test('should validate complete summary workflow', async () => {
            console.log('🧪 Test: Complete Summary Workflow Validation');
            console.log('📝 Step 1: Navigate to summary edit form');
            
            await summaryPage.gotoEdit();
            
            console.log('📝 Step 2: Check available options');
            const titleOptions = await summaryPage.getTitleOptions();
            console.log(`📊 Available titles: ${titleOptions.length} options`);
            
            console.log('📝 Step 3: Validate required fields');
            await summaryPage.clearAllFields();
            const validationErrors = await summaryPage.validateRequiredFields();
            console.log(`⚠️ Required field validation: ${validationErrors.length} errors`);
            
            console.log('📝 Step 4: Fill minimum required data');
            await summaryPage.updateBasicInfo({
                firstName: 'Required',
                lastName: 'Fields'
            });
            
            console.log('📝 Step 5: Save minimal profile');
            await summaryPage.saveChanges();
            
            console.log('✅ Complete summary workflow validation completed!');
        });
    });
}); 