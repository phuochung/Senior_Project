const
    Moment = require('moment-timezone'),
    mongoose = require('mongoose'),
    Provider = mongoose.model('Provider'),
    Ship = mongoose.model('Ship'),
    providerService = require('./provider.service'),
    customerService = require('../services/customer.service'),
    notificationService = require('../services/notification.service'),
    fcmService = require('../services/fcm.service'),
    currencyService = require('../services/currency.service'),
    appConfig = require('../statics/app.config'),
    enums = require('../common/enums'),
    NotificationType = enums.NotificationType,
    ShipStatus = enums.ShipStatus,
    constants = require('../common/constants'),
    MessageConstants = constants.MessageConstants,
    StatusConstants = constants.StatusConstants,
    FCMNotificationItemTypes = constants.FCMNotificationItemTypes,
    FCMNotificationMessages = constants.FCMNotificationMessages,
    botHelper = require('../helpers/bot.helper');


module.exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        Ship.findById(id)
            .populate('listDish.price.currency')
            .exec((err, ship) => {
                resolve(ship)
            })
            .catch(err => reject(err));
    });
}

module.exports.create = (provider, customer) => {
    return new Promise((resolve, reject) => {
        let ref = Moment().tz('Asia/Ho_Chi_Minh').format('YYMMDDHHmm') + "_" + Math.floor(Math.random() * 1000);;
        const ship = new Ship({
            provider: provider._id,
            customer: customer._id,
            orderNumber: ref,
            createdAt: new Date(),
        });

        ship.save().then(ship => {
            resolve(ship)
        }).catch(err => reject(err));
    });
}

module.exports.updateShipItems = (ship, provider, shipItems) => {
    return new Promise((resolve, reject) => {
        providerService.getProviderWithMenuById(provider._id)
            .then(rs => {
                var promises = [];
                shipItems.forEach(function (shipItem) {
                    promises.push(new Promise(resolve => {
                        rs.menus.forEach(function (menuItem) {
                            if (menuItem._id.toString() == shipItem.id.toString().trim()) {
                                shipItem.price = menuItem.price;
                                shipItem.name = menuItem.name;
                                shipItem.id = menuItem._id;
                                resolve(shipItem);
                            }
                        });
                    }))
                })

                Promise.all(promises).then((data) => {
                    ship.listDish = shipItems;
                    ship.save().then(ship => {
                        resolve(ship)
                    }).catch(err => reject(err));
                }).catch(err => reject(err));
            });
    })
};

module.exports.updateShipInfo = (ship, shipInfo) => {
    return new Promise((resolve, reject) => {
        let options = {
            upsert: true
        };
        let newShip = {
            address: shipInfo.address,
            telephone: shipInfo.phone,
            notes: shipInfo.note,
            listDish: ship.listDish,
        }
        Ship.findOneAndUpdate({ _id: ship._id }, newShip, options).then(ship => {
            resolve(ship)
        }).catch(err => reject(err));
    })
}

module.exports.completeShip = (ship, provider) => {
    return new Promise((resolve, reject) => {
        let priceTotal;
        for (let i = 0; i < ship.listDish.length; i++) {
            if (i == 0) priceTotal = currencyService.calculateMultiplicationPriceWithANumber(ship.listDish[i].price, ship.listDish[i].numberDishs);
            else {
                var totalPrice = currencyService.calculateMultiplicationPriceWithANumber(ship.listDish[i].price, ship.listDish[i].numberDishs);
                priceTotal = currencyService.calculateSum2Prices(priceTotal, totalPrice);
            }
        }
        ship.priceTotal = priceTotal;
        ship.status = ShipStatus.Submitted;
        ship.save().then(ship => {
            var addNotificationPromise = notificationService.addNotification(provider._id, ship._id, NotificationType.Ship);
            var getProviderPromise = providerService.getById(provider._id);
            var getCustomerPromise = customerService.getById(ship.customer);
            Promise.all([addNotificationPromise, getProviderPromise, getCustomerPromise])
                .then(([noti, provider, customer]) => {
                    ship.customer = customer;
                    // fcmService.pushNotification(ship.provider ? ship.provider : ship.providerId, FCMNotificationItemTypes.Ship, ship, FCMNotificationMessages.NewRequest);
                    let bot = botHelper.getBotBybotName(appConfig.botName);

                    let content = `Bạn đã gửi yêu cầu giao hàng đến ${provider.name}\nĐơn hàng của bạn bao gồm: \n`;
                    let totalItemCost = 0;
                    ship.listDish.forEach(dish => {
                        content += `    ${dish.name} x ${dish.numberDishs} \n`;
                        let itemCost = (dish.price).getPriceByCurrencyWithoutFormat(provider.currency.code) * dish.numberDishs;
                        totalItemCost += itemCost;
                    });
                    content += `\nTổng cộng(chưa bao gồm phí giao hàng): ${totalItemCost.formatCurrency(provider.currency.code)}\nVui lòng đợi trong giây lát.`
                    bot.beginDialog(customer.savedAddress, "*:/finishShip", { shipId: ship._id, content: content });
                    var shipNumber = provider.tel;
                    if (shipNumber == undefined || shipNumber == null) {
                        shipNumber = provider.tel;
                    }
                    resolve(ship);
                })

        })
    })
};

// SHIP LOGIC
module.exports.addOrUpdateShip = (item) => {
    return new Promise((resolve, reject) => {
        var updateObj = {};
        updateObj.provider = item.providerId ? item.providerId : item.provider;
        updateObj.customer = item.customerId ? item.customerId : item.customer;
        if (item.notes) updateObj.notes = item.notes;
        if (item.listDish) updateObj.listDish = item.listDish;
        if (item.priceTotal) updateObj.priceTotal = item.priceTotal;
        if (item.isNotified) updateObj.isNotified = item.isNotified;
        if (item.address) updateObj.address = item.address;
        if (item.reasonRefuse) updateObj.reasonRefuse = item.reasonRefuse;
        if (item.createdAt) updateObj.createdAt = item.createdAt;
        if (item.isDeleted) updateObj.isDeleted = item.isDeleted;
        if (item.telephone) updateObj.telephone = item.telephone;
        if (item.orderNumber) updateObj.orderNumber = item.orderNumber;
        // 
        if (item.status) updateObj.status = item.status;
        if (item.botName) updateObj.botName = item.botName;
        if (item._id) {
            //
            Ship.findById(item._id)
                .then(ship => {
                    //
                    if (ship.status > ShipStatus.Submitted && item.status == ShipStatus.Cancelled) {
                        resolve({
                            success: false,
                            message: MessageConstants.NotAllowCancelNonePendingShip
                        });
                    } else if ((ship.status == ShipStatus.Pending) && (item.status == ShipStatus.Accepted || item.status == ShipStatus.Refused)) {
                        resolve({
                            success: false,
                            message: MessageConstants.NotAllowAcceptOrRefuseInprogressShip
                        })
                    } else {
                        // update
                        Ship.update({
                            _id: item._id
                        }, updateObj, {
                                multi: false
                            })
                            .then(() => {
                                if (updateObj.status == ShipStatus.Cancelled) {
                                    ship.status = updateObj.status;
                                    // fcmService.pushNotification(ship.provider, FCMNotificationItemTypes.Ship, ship, FCMNotificationMessages.NewRequest);
                                }
                                // Response to customer chatbot
                                if ([ShipStatus.Accepted, ShipStatus.Refused].includes(updateObj.status)) {
                                    //[TODO] write service
                                    let bot = botHelper.getBotBybotName(appConfig.botName);
                                    bot.beginDialog(item.customer.savedAddress, "*:/responseShip", { updateObj });
                                }
                                resolve({
                                    success: true,
                                    status: updateObj.status,
                                    message: MessageConstants.SavedSuccessfully
                                })
                            }).catch(err => {
                                console.log(err)
                                resolve({ success: false });
                            })
                    }
                });
        } else {
            // add
            updateObj.status = ShipStatus.Pending;

            let ship = new Ship(updateObj);
            ship.save()
                .then(() => {
                    resolve({
                        success: true,
                        message: MessageConstants.SavedSuccessfully
                    })
                })

        }
    });
}

module.exports.getShips = (providerId, criteria) => {
    return new Promise((resolve, reject) => {
        let query = {
            provider: providerId,
            isDeleted: {
                '$ne': true
            },
            status: ShipStatus.Submitted
        };
        if (criteria.searchText) {
            switch (criteria.searchText) {
                case StatusConstants.Uncompleted:
                    query = {
                        provider: providerId,
                        status: {
                            '$in': [ShipStatus.Pending, ShipStatus.Submitted]
                        },
                        isDeleted: {
                            '$ne': true
                        }
                    }
                    break;
                case StatusConstants.Submitted:
                    query = {
                        provider: providerId,
                        status: ShipStatus.Submitted,
                        isDeleted: {
                            '$ne': true
                        }
                    }
                    break;
                case StatusConstants.Accepted:
                    query = {
                        provider: providerId,
                        status: ShipStatus.Accepted,
                        isDeleted: {
                            '$ne': true
                        }
                    }
                    break;
                case StatusConstants.NotPending:
                    query = {
                        provider: providerId,
                        status: {
                            '$ne': ShipStatus.Pending
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
                            '$in': [ShipStatus.Cancelled, ShipStatus.Refused, ShipStatus.Accepted]
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
                            '$in': [ShipStatus.Submitted, ShipStatus.Accepted]
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
        var providerPromise = Provider.findById(providerId);
        var cntPromise = Ship.find(query).count();
        var skippedPages = criteria.itemPerPage * (criteria.currentPage - 1);
        var getPromise = Ship.find(query)
            .populate('customer')
            .populate('provider')
            .populate('priceTotal.currency')
            .sort({
                createdAt: -1
            })
            .skip(skippedPages > 0 ? +skippedPages : 0)
            .limit(+criteria.itemPerPage);

        Promise.all([cntPromise, getPromise, providerPromise])
            .then(([cnt, ships, provider]) => {
                let page = Math.ceil(cnt / criteria.itemPerPage);
                let costShip = provider.costShip ? provider.costShip : 0;
                resolve({
                    page,
                    ships,
                    costShip
                });
            })
            .catch(err => reject(err));
    });
}

module.exports.getShipById = (providerId, id) => {
    return new Promise((resolve, reject) => {
        let query = {
            $or: [{
                providerId: providerId
            }, {
                provider: providerId
            }],
            _id: id
        };

        Ship.findOne(query)
            .populate('provider')
            .populate('customer')
            .exec((err, ship) => {
                if (err) {
                    resolve({
                        success: false
                    });
                } else {
                    resolve({
                        success: true,
                        data: ship
                    });
                }
            })
    });
}

module.exports.deleteShip = (providerId, id) => {
    return new Promise((resolve, reject) => {
        var query = {
            _id: id,
            provider: providerId
        };
        Ship.findOne(query)
            .then(ship => {
                if (ship) {
                    ship.isDeleted = true;
                    ship.save().then(() => {
                        resolve({
                            success: true
                        });
                    })
                } else {
                    resolve({
                        success: true,
                        message: MessageConstants.NotFoundShip
                    });
                }
            })
    });
}