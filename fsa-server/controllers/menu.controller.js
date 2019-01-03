const
    menuService = require('../services/menu.service'),
    customerService = require('../services/customer.service'),
    authService = require('../services/auth.service');

module.exports.index = (req, res, next) => {
    if (req.query.token) {
        let err = {
            message: "Access Denied. Token is invalid",
            status: 403
        };

        let provider = req.body.provider;

        if (provider == null) {
            return next(err);
        }

        let tokenStr = authService.verifyAccessToken(req.query.token);
        if (!tokenStr) {
            return next(err);
        }

        let token = JSON.parse(tokenStr);
        let customerId = token.customerId;

        let page = req.query.page;
        let url = req.originalUrl;
        if (page == undefined) {
            page = 1;
            url += "&page=1";
        }
        let nextUrl = url.replace('page=' + page, 'page=' + (parseInt(page) + 1));

        // The action token could be different from the input token in query.
        // Thus, the action token must be generate to be less dependent on the input token.
        let actionToken = authService.generateProviderActionAPIToken(customerId, provider._id, token.botName);

        customerService.getById(customerId).then(customer =>
            menuService.getByProviderId(provider._id).then(menuItems => {
                res.render("menu/index", {
                    layout: './menu/layout',
                    provider: provider,
                    customer: customer,
                    menu: menuItems,
                    nextUrl: nextUrl,
                    actionToken: actionToken
                });
            }).catch(err => next(err)));
    } else {
        let err = {
            message: 'Token is required',
            status: 400
        };
        return next(err);
    }
}