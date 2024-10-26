export const sanitizeMessage = (message: string) => {
  message = message.replace(/&/g, "&amp;");
  message = message.replace(/</g, "&lt;");
  message = message.replace(/>/g, "&gt;");
  message = message.replace(/"/g, "&quot;");
  message = message.replace(/'/g, "&#39;");
  return message;
};

export const sanitizeString = (input: string): string => {
  let sanitized = input.trim();

  sanitized = sanitized
    .replace(/&/g, "&amp;") // Convert & to &amp;
    .replace(/</g, "&lt;") // Convert < to &lt;
    .replace(/>/g, "&gt;") // Convert > to &gt;
    .replace(/"/g, "&quot;") // Convert " to &quot;
    .replace(/'/g, "&#039;"); // Convert ' to &#039;

  sanitized = sanitized.replace(/<script[^>]*?>.*?<\/script>/gi, ""); // Remove <script> tags
  sanitized = sanitized.replace(/<\/?[^>]+(>|$)/g, ""); // Remove any other HTML tags

  return sanitized;
};
