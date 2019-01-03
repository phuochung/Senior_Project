const hashHelper = require('./hash.helper');

module.exports.hash = (username, password) => {
    return hashHelper.sha512(`${username}.${password}`);
}