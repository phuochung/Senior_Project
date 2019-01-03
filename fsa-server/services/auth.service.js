const encryptionHelper = require('../helpers/encryption.helper'),
    dateTimeHelper = require('../helpers/date-time.helper'),
    passwordHelper = require('../helpers/password.helper'),
    appConfig = require('../statics/app.config'),
    Provider = require('mongoose').model('Provider'),
    providerService = require('../services/provider.service'),
    customerService = require('../services/customer.service'),
    currencyService = require('../services/currency.service'),
    shipService = require('../services/ship.service'),
    constants = require('../common/constants'),
    MessageConstants = constants.MessageConstants,
    CurrencyCode = constants.CurrencyCode,
    Lang = constants.Lang;

module.exports.generateProviderAccessToken = (providerId, accessType) => {
    let token = JSON.stringify({
        providerId: providerId,
        access: accessType,
        expiredTime: dateTimeHelper.addMinuteFromNow(appConfig.providerToken.expiresIn)
    });

    return encryptionHelper.encrypt(token);
}

module.exports.generateBookAccessToken = (bookId, customerId, providerId, botName) => {
    let token = JSON.stringify({
        bookId: bookId,
        customerId: customerId,
        providerId: providerId,
        botName: botName,
        expiredTime: dateTimeHelper.addMinuteFromNow(appConfig.accessToken.expiresIn)
    });
    return encryptionHelper.encrypt(token);
}

module.exports.generateShipAccessToken = (providerId, customerId, shipId, botName) => {
    let token = JSON.stringify({
        customerId: customerId,
        providerId: providerId,
        botName: botName,
        shipId: shipId,
        expiredTime: dateTimeHelper.addMinuteFromNow(appConfig.accessToken.expiresIn)
    });
    return encryptionHelper.encrypt(token);
}

module.exports.verifyAccessToken = (accessToken) => {
    if (!accessToken) return null;
    let token = encryptionHelper.decrypt(accessToken);
    if (!token) return null;
    var obj = JSON.parse(token);
    if (new Date(obj.expiredTime).getTime() < new Date().getTime()) return null;
    return token;
}

module.exports.verifyAccessTokenV2 = (accessToken) => {
    if (!accessToken)
        return {
            success: false,
            message: MessageConstants.TokenInvalid
        };
    let token = encryptionHelper.decrypt(accessToken);
    if (!token)
        return {
            success: false,
            message: MessageConstants.TokenInvalid
        };
    var obj = JSON.parse(token);
    if (new Date(obj.expiredTime).getTime() < new Date().getTime())
        return {
            success: false,
            message: MessageConstants.TokenExpired
        };
    return {
        success: true,
        data: obj
    };
}

module.exports.loginProvider = (username, password) => {
    return new Promise((resolve, reject) => {
        let query = {
            username: username.toLowerCase(),
            password: passwordHelper.hash(username.toLowerCase(), password)
        };
        Provider.findOne(query)
            .populate('currency')
            .exec((err, provider) => {
                if (provider && provider.isActive) {
                    let access = 'auth';
                    let token = this.generateProviderAccessToken(provider._id, access);
                    var lang = provider.lang == undefined ? Lang.VI : provider.lang;
                    var currencies = currencyService.getAll();
                    var p = {
                        username: provider.username,
                        name: provider.name,
                        email: provider.email,
                        tel: provider.tel,
                        address: provider.address,
                        background: provider.background,
                        accessToken: token,
                        lang: lang,
                        currency: provider.currency ? provider.currency.code : CurrencyCode.VND,
                        currencyId: provider.currency ? provider.currency._id : currencies.find(x => x.code == CurrencyCode.VND)._id
                    };
                    let tokens = provider.tokens;
                    tokens.push({
                        access,
                        token
                    })
                    provider.tokens = tokens;
                    provider.save().then(() => resolve(p));

                } else {
                    resolve(false);
                }
            }).catch(err => reject(err));
    });
}

module.exports.logout = (providerId, tokenStr) => {
    return new Promise((resolve, reject) => {
        Provider.findById(providerId)
            .then(provider => {
                if (provider && provider.tokens && provider.tokens.length > 0) {
                    provider.tokens = provider.tokens.filter(function (item) {
                        return item.token != tokenStr;
                    })
                    provider.save().then(() => resolve({
                        success: true
                    }));
                } else {
                    resolve({
                        success: false
                    });
                }
            })
    })
}

module.exports.verifyProviderAndCustomerFromToken = (encryptedTokenStr) => {
    return new Promise((resolve, reject) => {
        try {
            if (!encryptedTokenStr) {
                return reject({
                    message: "The token is invalid.",
                    status: 400
                });
            }

            let tokenStr = encryptionHelper.decrypt(encryptedTokenStr);
            if (!tokenStr || tokenStr == null) {
                return reject({
                    message: "The token is invalid.",
                    status: 400
                });
            }

            let tokenObject = JSON.parse(tokenStr);
            if (!tokenObject) {
                return reject({
                    message: "The token is invalid.",
                    status: 400
                });
            }

            var providerPromise = providerService.getById(tokenObject.providerId);
            var customerPromise = customerService.getById(tokenObject.customerId);
            Promise.all([providerPromise, customerPromise])
                .then(([provider, customer]) => {
                    if (provider && customer) {
                        resolve({
                            provider,
                            customer
                        });
                    } else {
                        reject({
                            message: "Provider or customer is not found.",
                            status: 400
                        });
                    }
                })
        } catch (e) {
            let err = {
                message: "Internal server error. Error: " + e,
                status: 500
            }
            return reject(err);
        }
    });
}

module.exports.verifyShipToken = (encryptedTokenStr) => {
    return new Promise((resolve, reject) => {
        try {
            if (!encryptedTokenStr) {
                return reject({
                    message: "The token is invalid.",
                    status: 400
                });
            }

            let tokenStr = encryptionHelper.decrypt(encryptedTokenStr);
            if (!tokenStr || tokenStr == null) {
                return reject({
                    message: "The token is invalid.",
                    status: 400
                });
            }

            let tokenObject = JSON.parse(tokenStr);
            if (!tokenObject) {
                return reject({
                    message: "The token is invalid.",
                    status: 400
                });
            } else if (new Date(tokenObject.expiredTime).getTime() < new Date().getTime()) {
                return reject({
                    message: "The token is expired.",
                    status: 400
                });
            } else {
                var getProviderPromise = providerService.getProviderWithMenuById(tokenObject.providerId);
                var getCustomerPromise = customerService.getById(tokenObject.customerId);
                Promise.all([getProviderPromise, getCustomerPromise])
                    .then(([rs, customer]) => {
                        if (!rs.provider) {
                            return reject({
                                message: "The provider is not found.",
                                status: 400
                            });
                        }
                        if (!customer) {
                            let err = {
                                message: "The customer is not found.",
                                status: 400
                            }
                            return reject(err);
                        }
                        if (tokenObject.shipId !== undefined) {
                            shipService.getById(tokenObject.shipId)
                                .then(ship => {
                                    // ship.botName = tokenObject.botName;
                                    return resolve({
                                        provider: rs.provider,
                                        menus: rs.menus,
                                        customer: customer,
                                        ship: ship
                                    });
                                }).catch(err => console.log(err));
                        } else {
                            shipService.create(rs.provider, customer).then(ship => {
                                // ship.botName = tokenObject.botName;
                                return resolve({
                                    provider: rs.provider,
                                    customer: customer,
                                    menus: rs.menus,
                                    ship: ship
                                });
                            });
                        }
                    });
            }
        } catch (e) {
            let err = {
                message: "Internal server error. Error: " + e,
                status: 500
            }
            return reject(err);
        }
    });
}

module.exports.generateProviderActionAPIToken = (customerId, providerId, botName) => {
    let token = JSON.stringify({
        customerId: customerId,
        providerId: providerId,
        botName: botName,
        expiredTime: dateTimeHelper.addMinuteFromNow(appConfig.accessToken.expiresIn)
    });
    return encryptionHelper.encrypt(token);
}