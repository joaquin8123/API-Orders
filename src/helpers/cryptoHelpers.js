const _ = require('lodash');
var crypto = require('crypto');

const { cryptoSecretKey } = require('config');

const key = Buffer.from(_.pad(cryptoSecretKey.substring(0, 32), 32, ' '), 'utf8');
const algorithm = 'aes-256-gcm';

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  let authTag = cipher.getAuthTag();
  return (
    iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted.toString('hex')
  );
};

function decrypt(text) {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let authTag = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export { encrypt, decrypt };
