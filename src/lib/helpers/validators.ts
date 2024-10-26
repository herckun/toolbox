export const validateInput = (
  input: string | number | null | undefined,
  options: {
    regex?: RegExp; // Optional regex check
    maxLength?: number; // Optional characters count check
    required?: boolean; // Optional required flag
    min?: number; // Optional minimum number limit
    max?: number; // Optional maximum number limit
  },
): boolean => {
  const { regex, maxLength, required, min, max } = options;

  // Check if input is required and is either null or undefined
  if (
    required &&
    (input === null ||
      input === undefined ||
      (typeof input === "string" && input.trim().length === 0))
  ) {
    return false;
  }

  // If input is not required and is either null or undefined, it's valid
  if (!required && (input === null || input === undefined)) {
    return true;
  }

  // Type narrowing for `string`
  if (typeof input === "string") {
    // Check regex
    if (regex && !regex.test(input)) {
      return false;
    }

    // Check maxLength
    if (maxLength !== undefined && input.length > maxLength) {
      return false;
    }
  }

  // Type narrowing for `number`
  if (typeof input === "number") {
    // Check min and max
    if (min !== undefined && input < min) {
      return false;
    }
    if (max !== undefined && input > max) {
      return false;
    }
  }

  return true;
};
