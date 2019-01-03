const
    mongoose = require('mongoose'),
    Notification = mongoose.model('Notification'),
    enums = require('../common/enums'),
    NotificationType = enums.NotificationType,
    wsController = require('../controllers/websocket.controller');


module.exports.addNotification = (providerId, id, type) => {
    return new Promise((resolve, reject) => {
        let query = {
            provider: providerId,
            type: type
        }

        if (type == NotificationType.Ship) query['ship'] = id;
        if (type == NotificationType.Book) query['book'] = id;

        Notification.findOne(query)
            .then((n) => {
                if (!n) {
                    var notification = new Notification(query);

                    notification.save().then(() => {
                        Notification.findById(notification._id)
                            .populate('ship')
                            .populate('book')
                            .populate({
                                path: 'ship',
                                populate: {
                                    path: 'customer',
                                    model: 'Customer'
                                }
                            })
                            .populate({
                                path: 'book',
                                populate: {
                                    path: 'customer',
                                    model: 'Customer'
                                }
                            })
                            .exec((err, noti) => {
                                var sockets = wsController.sockets;
                                var pid = providerId.toString();
                                if (type == NotificationType.Book) {
                                    if (sockets && sockets['book'] && sockets['book'][pid]) {
                                        var ws = sockets['book'][pid];
                                        ws.send(JSON.stringify(noti));
                                    }
                                }
                                if (type == NotificationType.Ship) {
                                    if (sockets && sockets['ship'] && sockets['ship'][pid]) {
                                        var ws = sockets['ship'][pid];
                                        ws.send(JSON.stringify(noti));
                                    }
                                }
                                resolve({ success: true });
                            });
                    });
                } else {
                    resolve({ success: false });
                }
            })

    })
}

module.exports.getNotifications = (providerId, criteria) => {
    return new Promise((resolve, reject) => {
        let query = {
            provider: providerId,
            isDeleted: false
        };
        if (criteria.searchText) {
            var txts = criteria.searchText.split('=');
            query[txts[0]] = txts[1];
        }
        var cntPromise = Notification.find(query).count();
        var getPromise = Notification.find(query).populate('ship')
            .populate('book')
            .populate({
                path: 'ship',
                populate: {
                    path: 'customer',
                    model: 'Customer'
                }
            })
            .populate({
                path: 'book',
                populate: {
                    path: 'customer',
                    model: 'Customer'
                }
            });

        Promise.all([cntPromise, getPromise])
            .then(([cnt, notifications]) => {
                let page = Math.ceil(cnt / criteria.itemPerPage);
                resolve({ page, notifications });
            })
            .catch(err => reject(err));
    });
}

module.exports.markAsReadNotifications = (providerId, type) => {
    return new Promise((resolve, reject) => {
        let query = {
            provider: providerId,
            isNotified: false,
            isDeleted: false
        };

        if (type) query['type'] = +type;

        Notification.update(
            query,
            {
                $set: {
                    isNotified: true,
                    updatedAt: new Date()
                }
            },
            { multi: true },
            (err, data) => {
                if (err)
                    resolve({ success: false })
                else
                    resolve({ success: true })
            }
        )
    });
}