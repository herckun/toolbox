import crypto from "node:crypto";

export const uqid = () => {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 12).padStart(12, "0")
  );
};
export const hashedString = (str: string) => {
  return crypto.createHash("sha256").update(str).digest("hex");
};

export function generateRandomId(length: number): string {
  const numbers = "0123456789";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";

  for (let i = 0; i < length; i++) {
    if (Math.random() < 0.8) {
      result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    } else {
      result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
  }

  return result;
}
export const generatePlaceholderPassword = () => {
  const password = Array.from({ length: 8 }, () => {
    const charSet = [
      "abcdefghijklmnopqrstuvwxyz",
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      "0123456789",
      "!@#$%^&*()_+={}[]|\\;:'\",.<>/?`~",
    ];
    const randomCharSet = charSet[Math.floor(Math.random() * charSet.length)];
    return randomCharSet[Math.floor(Math.random() * randomCharSet.length)];
  }).join("");
  return password;
};
