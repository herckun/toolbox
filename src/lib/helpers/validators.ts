export const validateInput = (
  input: string | number | null | undefined,
  options: {
    regex?: RegExp;
    maxLength?: number;
    required?: boolean;
    min?: number;
    max?: number;
  }
): boolean => {
  const { regex, maxLength, required, min, max } = options;

  if (
    required &&
    (input === null ||
      input === undefined ||
      (typeof input === "string" && input.trim().length === 0))
  ) {
    return false;
  }

  if (!required && (input === null || input === undefined)) {
    return true;
  }

  if (typeof input === "string") {
    if (regex && !regex.test(input)) {
      return false;
    }

    if (maxLength !== undefined && input.length > maxLength) {
      return false;
    }
  }

  if (typeof input === "number") {
    if (min !== undefined && input < min) {
      return false;
    }
    if (max !== undefined && input > max) {
      return false;
    }
  }

  return true;
};
