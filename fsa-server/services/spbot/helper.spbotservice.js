const providerService = require('../../services/provider.service'),
    appConfig = require('../../statics/app.config'),
    sessionBot = require('../../classes/sessionBot.class');

module.exports.checkSess = (session, userId) => {
    if (session.userData.sessInfo == null) {
        session.userData.sessInfo = new sessionBot(userId);
        providerService.getByFanpageId(session.message.sourceEvent.recipient.id).then(provider => {
            session.userData.sessInfo.provider = provider;
        });
        return;
    } else {
        if (session.userData.sessInfo.lang == null || session.userData.sessInfo.lang == "VN") {
            session.userData.sessInfo.lang = "VI";
        }
        return;
    }
}

module.exports.buildTemplatePlace = (session, arrButtons) => {
    const provider = session.userData.sessInfo.provider;
    const background = provider.background || 'no_place.png'
    const imageUrl = `${appConfig.staticServer.host}/bg/${background}`;

    let placeElements = [];
    let placeElem = {};

    placeElem["title"] = provider.name;
    placeElem["image_url"] = imageUrl;
    placeElem["subtitle"] = "🏠Address: " + provider.address + "\n 📱Phone: " + provider.tel;
    placeElem["buttons"] = arrButtons;
    placeElements.push(placeElem);

    return placeElements;
}

module.exports.formatPhoneNumber = (phoneNumber) => {
    if (phoneNumber.startsWith("0")) {
        phoneNumber = phoneNumber.replace("0", "+84");
    }
    return phoneNumber;
}