const builder = require('botbuilder'),
    buttonSPBotService = require("../services/spbot/button.spbotservice"),
    responseBotService = require("../services/spbot/response.botservice"),
    spBotService = require('../services/spbot.service');

module.exports.bindDialogsToBot = (bot, username) => {
    bot.use(builder.Middleware.dialogVersion({
        version: 10,
        resetCommand: /^reset/i
    }));

    bot.use({
        botbuilder: spBotService.validateState
    });

    //=========================================================
    // Bots Global Actions
    //=========================================================

    bot.beginDialogAction('introduction', '/restart', {
        matches: /^ZZZZZZ_INTRODUCTION_AAAAAA_.*|Get Started|get started|GET_STARTED_PAYLOAD/i
    });
    bot.beginDialogAction('restart', '/restart', {
        matches: /^good morning$|^hi ad$|^chào bạn$|^chào ad$|^chao ad$|^ad oi$|^ad ơi$|^ad$|^ad$|^restart$|^retry$|^'restart'$|^chao ban$|^bat dau$|^start$|^hi$|^hi $|^hello $|^hello$|^bắt đầu$|^xin chào$|^xin chao$/i
    });
    bot.dialog('/', [function (session) {
        spBotService.main(username, session);
    }]);
    bot.beginDialogAction('aboutUs', '/aboutUs', {
        matches: /^ZZZZZZ_ABOUT_US_AAAAAA_.*/i
    });
    bot.beginDialogAction('contactUs', '/contactUs', {
        matches: /^ZZZZZZ_CONTACT_US_AAAAAA_.*/i
    });
    bot.beginDialogAction('sendPromotion', '/sendPromotion', {
        matches: /^ZZZZZZ_COMMAND_PROMOTION_AAAAAA_.*/i
    });
    bot.beginDialogAction('sendMenu', '/sendMenu', {
        matches: /^ZZZZZZ_COMMAND_MENU_AAAAAA_.*/i
    });
    bot.beginDialogAction('sendReservation', '/sendReservation', {
        matches: /^ZZZZZZ_RESERVATION_AAAAAA_.*/i
    });
    bot.beginDialogAction('sendShip', '/sendShip', {
        matches: /^ZZZZZZ_COMMAND_SHIP_AAAAAA_.*/i
    });
    bot.beginDialogAction('sendCarGetDirection', '/sendCardGetDirection', {
        matches: /^ZZZZZZ_COMMAND_GET_DIRECTION_AAAAAA_.*/i
    });
    bot.beginDialogAction('chatWithAdmin', '/chatWithAdmin', {
        matches: /^ZZZZZZ_CHAT_WITH_ADMIN_AAAAAA_.*/i
    });
    bot.beginDialogAction('stopChatting', '/stopChatting', {
        matches: /^ZZZZZZ_STOP_CHATTING_AAAAAA_.*|#STOP/i
    });
    bot.dialog('/chatWithAdmin', [function (session) {
        session.sendTyping();
        buttonSPBotService.chatWithAdmin(username, session);
    }]);
    bot.dialog('/stopChatting', [function (session) {
        session.sendTyping();
        buttonSPBotService.stopChatting(username, session);
    }]);
    bot.dialog('/restart', [function (session) {
        session.sendTyping();
        spBotService.restart(username, session);
    }]);
    bot.dialog('/aboutUs', [function (session) {
        session.sendTyping();
        buttonSPBotService.sendAboutUs(username, session);
    }]);
    bot.dialog('/contactUs', [function (session) {
        session.sendTyping();
        buttonSPBotService.contactUs(username, session);
    }]);
    bot.dialog('/sendPromotion', [function (session, args) {
        session.sendTyping();
        buttonSPBotService.sendPromotion(session);
    }]);
    bot.dialog('/sendMenu', [function (session, args) {
        session.sendTyping();
        buttonSPBotService.sendMenu(username, session);
    }]);
    bot.dialog('/sendReservation', [function (session, args) {
        session.sendTyping();
        buttonSPBotService.sendCardReservation(username, session);
    }]);
    bot.dialog('/sendShip', [function (session, args) {
        session.sendTyping();
        buttonSPBotService.sendCardShip(username, session);
    }]);
    bot.dialog('/sendCardGetDirection', [function (session, args) {
        session.sendTyping();
        buttonSPBotService.sendCardGetDirection(username, session);
    }]);
    bot.dialog('/finishBook', [function (session, args) {
        session.sendTyping();
        responseBotService.finishBook(session, args.bookId, args.bookInfo);
    }]);
    bot.beginDialogAction('cancelBook', '/cancelBook', {
        matches: /^ZZZZZZ_COMMAND_CANCEL_BOOK_AAAAAA_.*/i
    });
    bot.dialog('/cancelBook', [function (session) {
        spBotService.cancelBook(session);
    }]);
    bot.dialog('/responseBook', [function (session, args) {
        responseBotService.responseBook(session, args.updateObj);
    }]);

    bot.dialog('/finishShip', [function (session, args) {
        responseBotService.finishShip(session, args.shipId, args.content);
    }]);
    bot.beginDialogAction('cancelShip', '/cancelShip', {
        matches: /^ZZZZZZ_COMMAND_CANCEL_SHIP_AAAAAA_.*/i
    });
    bot.dialog('/cancelShip', [function (session) {
        spBotService.cancelShip(session);
    }]);
    bot.dialog('/responseShip', [function (session, args) {
        responseBotService.responseShip(session, args.updateObj);
    }]);

}