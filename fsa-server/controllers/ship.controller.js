const
    appConfig = require('../statics/app.config'),
    currencyConfig = require('../configs/currency.config'),
    authService = require('../services/auth.service'),
    shipService = require('../services/ship.service'),
    providerService = require('../services/provider.service');

module.exports.index = (req, res, next) => {
    if (req.query.token) {
        let err = {
            message: "Access Denied. Token is invalid",
            status: 403
        };
        let tokenStr = authService.verifyAccessToken(req.query.token);
        if (!tokenStr) {
            return next(err);
        }

        let provider = req.body.provider;
        let customer = req.body.customer;
        let ship = req.body.ship;

        if (provider === null) {
            let err = {
                message: "The provider is not found. Please try again.",
                status: 403
            };
            return next(err);
        }

        if (customer === null) {
            let err = {
                message: "The customer is not found. Please try again.",
                status: 403
            };
            return next(err);
        }

        let token = JSON.parse(tokenStr);
        let accessToken = authService.generateShipAccessToken(provider.id, customer.id, ship.id, token.botName);

        if (token.shipId === undefined) {
            // Access token must add shipId to avoid losing data when user refresh page
            res.redirect('/ship?token=' + accessToken);
        } else {
            let imageFolder = appConfig.staticServer.host + "/menu/";
            providerService.getProviderWithMenuById(provider.id)
                .then(rs => {
                    res.render("ship/index", {
                        layout: './ship/layout',
                        provider: provider,
                        menu: rs.menus,
                        imageFolder: imageFolder,
                        listDish: ship.listDish,
                        exchangeRate: currencyConfig.exchangeRate,
                        accessToken: accessToken
                    });
                })
        }
    } else {
        let err = {
            message: 'Token is required',
            status: 400
        };
        return next(err);
    }
}

module.exports.shippingInformation = (req, res, next) => {
    if (req.query.token) {
        let err = {
            message: "Access Denied. Token is invalid",
            status: 403
        };
        let tokenStr = authService.verifyAccessToken(req.query.token);
        if (!tokenStr) {
            return next(err);
        }

        let provider = req.body.provider;
        let customer = req.body.customer;
        let ship = req.body.ship;

        if (provider === null) {
            let err = {
                message: "The provider is not found. Please try again.",
                status: 403
            };
            return next(err);
        }

        if (customer === null) {
            let err = {
                message: "The customer is not found. Please try again.",
                status: 403
            };
            return next(err);
        }

        let token = JSON.parse(tokenStr);
        let accessToken = authService.generateShipAccessToken(provider.id, customer.id, ship.id, token.botName);

        if (token.shipId === undefined) {
            res.redirect('/ship?token=' + accessToken);
        } else {
            res.render("ship/shippingInformation", {
                layout: './ship/layout',
                provider: provider,
                customerName: customer.name,
                exchangeRate: currencyConfig.exchangeRate,
                ship: ship,
                accessToken: accessToken
            })
        }
    } else {
        let err = {
            message: 'Token is required',
            status: 400
        };
        return next(err);
    }
}

module.exports.receipt = (req, res, next) => {
    if (req.query.token) {
        let err = {
            message: "Access Denied. Token is invalid",
            status: 403
        };
        let tokenStr = authService.verifyAccessToken(req.query.token);
        if (!tokenStr) {
            return next(err);
        }

        let provider = req.body.provider;
        let customer = req.body.customer;
        let ship = req.body.ship;

        if (provider === null) {
            let err = {
                message: "The provider is not found. Please try again.",
                status: 403
            };
            return next(err);
        }

        if (customer === null) {
            let err = {
                message: "The customer is not found. Please try again.",
                status: 403
            };
            return next(err);
        }

        let token = JSON.parse(tokenStr);
        let accessToken = authService.generateShipAccessToken(provider.id, customer.id, ship.id, token.botName);
        if (token.shipId === undefined) {
            // Access token must add shipId to avoid losing data when user refresh page
            res.redirect('/ship?token=' + accessToken);
        } else {
            res.render("ship/receipt", {
                layout: './ship/layout',
                ship: ship,
                provider: provider,
                accessToken: accessToken
            });
        }
    } else {
        let err = {
            message: 'Token is required',
            status: 400
        };
        return next(err);
    }
}

module.exports.complete = (req, res, next) => {
    if (req.query.token) {
        let err = {
            message: "Access Denied. Token is invalid",
            status: 403
        };
        authService.verifyShipToken(req.query.token).then(tokenStr => {
            if (!tokenStr) {
                return next(err);
            }
            let provider = req.body.provider;
            let customer = req.body.customer;
            let ship = req.body.ship;

            if (provider === null) {
                let err = {
                    message: "The provider is not found. Please try again.",
                    status: 403
                };
                return next(err);
            }

            if (customer === null) {
                let err = {
                    message: "The customer is not found. Please try again.",
                    status: 403
                };
                return next(err);
            }
            if (tokenStr.ship._id === undefined) {
                // Access token must add shipId to avoid losing data when user refresh page
                res.redirect('/ship?token=' + accessToken);
            } else {
                var completeShipPromise = shipService.completeShip(ship, provider);
                res.render("ship/complete", {
                    layout: './ship/layout',
                    ship: ship
                });
            }
        });
    } else {
        let err = {
            message: 'Token is required',
            status: 400
        };
        return next(err);
    }
}

module.exports.updateShipItems = (req, res, next) => {
    var shipItems = req.body.shipItems;
    if (shipItems === undefined) {
        shipItems = [];
    }

    let ship = req.body.ship;
    let provider = req.body.provider;

    shipService.updateShipItems(ship, provider, shipItems).then(ship => {
        res.json(ship);
    }).catch(err => res.json(err));
}

module.exports.updateShipInfo = (req, res, next) => {
    let shipInfo = req.body.shipInfo;
    let ship = req.body.ship;

    shipService.updateShipInfo(ship, shipInfo).then(ship => {
        res.json(ship);
    }).catch(err => res.json(err));
}

function notifyShipToProvider(ws, ship) {
    ws.send(JSON.stringify(ship))
}