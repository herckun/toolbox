export const RegexPatterns = {
  OnlyLetters: /^[A-Za-z]+$/,
  OnlyNumbers: /^[0-9]+$/,
  LettersAndNumbers: /^[A-Za-z0-9]+$/,
  LettersNumbersAndSpaces: /^(?=.*[A-Za-z0-9])[A-Za-z0-9\s]+$/, // Modified: Requires at least one letter or number
  LettersNumbersAndSpecialChars:
    /^[A-Za-z0-9!@#$%^&*()_+={}[\]|\\;:'",.<>/?`~]+$/,
  LettersNumbersSpecialCharsAndSpaces:
    /^(?=.*[A-Za-z0-9!@#$%^&*()_+={}[\]|\\;:'",.<>/?`~])[A-Za-z0-9!@#$%^&*()_+={}[\]|\\;:'",.<>/?`~\s]+$/, // Modified: Requires at least one letter, number, or special character
  Email: /^[\w\-.]+@([\w-]+\.)+[a-zA-Z]{2,7}$/,
  URL: /^(http:\/\/|https:\/\/)[^\s/$.?#].[^\s]*$/,
  PhoneNumber:
    /^[+\d]{1,4}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
  DateYYYYMMDD: /^\d{4}-\d{2}-\d{2}$/,
  DateYYYYMMDDorDDMMYYYY: /^(?:\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})$/,
  ZIPCodeUS: /^\d{5}(?:-\d{4})?$/,
  PasswordComplex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/,
  NameFirstAndLast: /^[A-Z][a-z]+ [A-Z][a-z]+$/,
  TimeHHMM: /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/,
  DecimalUpToTwoPlaces: /^\d+(\.\d{1,2})?$/,
  Empty: /^$/,
};

export const describeAllowedChars = (regex: RegExp): string => {
  for (const [key, pattern] of Object.entries(RegexPatterns)) {
    if (regex.source === pattern.source && regex.flags === pattern.flags) {
      switch (key) {
        case "OnlyLetters":
          return "Only letters allowed (A-Z, a-z)";
        case "OnlyNumbers":
          return "Only numbers allowed (0-9)";
        case "LettersAndNumbers":
          return "Only letters and numbers allowed";
        case "LettersNumbersAndSpaces":
          return "Letters, numbers, and spaces allowed (spaces must be accompanied by letters or numbers)";
        case "LettersNumbersAndSpecialChars":
          return "Letters, numbers, and common special characters allowed";
        case "LettersNumbersSpecialCharsAndSpaces":
          return "Letters, numbers, special characters, and spaces allowed (spaces must be accompanied by letters, numbers, or special characters)";
        case "Email":
          return "Only email address format allowed (username@domain)";
        case "URL":
          return "Valid URL format";
        case "PhoneNumber":
          return "Valid phone number format";
        case "DateYYYYMMDD":
          return "Date format (YYYY-MM-DD)";
        case "DateYYYYMMDDorDDMMYYYY":
          return "Date format (YYYY-MM-DD or DD/MM/YYYY)";
        case "ZIPCodeUS":
          return "US ZIP code format (XXXXX or XXXXX-XXXX)";
        case "PasswordComplex":
          return "Only a password with at least 8 characters, including a number, a lowercase letter, an uppercase letter, and a special character allowed";
        case "NameFirstAndLast":
          return "First name and last name (e.g., John Doe)";
        case "TimeHHMM":
          return "Time format (HH:MM, 24-hour)";
        case "DecimalUpToTwoPlaces":
          return "Decimal number with up to two decimal places";
      }
    }
  }

  // Fallback case for patterns not explicitly handled
  return "Invalid characters";
};
