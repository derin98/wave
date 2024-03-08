// Description: This file contains the encryption and decryption functions.
const crypto = require('crypto');
const { CRYPTO_ALGORITHM } = require('../../configs/encryption/crypto.config');

// Algorithm used for encryption
const algorithm = CRYPTO_ALGORITHM;

// Function to encrypt data
function encrypt(text, key) {
  try {
    const secretKey = Buffer.from(key.padEnd(32, '0'), 'utf-8'); // Ensure key length is 32 bytes (256 bits)
    const iv = crypto.randomBytes(16); // Generate a random IV for each encryption
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return {
      iv: iv.toString('hex'),
      encryptedText: encrypted,
    };
  } catch (error) {
    console.error('Encryption error:', error.message);
    return null;
  }
}

function decrypt(encryptedData, key) {
  try {
    const secretKey = Buffer.from(key.padEnd(32, '0'), 'utf-8'); // Ensure key length is 32 bytes (256 bits)
    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, Buffer.from(encryptedData.iv, 'hex'));
    let decrypted = decipher.update(encryptedData.encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error.message);
    return null;
  }
}

module.exports = {
  encrypt,
  decrypt,
};
