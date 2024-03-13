// Description: This file contains the encryption and decryption functions.
const crypto = require('crypto');
const { CRYPTO_ALGORITHM } = require('../../configs/encryption/crypto.config');
const CryptoJS = require("crypto-js");
// Algorithm used for encryption
const algorithm = CRYPTO_ALGORITHM;

// Function to encrypt data
// function encrypt(text, key) {
//   try {
//     const secretKey = Buffer.from(key.padEnd(32, '0'), 'utf-8'); // Ensure key length is 32 bytes (256 bits)
//     const iv = crypto.randomBytes(16); // Generate a random IV for each encryption
//     const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
//     let encrypted = cipher.update(text, 'utf-8', 'hex');
//     encrypted += cipher.final('hex');
//     return {
//       iv: iv.toString('hex'),
//       encryptedText: encrypted,
//     };
//   } catch (error) {
//     console.error('Encryption error:', error.message);
//     return null;
//   }
// }
//
// function decrypt(encryptedData, key) {
//   console.log("encryptedData", encryptedData)
//   try {
//     const secretKey = Buffer.from(key.padEnd(32, '0'), 'utf-8'); // Ensure key length is 32 bytes (256 bits)
//     const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, Buffer.from(encryptedData.iv, 'hex'));
//     let decrypted = decipher.update(encryptedData.encryptedText, 'hex', 'utf-8');
//     decrypted += decipher.final('utf-8');
//     return decrypted;
//   } catch (error) {
//     console.error('Decryption error:', error.message);
//     return null;
//   }
// }

function encrypt(text, key, algorithm) {
  key = Buffer.from(key.padEnd(32, '0'), 'utf-8'); // Ensure key length is 32 bytes (256 bits)
  const cipher = crypto.createCipheriv('aes-256-ecb', key, Buffer.alloc(0));
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

function decrypt(encryptedText, key) {
  key = Buffer.from(key.padEnd(32, '0'), 'utf-8'); // Ensure key length is 32 bytes (256 bits)
  const decipher = crypto.createDecipheriv('aes-256-ecb', key, Buffer.alloc(0));
  let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
decrypted += decipher.final('utf8');
  return decrypted;
}


const dummyDecryptionToken = (encryptedText, secretKey) => {

  const paddedKey = secretKey.padEnd(32, '0'); // Ensure key length is 32 bytes (256 bits)
  // const decrypted = CryptoJS.AES.decrypt(encryptedText, paddedKey).toString(CryptoJS.enc.Utf8);
  const decrypted = CryptoJS.AES.decrypt(encryptedText, paddedKey, { iv: CryptoJS.enc.Hex.parse(iv), mode: CryptoJS.mode.CBC }).toString(CryptoJS.enc.Utf8);
  console.log(decrypted, "dec pass");

  return decrypted;
};


module.exports = {
  encrypt,
  decrypt,
  dummyDecryptionToken,
};
