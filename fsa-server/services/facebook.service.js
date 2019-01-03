const request = require('request'),
    appConfig = require('../statics/app.config');

module.exports.getUserInfo = (fbId) => {
    return new Promise((resolve, reject) => {
        let url = `https://graph.facebook.com/v2.6/`
            + `${fbId}?fields=first_name,last_name,profile_pic,gender`
            + `&access_token=${appConfig.facebook.appToken}`;

        request(url, (err, res, body) => {
            if (err) {
                reject(err);
            } else {
                let parsedJSON = JSON.parse(body.replace('undefined', ''));
                resolve(parsedJSON);
            }
        });
    });
}