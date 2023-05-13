const crypto = require('crypto');

const cypherKey = Buffer.from("passwordpasswordpasswordpassword");

//Encrypting text
function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', cypherKey, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return (iv.toString('hex')+"|"+encrypted.toString('hex'));
 }
 
 // Decrypting text
function decrypt(text) {
    const [ivStr, textStr] = text.split('|')
    const iv = Buffer.from(ivStr, 'hex');
    const encryptedText = Buffer.from(textStr, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', cypherKey, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
 }

module.exports = {encrypt, decrypt}