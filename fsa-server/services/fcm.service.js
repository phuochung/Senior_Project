// This service is used to push notification to devices via FCM (Firebase Cloud Messaging)
const
    appConfig = require('../statics/app.config'),
    providerService = require('../services/provider.service'),
    request = require('request');

function BuildFCMNotificationItem(deviceTokens, itemType, item, message) {
    return {
        registration_ids: deviceTokens,
        collapse_key: "type_a",
        notification: {
            "title": "SP BOT",
            "body": message,
            "icon": "icon",
            "sound": "default",
            "click_action": "FCM_PLUGIN_ACTIVITY"
        },
        data: {
            "itemType": itemType,
            "item": item
        }
    }
}

module.exports.pushNotification = (providerId, itemType, item, message) => {
    providerService.getById(providerId).then(provider => {
        if (provider.deviceTokens && provider.deviceTokens.length > 0) {
            var formData = JSON.stringify(BuildFCMNotificationItem(provider.deviceTokens, itemType, item, message));
            request.post({
                url: appConfig.fcmServer.host, 
                headers: {
                    'Authorization': appConfig.fcmServer.authKey,
                    'Content-Type': 'application/json'
                },
                body: formData
            }, function (err, res, data) {
                console.log(err)
            });
        }
    });
}