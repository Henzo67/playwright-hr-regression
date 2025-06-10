import { faker } from '@faker-js/faker';

/**
 * Password requirements:
 * - At least 8 characters
 * - 1 uppercase letter
 * - 1 lowercase letter
 * - 1 number
 * - No leading or trailing spaces
 */
export function generateValidPassword(): string {
    return faker.internet.password({
        length: 12,
        prefix: 'Test',  // Ensures uppercase T
        pattern: /[a-z]/ // Ensures lowercase
    }) + '123';  // Ensures number
}

export function isValidPassword(password: string): boolean {
    if (!password) return false;
    
    // Check for leading or trailing spaces
    if (password.trim() !== password) return false;
    
    // Check minimum length
    if (password.length < 8) return false;
    
    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) return false;
    
    // Check for lowercase letter
    if (!/[a-z]/.test(password)) return false;
    
    // Check for number
    if (!/[0-9]/.test(password)) return false;
    
    return true;
}

export const INVALID_PASSWORD_EXAMPLES = {
    tooShort: 'Ab1',
    noUppercase: 'password123',
    noLowercase: 'PASSWORD123',
    noNumber: 'PasswordTest',
    leadingSpace: ' Password123',
    trailingSpace: 'Password123 ',
    onlyLetters: 'Password',
    onlyNumbers: '12345678'
}; 