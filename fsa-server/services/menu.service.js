const mongoose = require('mongoose'),
    fs = require('fs'),
    Provider = mongoose.model('Provider'),
    Menu = mongoose.model('Menu'),
    constants = require('../common/constants'),
    MessageConstants = constants.MessageConstants,
    CurrencyCode = constants.CurrencyCode,
    FormActions = constants.FormActions,
    currencyHelper = require('../helpers/currency.helper'),
    appConfig = require('../statics/app.config'),
    path = require('path'),
    currencyService = require('../services/currency.service'),
    cloudinaryService = require('../services/cloudinary.service'),
    _ = require('lodash');

module.exports.getByProviderId = (providerId) => {
    return new Promise((resolve, reject) => {
        var query = {
            provider: providerId,
            isActive: true,
            isDeleted: false
        };

        Menu.find(query)
            .populate('price.currency')
            .exec((err, menus) => {
                resolve(menus)
            });
    })
}

module.exports.getAll = () => {
    return new Promise((resolve, reject) => {
        Menu.find({
            isActive: true,
            isDeleted: false
        })
            .then(menu => resolve(menu))
            .catch(err => reject(err));
    });
}

module.exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        Menu.findOne({
            _id: id
        })
            .then(menu => resolve(menu))
            .catch(err => reject(err));
    });
}

module.exports.addOrUpdateItemToMenu = (providerId, act, data) => {
    return new Promise((resolve, reject) => {
        if (appConfig.stage == 'dev') {
            if (data.item && data.item.oldThumbnail) {
                var pathImage = path.join(__dirname, '../public') + '/img/upload/menu/' + data.item.oldThumbnail;
                if (fs.existsSync(pathImage)) {
                    fs.unlink(pathImage, (err) => {
                        if (err) throw err;
                        console.log(pathImage, ' was deleted');
                    });
                }
            }
        }
        if (appConfig.stage == 'prod') {
            let imgNameWithoutExtention = data.item.oldThumbnail && data.item.oldThumbnail.split('.').length > 0 ? data.item.oldThumbnail.split('.')[0] : '';
            if (imgNameWithoutExtention) {
                let public_id = `menu/${imgNameWithoutExtention}`;
                cloudinaryService.delete(public_id);
            }
        }
        Provider.findById(providerId)
            .populate('currency')
            .then(provider => {
                let currencies = currencyService.getAll();
                let providerCurrencyCode = provider.currency ? provider.currency.code : CurrencyCode.VND;
                var newItem = data.item;
                if (data.item.price)
                    newItem.price = [{
                        currency: currencies.find(c => c.code == CurrencyCode.USD)._id,
                        value: providerCurrencyCode == CurrencyCode.USD ? data.item.price : currencyHelper.VNDtoUSD(data.item.price)
                    },
                    {
                        currency: currencies.find(c => c.code == CurrencyCode.VND)._id,
                        value: providerCurrencyCode == CurrencyCode.VND ? data.item.price : currencyHelper.USDtoVND(data.item.price)
                    }
                    ];

                var ids = data.ids;
                if ((newItem._id == undefined && act != FormActions.UpdateMany) || act == FormActions.Copy || ids.length == 0) {
                    newItem._id = mongoose.Types.ObjectId();
                    newItem.isLunch = false;
                    newItem.id = 0;
                    newItem.provider = providerId;

                    Menu.insertMany([newItem])
                        .then(() => resolve({
                            success: true
                        }));
                } else {
                    var updateObj = {};
                    if (newItem.name != undefined) updateObj.name = newItem.name;
                    if (newItem.description != undefined) updateObj.description = newItem.description;
                    if (newItem.thumbnail != undefined) updateObj.thumbnail = newItem.thumbnail;
                    if (newItem.price != undefined) updateObj.price = newItem.price;
                    if (newItem.rate != undefined) updateObj.rate = newItem.rate;
                    if (newItem.canShip != undefined) updateObj.canShip = newItem.canShip;
                    if (newItem.isNewItem != undefined) updateObj.isNewItem = newItem.isNewItem;
                    if (newItem.isFood != undefined) updateObj.isFood = newItem.isFood;

                    Menu.update({
                        _id: {
                            $in: ids
                        },
                        provider: providerId
                    }, updateObj, {
                            multi: true
                        })
                        .then(() => {
                            resolve({
                                success: true
                            })
                        })
                }
            })
    });
}

module.exports.getMenu = (providerId) => {
    return new Promise((resolve, reject) => {
        var query = {
            provider: providerId,
            isDeleted: false
        }

        Menu.find(query)
            .sort({
                name: 1
            })
            .lean()
            .populate('price.currency')
            .exec((err, menus) => {
                resolve(menus)
            });
    })
}

module.exports.getItemOnMenuById = (providerId, id) => {
    return new Promise((resolve, reject) => {
        var query = {
            _id: id,
            provider: providerId,
            isDeleted: false
        }

        Menu.findOne(query)
            .lean()
            .populate('price.currency')
            .exec((err, menu) => {
                resolve(menu)
            });
    })
}

module.exports.deleteItemOnMenu = (providerId, data) => {
    return new Promise((resolve, reject) => {
        Menu.update({
            _id: {
                $in: data.ids
            },
            provider: providerId,
            isLunch: {
                $ne: true
            }
        }, {
                isDeleted: true
            }, {
                multi: true
            })
            .then(() => {
                resolve({
                    success: true
                })
            })
    });
}

module.exports.deleteMenuById = (providerId, menuId) => {
    return new Promise((resolve, reject) => {
        Menu.findOneAndUpdate({
            provider: providerId,
            _id: menuId
        }, {
                isDeleted: true
            })
            .then((menu) => {
                if (appConfig.stage == 'prod') {
                    let imgNameWithExtention = menu.thumbnail && menu.thumbnail.split('.').length > 0 ? menu.thumbnail.split('.')[0] : '';
                    if (imgNameWithExtention) {
                        let public_id = `menu/${imgNameWithExtention}`;
                        cloudinaryService.delete(public_id);
                    }
                }
                resolve({
                    success: true,
                    messsage: MessageConstants.SavedSuccessfully
                })
            })
    });
}

module.exports.getMenuWithCriteria = (providerId, criteria) => {
    return new Promise((resolve, reject) => {
        var query = {
            provider: providerId,
            isActive: true,
            isDeleted: false,
            isFood: criteria.searchText == "food" ? {
                $ne: false
            } : false
        }

        var cntPromise = Menu.find(query).count();
        var getPromise = Menu.find(query)
            .collation({
                locale: "en"
            })
            .sort({
                'name': 1
            })
            .skip((+criteria.itemPerPage) * (criteria.currentPage - 1))
            .limit(+criteria.itemPerPage);

        Promise.all([cntPromise, getPromise])
            .then(([cnt, menu]) => {
                criteria.totalPage = Math.ceil(cnt / criteria.itemPerPage);
                if (criteria.totalPage == 0) criteria.totalPage = 1;
                resolve({
                    menu,
                    criteria
                });
            })
            .catch(err => reject(err));
    });
}

module.exports.checkMenuName = (providerId, menuName, menuId) => {
    return new Promise((resolve, reject) => {
        Menu.findOne({
            provider: providerId,
            name: menuName,
            isDeleted: false,
        })
            .then(menu => {

                if ((!menu) || (menu && menuId && menuId == menu._id.toString())) {
                    resolve({
                        success: true
                    })
                } else {
                    resolve({
                        success: false,
                        message: MessageConstants.MenuNameExistingError
                    })
                }
            })
            .catch(err => reject(err));
    });
}