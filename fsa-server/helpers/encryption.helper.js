const crypto = require('crypto'),
    hashHelper = require('./hash.helper'),
    appConfig = require('../statics/app.config');

const delimiter = 's';

module.exports.encrypt = (text) => {
    try {
        let cipher = crypto.createCipher('aes256', appConfig.encryption.password);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return hashHelper.sha256(text) + delimiter + encrypted;
    } catch (err) {
        return null;
    }
}

module.exports.decrypt = (text) => {
    try {
        let parts = text.split(delimiter);
        if (parts.length != 2) return null;

        let decipher = crypto.createDecipher('aes256', appConfig.encryption.password);
        let decrypted = decipher.update(parts[1], 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return hashHelper.sha256(decrypted) === parts[0] ? decrypted : null;
    } catch (err) {
        return null;
    }
}