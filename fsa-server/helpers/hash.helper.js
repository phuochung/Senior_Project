const crypto = require('crypto');

module.exports.hash = (algorithm, text) => {
    return crypto.createHash(algorithm).update(text).digest('hex');
}

module.exports.md5 = (text) => {
    return this.hash('md5', text);
}

module.exports.sha256 = (text) => {
    return this.hash('sha256', text);
}

module.exports.sha512 = (text) => {
    return this.hash('sha512', text);
}

module.exports.hash32bit = (text) => {
    var hash = 0, i, chr;
    if (text.length === 0) return hash;
    for (i = 0; i < text.length; i++) {
      chr   = text.charCodeAt(i);
      hash  = ((hash << 4) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
  