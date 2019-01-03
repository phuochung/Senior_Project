const
    appConfig = require('../statics/app.config'),
    bookService = require('../services/book.service'),
    authService = require('../services/auth.service');

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
        if (provider === null) {
            let err = {
                message: "The provider is not found",
                status: 403
            };
            return next(err);
        }
        let actionToken = req.query.token;

        res.render("book/index", {
            layout: './book/layout',
            providerName: provider.name,
            actionToken: actionToken,
            actionHost: appConfig.apiServer.host
        });
    } else {
        let err = {
            message: 'Token is required',
            status: 400
        };
        return next(err);
    }
}

module.exports.submitBook = (req, res, next) => {
    let tokenStr = authService.verifyAccessToken(req.query.token);
    if (!tokenStr) {
        return next(err);
    }

    let provider = req.body.provider;
    if (provider === null) {
        let err = {
            message: "The provider is not found",
            status: 403
        };
        return next(err);
    }

    let token = JSON.parse(tokenStr);
    let bookInfo = {
        dateTime: req.body.date + ' ' + req.body.time,
        size: req.body.size,
        conditions: req.body.note,
    }

    let customer = req.body.customer;

    bookService.submitBook(provider, customer, bookInfo, token.botName).then(isSuccess => {
        res.json(isSuccess);
    }).catch(err => res.json(err));
}