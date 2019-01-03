const builder = require('botbuilder'),
    appConfig = require('../../statics/app.config'),
    constants = require("../../common/constants"),
    FloatingButtons = constants.FloatingButtons,
    validUrl = require('valid-url'),
    authService = require('../../services/auth.service'),
    helperSPBotService = require('./helper.spbotservice'),
    promotionService = require('../../services/promotion.service'),
    sessionHelper = require('../../helpers/bot/facebook/session.helper'),
    quickrepliesHelper = require('../../helpers/bot/facebook/quickreplies.helper'),
    fcmService = require('../../services/fcm.service'),
    FCMNotificationItemTypes = constants.FCMNotificationItemTypes,
    customerService = require('../customer.service');
_trans = require('../../services/localization.service');

module.exports.sendPromotion = (session) => {
    let provider = session.userData.sessInfo.provider;
    let promoElements = [];
    promotionService.getAllPromotionValidByProvider(provider._id).then(promotions => {
        for (let i = 0; Math.min(i < promotions.length, constants.N_DISPLAY); i++) {
            promoElem = {};
            if (promotions[i].imageName && validUrl.isUri(appConfig.staticServer.host + "/promotion/" + promotions[i].imageName)) {
                promotions[i].imageName = appConfig.staticServer.host + "/promotion/" + promotions[i].imageName;
            } else {
                promotions[i].imageName = "https://www.marketing91.com/wp-content/uploads/2017/03/Sales-Promotion-Types-of-Sales-promotions-1.jpg";
            }
            promoElem["title"] = `🔥${promotions[i].title}`;
            promoElem["image_url"] = promotions[i].imageName;
            promoElem["subtitle"] = promotions[i].description;
            promoElem["default_action"] = {
                type: 'web_url',
                url: appConfig.apiServer.host + "/view/promotion-detail?id=" + promotions[i]._id.toString() + "&providerId=" + provider._id + "&token=" + authService.generateShipAccessToken(provider._id.toString(), session.userData.sessInfo.userProfil._id, undefined),
                webview_height_ratio: 'tall',
                messenger_extensions: appConfig.isProd
            };
            promoElements.push(promoElem);
        }
        if (promoElements && promoElements.length > 0) {
            sessionHelper.sendElementsMessage(session, promoElements);
        } else {
            let message = "Xin lỗi, chúng hiện không có chương trình khuyến mãi nào cả.";
            sessionHelper.sendTextMessage(session, message);
        }
    })
}

module.exports.sendAboutUs = (username, session) => {
    helperSPBotService.checkSess(session);
    let provider = session.userData.sessInfo.provider;
    let lang = sessionHelper.getLanguageFromSession(session);
    if (provider) {
        let aboutUs = provider.aboutUs;
        if (!aboutUs) aboutUs = _trans.getField('the-information-is-being-updated', lang)
        sessionHelper.sendTextMessage(session, aboutUs);
    }
}

module.exports.chatWithAdmin = (username, session) => {
    helperSPBotService.checkSess(session);
    session.userData.sessInfo.chatting = true;
    let lang = sessionHelper.getLanguageFromSession(session);
    let floatingButtons = [FloatingButtons.StopChatting];
    let waitAMinuteText = _trans.getField('wait-a-minute-our-admin-coming-type-STOP-to-cancel-chatting', lang);

    const customer = {
        fbId: session.message.user.id,
        isChatWithAdmin: true
    }
    customerService.addOrUpdate(customer);
    // let notifyText = _trans.getField('notivation-chat-with-admin-to-provider', lang) + session.userData.sessInfo.userProfil.name;
    // let item = { fanpageId: session.userData.sessInfo.provider.fanpageId };
    // fcmService.pushNotification(session.userData.sessInfo.provider, FCMNotificationItemTypes.ChatWithAdmin, item, notifyText);
    if (session.message.text == "ZZZZZZ_CHAT_WITH_ADMIN_AAAAAA_") {
        let card = {
            facebook: {
                text: waitAMinuteText,
                quick_replies: quickrepliesHelper.buildQuickRepliesSPBot(session, floatingButtons),
            }
        };
        sessionHelper.sendMessage(session, new builder.Message(session).sourceEvent(card));
    }
}

module.exports.stopChatting = (username, session) => {
    helperSPBotService.checkSess(session);
    session.userData.sessInfo.chatting = false;

    const customer = {
        fbId: session.message.user.id,
        isChatWithAdmin: false
    }
    customerService.addOrUpdate(customer);

    let lang = sessionHelper.getLanguageFromSession(session);
    let thanksText = _trans.getField('thank-you-and-do-you-need-more-infor', lang);
    sessionHelper.sendTextMessage(session, thanksText);
}

module.exports.sendCardReservation = (username, session) => {
    helperSPBotService.checkSess(session);
    let lang = sessionHelper.getLanguageFromSession(session);
    let buttons = [{
        "title": _trans.getField("SPBOT_BUTTON_BOOK", lang),
        type: 'web_url',
        url: appConfig.apiServer.host + "/book?token=" + authService.generateProviderActionAPIToken(session.userData.sessInfo.userProfil._id, session.userData.sessInfo.providerId, username),
        webview_height_ratio: 'tall',
        messenger_extensions: appConfig.isProd
    },
    {
        "type": "phone_number",
        "title": _trans.getField("SPBOT_BUTTON_CALL", lang),
        "payload": helperSPBotService.formatPhoneNumber(session.userData.sessInfo.provider.tel ? session.userData.sessInfo.provider.tel.toString() : '0934980804'),
    },
    ];
    let elements = helperSPBotService.buildTemplatePlace(session, buttons);
    sessionHelper.sendElementsMessage(session, elements);
}

module.exports.sendCardShip = (username, session) => {
    helperSPBotService.checkSess(session);
    let lang = sessionHelper.getLanguageFromSession(session);
    let buttons = [{
        "title": _trans.getField("SPBOT_BUTTON_SHIP", lang),
        type: 'web_url',
        url: appConfig.apiServer.host + "/ship?token=" + authService.generateProviderActionAPIToken(session.userData.sessInfo.userProfil._id, session.userData.sessInfo.providerId, username),
        webview_height_ratio: 'tall',
        messenger_extensions: appConfig.isProd
    },
    {
        "type": "phone_number",
        "title": _trans.getField("SPBOT_BUTTON_CALL", lang),
        "payload": helperSPBotService.formatPhoneNumber(session.userData.sessInfo.provider.tel ? session.userData.sessInfo.provider.tel.toString() : '0934980804'),
    }];
    let elements = helperSPBotService.buildTemplatePlace(session, buttons);
    sessionHelper.sendElementsMessage(session, elements);
}

module.exports.sendCardGetDirection = (username, session) => {
    helperSPBotService.checkSess(session);

    const provider = session.userData.sessInfo.provider;
    const lang = sessionHelper.getLanguageFromSession(session);
    const buttons = [{
        "title": _trans.getField("SPBOT_BUTTON_GET_DIRECTION", lang),
        "type": "web_url",
        "url": 'https://maps.google.com/maps?daddr=' + provider.gps.lat.toString() + ',' + provider.gps.lng.toString(),
        webview_height_ratio: 'tall',
        messenger_extensions: appConfig.isProd
    },
    {
        "type": "phone_number",
        "title": _trans.getField("SPBOT_BUTTON_CALL", lang),
        "payload": helperSPBotService.formatPhoneNumber(session.userData.sessInfo.provider.tel ? session.userData.sessInfo.provider.tel.toString() : '0934980804'),
    }];

    const elements = helperSPBotService.buildTemplatePlace(session, buttons);
    sessionHelper.sendElementsMessage(session, elements);
}

module.exports.contactUs = (username, session) => {
    var lang = sessionHelper.getLanguageFromSession(session);
    helperSPBotService.checkSess(session);
    let buttons = [
        {
            "type": "phone_number",
            "title": _trans.getField("SPBOT_BUTTON_CALL", lang),
            "payload": helperSPBotService.formatPhoneNumber(session.userData.sessInfo.provider.tel ? session.userData.sessInfo.provider.tel.toString() : '0934980804'),
        }];
    let elements = helperSPBotService.buildTemplatePlace(session, buttons);
    sessionHelper.sendElementsMessage(session, elements);
}

module.exports.sendMenu = (username, session) => {
    helperSPBotService.checkSess(session);
    let lang = sessionHelper.getLanguageFromSession(session);
    let buttons = [{
        "title": _trans.getField("SPBOT_BUTTON_MENU", lang),
        type: 'web_url',
        url: appConfig.apiServer.host + "/menu?token=" + authService.generateProviderActionAPIToken(session.userData.sessInfo.userProfil._id, session.userData.sessInfo.providerId, username),
        webview_height_ratio: 'tall',
        messenger_extensions: appConfig.isProd
    },
    {
        "type": "phone_number",
        "title": _trans.getField("SPBOT_BUTTON_CALL", lang),
        "payload": helperSPBotService.formatPhoneNumber(session.userData.sessInfo.provider.tel ? session.userData.sessInfo.provider.tel.toString() : '0934980804'),
    }];
    let elements = helperSPBotService.buildTemplatePlace(session, buttons);
    sessionHelper.sendElementsMessage(session, elements);
}