const customerService = require('../../services/customer.service'),
    helperBotService = require('../../services/spbot/helper.spbotservice'),
    sessionHelper = require('../../helpers/bot/facebook/session.helper'),
    enums = require("../../common/enums"),
    constants = require('../../common/constants'),
    BookStatus = enums.BookStatus,
    ShipStatus = enums.ShipStatus;

module.exports.responseBook = (session, bookItem) => {
    helperBotService.checkSess(session, session.message.user.id);
    switch (bookItem.status) {
        case BookStatus.Accepted:
            let msgAccept = "Chúng tôi đã nhận được yêu cầu đặt bàn từ bạn, yêu cầu của bạn đã được chấp nhận.";
            sessionHelper.sendTextMessage(session, msgAccept);
            break;
        case BookStatus.Refused:
            let msgRefused = "Xin lỗi, chúng tôi không thể chấp nhận yêu cầu đặt bàn của bạn vào lúc này";
            session.send(msgRefused);
            let messageReason = `Lí do: ${bookItem.reasonRefuse}`
            sessionHelper.sendTextMessage(session, messageReason);
            break;
        case BookStatus.Cancelled:
            let msgCancel = "oke, Yếu cầu hủy"            
    }
}

module.exports.responseShip = (session, shipItem) => {
    helperBotService.checkSess(session, session.message.user.id);
    switch (shipItem.status) {
        case ShipStatus.Accepted:
            let msgAccept = "Chúng tôi đã nhận được đơn đặt hàng của bạn, đơn hàng đang được xử lý.";
            sessionHelper.sendTextMessage(session, msgAccept);
            break;
        case ShipStatus.Refused:
            let msgRefused = "Xin lỗi, chúng tôi không thể chấp nhận đơn đặt hàng của bạn vào lúc này";
            session.send(msgRefused);
            let messageReason = `Lí do: ${shipItem.reasonRefuse}`
            sessionHelper.sendTextMessage(session, messageReason);
            break;
    }
}

module.exports.finishShip = (session, shipId, content) => {
    helperBotService.checkSess(session, session.message.user.id);
    let card = {
        facebook: {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": content,
                    "buttons": [{
                        "title": "Hủy",
                        "type": "postback",
                        "payload": constants.COMMAND_CANCEL_SHIP + shipId
                    }
                    ]
                }
            }
        }
    };
    sessionHelper.sendCardMessage(session, card);
}

module.exports.finishBook = (session, bookId, bookInfor) => {
    helperBotService.checkSess(session, session.message.user.id);
    let message = `Bạn đã đặt bàn cho ${bookInfor.size} người vào lúc ${bookInfor.time} tại ${bookInfor.providerName}, Xin cảm ơn!`;
    let card = {
        facebook: {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": message,
                    "buttons": [{
                        "title": "Hủy",
                        "type": "postback",
                        "payload": constants.COMMAND_CANCEL_BOOK + bookId
                    }
                    ]
                }
            }
        }
    };
    sessionHelper.sendCardMessage(session, card);
}