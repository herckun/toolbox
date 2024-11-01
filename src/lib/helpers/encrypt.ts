import crypto from "node:crypto";

export const encryptSymmetric = (key: Buffer, plaintext: string) => {
  const iv = crypto.randomBytes(12).toString("base64");
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  let ciphertext = cipher.update(plaintext, "utf8", "base64");
  ciphertext += cipher.final("base64");
  const tag = cipher.getAuthTag();

  return { ciphertext, iv, tag };
};

export const decryptSymmetric = (
  key: Buffer,
  ciphertext: string,
  iv: string,
  tag: Buffer
) => {
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);

  decipher.setAuthTag(tag);

  let plaintext = decipher.update(ciphertext, "base64", "utf8");
  plaintext += decipher.final("utf8");

  return plaintext;
};
