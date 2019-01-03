const webviewService = require('../services/webview.service');
const authService = require('../services/auth.service');
const localizationService = require('../services/localization.service');
const dateTimeHelper = require('../helpers/date-time.helper');

module.exports.index = (req, res, next) => {
    if (req.query.token) {
        let err = {
            message: "Access Denied. Token is invalid",
            status: 403
        };
        let tokenStr = authService.verifyAccessToken(req.query.token);
        if (!tokenStr) {
            return next(err);
        } else {
            next();
        }
    } else {
        let err = {
            message: 'fbId or token is required',
            status: 400
        };
        return next(err);
    }

}

module.exports.getPromotionById = (req, res, next) => {
    let labels = getPromotionLabels(req.query.lang);
    let token = req.query.token;
    if (token == undefined) {
        return next('Token is required');
    }

    let tokenObject = authService.verifyAccessTokenV2(token);
    if (!tokenObject.success) {
        return next('Token is invalid');
    }

    let customerId = tokenObject.data.customerId;
    let providerId = tokenObject.data.providerId;

    webviewService.getPromotionByIdV2(providerId, req.query.id).then(rs => {
        const provider = rs.providerInfo;
        const dateFrom = dateTimeHelper.formatDateTime(rs.promotion.dateFrom);
        const dateTo = dateTimeHelper.formatDateTime(rs.promotion.dateTo);

        res.render("webview/promotion-detail", {
            layout: 'layout-webview',
            provider: provider,
            promotion: rs.promotion,
            dateFrom: dateFrom,
            dateTo: dateTo,
            token: token,
            labels: labels
        });
    }).catch(err => next(err));
}

function getPromotionLabels(language) {
    if (!language) language = 'vi';
    let labels = {
        menu: localizationService.getField("menu", language),
        address: localizationService.getField("address", language),
        buyNow: localizationService.getField("buy-now", language),
        promotion: localizationService.getField("promotion", language)
    };

    return labels;
}