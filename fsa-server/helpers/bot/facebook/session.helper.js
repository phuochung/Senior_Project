const builder = require('botbuilder'),
    appConfig = require('../../../statics/app.config'),
    quickrepliesHelper = require('../../../helpers/bot/facebook/quickreplies.helper'),
    _ = require('lodash');

module.exports.sendWaitingForResponse = (session) => {
    session.sendTyping();
}

module.exports.getLanguageFromSession = (session) => {
    if (isLangAvailable(session)) {
        return session.userData.sessInfo.lang;
    }
    return "vi";
}

function isLangAvailable(session) {
    return session && session.userData && session.userData.sessInfo && session.userData.sessInfo.lang;
}

module.exports.sendElementsMessage = (session, elements) => {
    let card = {
        facebook: {
            quick_replies: quickrepliesHelper.buildMainQuickReplies(session),
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: elements,
                }
            }
        }
    };
    session.send(new builder.Message(session).sourceEvent(card));
    session.endConversation();
}

module.exports.sendTextMessage = (session, msg) => {
    let card = {
        facebook: {
            text: msg,
            quick_replies: quickrepliesHelper.buildMainQuickReplies(session),
        }
    };
    session.send(new builder.Message(session).sourceEvent(card));
    session.endConversation();
}

module.exports.sendCardMessage = (session, card) => {
    card.facebook.quick_replies = quickrepliesHelper.buildMainQuickReplies(session);
    session.send(new builder.Message(session).sourceEvent(card));
    session.endConversation();
}

module.exports.sendMessage = (session, msg) => {
    session.send(msg);
    session.endConversation();
}