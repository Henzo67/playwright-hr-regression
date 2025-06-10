import { faker } from '@faker-js/faker';

/**
 * Generates a valid UK phone number in the format:
 * 07XXXXXXXXX (mobile) - 11 digits
 * 01XXXXXXXXX (landline) - 11 digits
 * 02XXXXXXXXX (landline) - 11 digits
 * 
 * @param type 'mobile' | 'landline' (defaults to mobile)
 * @returns formatted UK phone number
 */
export function generateUKPhoneNumber(type: 'mobile' | 'landline' = 'mobile'): string {
    if (type === 'mobile') {
        // UK mobile numbers start with 07
        const remainingDigits = faker.number.int({ min: 100000000, max: 999999999 });
        return `07${remainingDigits}`; // Always 11 digits: 07 + 9 digits
    } else {
        // UK landline numbers start with 01 or 02
        const landlinePrefix = faker.helpers.arrayElement(['1', '2']);
        const remainingDigits = faker.number.int({ min: 100000000, max: 999999999 });
        return `0${landlinePrefix}${remainingDigits}`; // Always 11 digits: 01/02 + 9 digits
    }
} 