const
    mongoose = require('mongoose'),
    Book = mongoose.model('Book'),
    constants = require('../common/constants'),
    MessageConstants = constants.MessageConstants,
    StatusConstants = constants.StatusConstants,
    FCMNotificationItemTypes = constants.FCMNotificationItemTypes,
    FCMNotificationMessages = constants.FCMNotificationMessages,
    enums = require("../common/enums"),
    BookStatus = enums.BookStatus,
    NotificationType = enums.NotificationType,
    botHelper = require('../helpers/bot.helper'),
    appConfig = require('../statics/app.config'),
    notificationService = require('../services/notification.service'),
    fcmService = require('../services/fcm.service');

module.exports.submitBook = (provider, customer, bookInfo, botName) => {
    return new Promise((resolve, reject) => {
        const book = new Book({
            provider: provider._id,
            customer: customer._id,
            conditions: bookInfo.conditions,
            dateTime: bookInfo.dateTime,
            numberOfCustomer: bookInfo.size,
            status: BookStatus.Submitted,
            botName: botName,
            createdAt: new Date()
        });

        book.save().then(book => {
            // 
            notificationService.addNotification(provider._id, book._id, NotificationType.Book);
            book.customer = customer;
            // fcmService.pushNotification(book.provider, FCMNotificationItemTypes.Book, book, FCMNotificationMessages.NewRequest);
            let newBookInfor = {
                time: book.dateTime,
                size: book.numberOfCustomer,
                providerName: provider.name
            }
            let bot = botHelper.getBotBybotName(appConfig.botName);
            bot.beginDialog(customer.savedAddress, "*:/finishBook", { bookId: book._id, bookInfo: newBookInfor });
            resolve(true);
        }).catch(err => reject(err));
    });
}

module.exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        Book.findById(id)
            .then(book => resolve(book))
            .catch(err => reject(err));
    });
}

// BOOK - RESERVATION LOGIC
module.exports.addOrUpdateBook = (item) => {
    return new Promise((resolve, reject) => {
        var updateObj = {};
        updateObj.provider = item.providerId ? item.providerId : item.provider;
        updateObj.customer = item.customerId ? item.customerId : item.customer;
        if (item.dateTime) updateObj.dateTime = item.dateTime;
        if (item.conditions) updateObj.conditions = item.conditions;
        if (item.numberOfCustomer) updateObj.numberOfCustomer = item.numberOfCustomer;
        if (item.isNotified) updateObj.isNotified = item.isNotified;
        if (item.reasonRefuse) updateObj.reasonRefuse = item.reasonRefuse;
        if (item.createdAt) updateObj.createdAt = item.createdAt;
        if (item.status) updateObj.status = item.status;
        if (item.botName) updateObj.botName = item.botName;

        if (item._id) {
            // update
            Book.findById(item._id)
                .then(book => {
                    //
                    if (book.status > BookStatus.Submitted && item.status == BookStatus.Cancelled) {
                        resolve({
                            success: false,
                            message: MessageConstants.NotAllowCancelNonePendingBook
                        });
                    } else if ((book.status == BookStatus.Pending) && (item.status == BookStatus.Accepted || item.status == BookStatus.Refused)) {
                        resolve({
                            success: false,
                            message: MessageConstants.NotAllowAcceptOrRefuseInprogressBook
                        })
                    } else if (item.status && book.status > BookStatus.Submitted) {
                        resolve({
                            success: false,
                            message: MessageConstants.SomethingGoesWrong
                        });
                    } else {
                        Book.update({
                            _id: item._id
                        }, updateObj, {
                                multi: false
                            })
                            .then(() => {
                                if (updateObj.status == BookStatus.Cancelled) {
                                    book.status = updateObj.status;
                                    // fcmService.pushNotification(book.provider, FCMNotificationItemTypes.Book, book, FCMNotificationMessages.NewRequest);
                                }

                                // Response to customer chatbot
                                if ([BookStatus.Accepted, BookStatus.Refused].includes(updateObj.status)) {
                                    let bot = botHelper.getBotBybotName(appConfig.botName);
                                    bot.beginDialog(item.customer.savedAddress, "*:/responseBook", { updateObj });
                                }
                                resolve({
                                    success: true,
                                    message: MessageConstants.SavedSuccessfully
                                })
                            }).catch(err => resolve({ success: false }))
                    }
                });

        } else {
            // add
            updateObj.status = BookStatus.Pending;
            let book = new Book(updateObj);
            book.save()
                .then(() => {
                    resolve({
                        success: true,
                        message: MessageConstants.SavedSuccessfully
                    })
                })
        }
    });
}

module.exports.getBooks = (providerId, criteria) => {
    return new Promise((resolve, reject) => {
        let query = {
            provider: providerId,
            isDeleted: {
                '$ne': true
            }
        };
        if (criteria.searchText) {
            switch (criteria.searchText) {
                case StatusConstants.Uncompleted:
                    query = {
                        provider: providerId,
                        status: {
                            '$in': [BookStatus.Pending, BookStatus.Submitted]
                        },
                        isDeleted: {
                            '$ne': true
                        }
                    }
                    break;
                case StatusConstants.Submitted:
                    query = {
                        provider: providerId,
                        status: BookStatus.Submitted,
                        isDeleted: {
                            '$ne': true
                        }
                    }
                    break;
                case StatusConstants.Accepted:
                    query = {
                        provider: providerId,
                        status: BookStatus.Accepted,
                        isDeleted: {
                            '$ne': true
                        }
                    }
                    break;
                case StatusConstants.NotPending:
                    query = {
                        provider: providerId,
                        status: {
                            '$ne': BookStatus.Pending
                        },
                        isDeleted: {
                            '$ne': true
                        }
                    }
                    break;
                case StatusConstants.Completed:
                    query = {
                        provider: providerId,
                        status: {
                            '$in': [BookStatus.Cancelled, BookStatus.Refused, BookStatus.Accepted]
                        },
                        isDeleted: {
                            '$ne': true
                        }
                    }
                    break;
                case StatusConstants.Active:
                    query = {
                        provider: providerId,
                        status: {
                            '$in': [BookStatus.Submitted, BookStatus.Accepted]
                        },
                        isDeleted: {
                            '$ne': true
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        var cntPromise = Book.find(query).count();
        var skippedPages = criteria.itemPerPage * (criteria.currentPage - 1);
        var getPromise = Book.find(query)
            .populate('customer')
            .populate('provider')
            .sort({
                createdAt: -1
            })
            .skip(skippedPages > 0 ? +skippedPages : 0)
            .limit(+criteria.itemPerPage);

        Promise.all([cntPromise, getPromise])
            .then(([cnt, books]) => {
                let page = Math.ceil(cnt / criteria.itemPerPage);
                resolve({
                    page,
                    books
                });
            })
            .catch(err => reject(err));
    });
}

module.exports.getBookById = (providerId, id) => {
    return new Promise((resolve, reject) => {
        let query = {
            provider: providerId,
            _id: id
        };

        Book.findOne(query)
            .populate('provider')
            .populate('customer')
            .exec((err, book) => {
                if (err) {
                    resolve({
                        success: false
                    });
                } else {
                    resolve({
                        success: true,
                        data: book
                    });
                }
            })
    });
}