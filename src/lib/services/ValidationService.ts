import * as libphonenumber from "libphonenumber-js";

class ValidationService {
  private static instance: ValidationService;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  public isValidateGeolocation(latitude: number, longitude: number): boolean {
    const isLatitudeValid = latitude >= -90 && latitude <= 90;
    const isLongitudeValid = longitude >= -180 && longitude <= 180;
    return isLatitudeValid && isLongitudeValid;
  }

  public validatePhoneNumber(
    phone: string,
    code: libphonenumber.CountryCode
  ): boolean {
    try {
      const phoneNumber = libphonenumber.parsePhoneNumberWithError(phone, code);
      return phoneNumber.isValid();
    } catch (e) {
      return false;
    }
  }

  public validateStudentNumber(studentNumber: string): boolean {
    try {
      if (!studentNumber) return false;

      // Convert to uppercase and replace 'O' with '0'
      const formattedNumber = studentNumber.toUpperCase().replace(/O/g, '0');

      // Check if it matches the pattern: P followed by 8 digits
      const pattern = /^P\d{8}$/;

      return pattern.test(formattedNumber);
    } catch (e) {
      return false;
    }
  }

// Function to format the student number (if you need to clean/format the input)
   public formatStudentNumber(studentNumber: string): string {
    if (!studentNumber) return '';

    // Convert to uppercase and replace 'O' with '0'
    let formatted = studentNumber.toUpperCase().replace(/O/g, '0');

    // If it doesn't start with 'P', add it
    if (!formatted.startsWith('P')) {
      formatted = 'P' + formatted;
    }

    return formatted;
  }
}

export { ValidationService };
