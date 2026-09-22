// Locks up tokens before they are saved, and a random value helper for OAuth

const crypto = require('crypto');

const defaultKey = process.env.ENCRYPTION_KEY;
const algorithm = 'aes-256-gcm';
const ivLength = 16;

// AES-256 needs an exact key length, so any key string gets hashed to fit
function ensureKeyLength(key) {
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is required');
  }
  const hash = crypto.createHash('sha256');
  hash.update(key);
  return hash.digest();
}


function encrypt(text) {
  if (!text) return null;
  try {
    const key = ensureKeyLength(defaultKey);
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'base64url');
    encrypted += cipher.final('base64url');
    const tag = cipher.getAuthTag();
    return [iv.toString('base64url'), encrypted, tag.toString('base64url')].join(':');
  } catch (error) {
    console.error('[encryption] encrypt failed:', error);
    // Keep cipher and key details out of the error exposed to callers
    throw new Error('Failed to encrypt data');
  }
}


function decrypt(encryptedData) {
  if (!encryptedData) return null;
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }
    const [ivBase64, encrypted, tagBase64] = parts;
    const key = ensureKeyLength(defaultKey);
    const iv = Buffer.from(ivBase64, 'base64url');
    const tag = Buffer.from(tagBase64, 'base64url');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encrypted, 'base64url', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('[encryption] decrypt failed:', error);
    // Keep cipher details out of the error exposed to callers
    throw new Error('Failed to decrypt data');
  }
}


// One-time value per OAuth attempt, so a forged callback can't be replayed (NFR01)
function generateNonce() {
  return crypto.randomBytes(16).toString('base64url');
}

module.exports = {
  encrypt,
  decrypt,
  generateNonce
};
