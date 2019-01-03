const authService = require('../services/auth.service'),
    customerService = require('../services/customer.service'),
    providerService = require('../services/provider.service'),
    constants = require('../common/constants'),
    MessageConstants = constants.MessageConstants,
    enums = require('../common/enums'),
    RoleType = enums.RoleType;

module.exports.authorizeChallenge = (req, res, next) => {
    let err = {
        message: MessageConstants.AccessDenied,
        status: 403
    };
    let tokenStr = authService.verifyAccessToken(req.query.token);
    if (!tokenStr) {
        return next(err);
    } else {
        let token = JSON.parse(tokenStr);
        customerService.getById(token.id).then(customer => {
            if (!customer) return next(err);
            req.body.customer = customer;
            return next();
        }).catch(err => next(err));
    }
}

module.exports.authorizeBook = (req, res, next) => {
    let err = {
        message: MessageConstants.AccessDenied,
        status: 403
    };
    if (!req.query.token) {
        next(err);
    } else {
        authService.verifyProviderAndCustomerFromToken(req.query.token).then(result => {
            if (!result) {
                return next(err);
            }

            req.body.provider = result.provider;
            req.body.customer = result.customer;
            return next();
        }).catch(err => next(err));
    }
}

module.exports.authorizeShip = (req, res, next) => {
    let err = {
        message: MessageConstants.AccessDenied,
        status: 403
    };
    if (!req.query.token) {
        next(err);
    } else {
        authService.verifyShipToken(req.query.token).then(result => {
            if (!result) {
                return next(err);
            }

            req.body.provider = result.provider;
            req.body.customer = result.customer;
            req.body.ship = result.ship;
            return next();
        }).catch(err => next(err));
    }
}

module.exports.loginProvider = (req, res, next) => {
    authService.loginProvider(req.body.username, req.body.password).then(provider => {
        res.json(provider);
    }).catch(err => next(err));
}

module.exports.logout = (req, res, next) => {
    let tokenStr = req.headers.authorization;
    authService.logout(req.body.id, tokenStr).then(rs => {
        res.json(rs);
    }).catch(err => next(err));
}

module.exports.register = (req, res, next) => {
    providerService.register(req.headers.host, req.body).then(rs => {
        res.json(rs);
    }).catch(err => next(err));
}

module.exports.checkUsername = (req, res, next) => {
    providerService.checkUsername(req.query.username).then(rs => {
        res.json(rs);
    }).catch(err => next(err));
}

module.exports.verify = (req, res, next) => {
    providerService.verify(req.query.username, req.query.code).then(rs => {
        res.json(rs);
    }).catch(err => next(err));
}

module.exports.verifyToken = (req, res, next) => {
    // Service Provider App Authorization
    let tkStr = req.headers.authorization;
    let data = authService.verifyAccessTokenV2(tkStr);
    if (!data.success) {
        res.json(data);
    } else {
        var token = data.data;
        if (token.providerId) {
            providerService.getById(token.providerId).then(provider => {
                if (provider && provider.tokens) {
                    if (provider.tokens[provider.tokens.length - 1].token != tkStr) {
                        let err = {
                            success: false,
                            message: "This account is being accessed by others, please re-login."
                        }
                        res.json(err);
                    } else {
                        data = Object.assign({}, data, {
                            name: provider.name,
                            email: provider.email,
                            tel: provider.tel,
                            address: provider.address,
                            background: provider.background,
                        })

                        res.json(data);
                    }
                } else {
                    let err = {
                        success: false,
                        message: "Current user is invalid, please re-login.",
                    }
                    res.json(err);
                }
            }).catch(err => next(err));
        }
    }
}

module.exports.authorizeServiceProvider = (req, res, next) => {
    if (req.url.startsWith('/register')) return next();
    if (req.url.startsWith('/verify')) return next();
    if (req.url.startsWith('/localization')) return next();
    if (req.url.startsWith('/password/reset')) return next();

    // Service Provider App Authorization
    let tokenStr = req.headers.authorization;
    let decryptedToken = authService.verifyAccessTokenV2(tokenStr);
    if (!decryptedToken.data || (!decryptedToken.success && !req.url.startsWith('/logout'))) {
        let err = {
            // 
            status: 403,
            success: false,
            message: decryptedToken.message,
            type: 'json'
        };
        next(err);
    } else {
        let token = decryptedToken.data;
        req.body.id = token.providerId;
        next();
    }
}

module.exports.authorizeManager = (req, res, next) => {
    // Administrator App Authorization
    let tokenStr = req.headers.authorization;
    let decryptedToken = authService.verifyAccessTokenV2(tokenStr);
    if (!decryptedToken.success) {
        console.error("Token is invalid.");
        let err = {
            // 
            status: 403,
            success: false,
            message: decryptedToken.message,
            type: 'json'
        };
        next(err);
    } else {
        let token = decryptedToken.data;

        if (token.type == RoleType.Admin) {
            req.body.managerId = token.managerId;
            req.body.role = token.type;
            next();
        } else {
            console.error("Contributor cannot access these features");
            let err = {
                // 
                status: 403,
                success: false,
                message: decryptedToken.message,
                type: 'json'
            };
            next(err);
        }
    }
}

module.exports.authorizeContributor = (req, res, next) => {
    // Administrator App Authorization
    let tokenStr = req.headers.authorization;
    let decryptedToken = authService.verifyAccessTokenV2(tokenStr);
    if (!decryptedToken.success) {
        console.error("Token is invalid.");
        let err = {
            // 
            status: 403,
            success: false,
            message: decryptedToken.message,
            type: 'json'
        };
        next(err);
    } else {
        let token = decryptedToken.data;
        req.body.managerId = token.managerId;
        req.body.role = token.type;
        next();
    }
}

module.exports.authorizeWebsocketSP = (req, res, next) => {
    // Service Provider App Authorization
    let tokenStr = req.query.token;
    let decryptedToken = authService.verifyAccessTokenV2(tokenStr);
    if (!decryptedToken.success) {
        console.error("Token is invalid.");
        let err = {
            // 
            status: 403,
            success: false,
            message: decryptedToken.message,
            type: 'json'
        };
        next(err);
    } else {
        let token = decryptedToken.data;
        req.body.providerId = token.providerId;
        next();
    }
}

module.exports.authorizeBotAPI = (req, res, next) => {
    let tkStr = req.headers.authorization;
    let data = authService.verifyAccessTokenV2(tkStr);
    if (!data.success) {
        res.json(data);
    } else {
        var token = data.data;
        if (token.username) {
            // Keep the old mechanism of calls from BOT
            providerService.getByUsername(token.username).then(provider => {
                if (provider) {
                    if (provider.token != tkStr) {
                        let err = {
                            success: false,
                            message: "This account is being accessed by others, please re-login."
                        }
                        res.json(err);
                    } else {
                        req.body.username = token.username;
                        req.body.id = provider._id;
                        next();
                    }
                } else {
                    let err = {
                        success: false,
                        message: "Current user is invalid, please re-login.",
                    }
                    res.json(err);
                }
            }).catch(err => next(err));
        } else {
            // Adapt the new mechanism that uses id for higher performance
            if (token.providerId) {
                providerService.getById(token.providerId).then(provider => {
                    if (provider && provider.tokens) {
                        if (provider.tokens[provider.tokens.length - 1].token != tkStr) {
                            let err = {
                                success: false,
                                message: "This account is being accessed by others, please re-login."
                            }
                            res.json(err);
                        } else {
                            req.body.id = provider._id;
                            next();
                        }
                    } else {
                        let err = {
                            success: false,
                            message: "Current user is invalid, please re-login.",
                        }
                        res.json(err);
                    }
                }).catch(err => next(err));
            }
        }
    }
}

module.exports.authorizeMenu = (req, res, next) => {
    let err = {
        message: MessageConstants.AccessDenied,
        status: 403
    };
    if (!req.query.token) {
        next(err);
    } else {
        authService.verifyProviderAndCustomerFromToken(req.query.token).then(result => {
            if (!result) {
                return next(err);
            }

            req.body.provider = result.provider;
            req.body.customer = result.customer;
            return next();
        }).catch(err => next(err));
    }
}