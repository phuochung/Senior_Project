
module.exports.NotificationType = {
    Others: 0,
    Ship: 1,
    Book: 2
}

module.exports.MessageStatus = {
    Waiting: 0,
    Sending: 1,
    Sent: 2,
    Expired: 3
}

module.exports.ShipStatus = {
    Pending: 0,
    Submitted: 1,
    Accepted: 2,
    Refused: 3,
    Cancelled: 4
}

module.exports.BookStatus = {
    Pending: 0,
    Submitted: 1,
    Accepted: 2,
    Refused: 3,
    Cancelled: 4
}

module.exports.RoleType = {
    Admin: 0,
    Contributor: 1
}

module.exports.PromotionStatus = {
    Draft: 0,
    Pending: 1,
    Approved: 2
}