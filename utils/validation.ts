/**
 * Validates an email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a phone number (Tanzania format)
 * Accepts formats like: +255712345678, 255712345678, 0712345678
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  // Remove any spaces, dashes, or parentheses
  const cleanPhone = phone.replace(/[\s-()]/g, '');
  
  // Check for Tanzania phone number formats
  const tzPhoneRegex = /^(?:(?:\+|00)255|0)?\d{9}$/;
  return tzPhoneRegex.test(cleanPhone);
};

/**
 * Formats a phone number to E.164 format (used for SMS verification)
 * +255XXXXXXXXX
 */
export const formatPhoneNumberE164 = (phone: string): string => {
  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Handle different formats
  if (digits.startsWith('0') && digits.length === 10) {
    // Convert 0712345678 to +255712345678
    return `+255${digits.substring(1)}`;
  } else if (digits.startsWith('255') && digits.length === 12) {
    // Convert 255712345678 to +255712345678
    return `+${digits}`;
  } else if (digits.length === 9) {
    // Convert 712345678 to +255712345678
    return `+255${digits}`;
  }
  
  // If it's already in international format or invalid, return as is
  return phone.startsWith('+') ? phone : `+${phone}`;
};

/**
 * Validates a password (min 8 chars, at least 1 letter and 1 number)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8 && 
         /[A-Za-z]/.test(password) && 
         /[0-9]/.test(password);
};

/**
 * Gets password strength score (0-4)
 * 0: Very weak, 1: Weak, 2: Medium, 3: Strong, 4: Very strong
 */
export const getPasswordStrength = (password: string): number => {
  let score = 0;
  
  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Character variety checks
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  // Cap score at 4
  return Math.min(4, Math.floor(score / 2));
};

/**
 * Validates a listing price (must be positive number)
 */
export const isValidPrice = (price: number | string): boolean => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return !isNaN(numPrice) && numPrice > 0;
};

/**
 * Validates listing latitude and longitude
 */
export const isValidLocation = (lat: number, lng: number): boolean => {
  return !isNaN(lat) && !isNaN(lng) && 
         lat >= -90 && lat <= 90 && 
         lng >= -180 && lng <= 180;
};

/**
 * Validates text input is not empty
 */
export const isNotEmpty = (text: string): boolean => {
  return text.trim().length > 0;
};