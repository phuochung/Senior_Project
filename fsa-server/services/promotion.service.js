const mongoose = require('mongoose'),
    Promotion = mongoose.model('Promotion'),
    Provider = mongoose.model('Provider'),
    constants = require('../common/constants'),
    MessageConstants = constants.MessageConstants,
    enums = require("../common/enums"),
    PromotionStatus = enums.PromotionStatus,
    cloudinaryService = require('../services/cloudinary.service'),
    appConfig = require('../statics/app.config');

module.exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        Promotion.findById(id)
            .then(promotion => resolve(promotion))
            .catch(err => reject(err));
    });
}

module.exports.getAllPromotionValidByProvider = (_id) => {
    var today = new Date();
    return new Promise((resolve, reject) => {
        let query = {
            provider: _id,
            isDeleted: false,
            isActive: true,
            status: PromotionStatus.Approved,
            dateTo: {
                '$gte': today
            },
        };
        Promotion.find(query).sort({
            createdAt: -1
        })
            .then(promotions => resolve(promotions))
            .catch(err => reject(err));
    });
}

module.exports.deletePromotion = (id) => {
    return new Promise((resolve, reject) => {
        Promotion.findById(id).then(promotion => {
            promotion.isDeleted = true;
            promotion.save().then(() => {
                if (appConfig.stage == 'prod') {
                    let imgNameWithoutExtention = promotion.imageName && promotion.imageName.split('.').length > 0 ? promotion.imageName.split('.')[0] : '';
                    if (imgNameWithoutExtention) {
                        let public_id = `promotion/${imgNameWithoutExtention}`;
                        cloudinaryService.delete(public_id);
                    }
                }
                resolve({ success: true })
            }).catch(err => reject(err));
        }).catch(err => reject(err));
    })
}

module.exports.addOrUpdatePromotion = (providerId, data) => {
    return new Promise((resolve, reject) => {
        Provider.findById(providerId)
            .then(provider => {
                if (!provider) return;
                let newItem = data;
                if (newItem._id == undefined) {
                    newItem._id = mongoose.Types.ObjectId();
                    newItem.provider = providerId;
                    let promotion = new Promotion(newItem);
                    promotion.save()
                        .then(() => {
                            resolve({
                                success: true,
                                message: MessageConstants.SavedSuccessfully
                            })
                        })
                } else {
                    var updateObj = {};
                    if (newItem.title != undefined) updateObj.title = newItem.title;
                    if (newItem.description != undefined) updateObj.description = newItem.description;
                    if (newItem.imageName != undefined) updateObj.imageName = newItem.imageName;
                    if (newItem.dateFrom != undefined) updateObj.dateFrom = newItem.dateFrom;
                    if (newItem.dateTo != undefined) updateObj.dateTo = newItem.dateTo;
                    if (newItem.status != undefined) updateObj.status = newItem.status;
                    if (newItem.isActive != undefined) updateObj.isActive = newItem.isActive;
                    Promotion.update({
                        _id: newItem._id,
                        provider: providerId
                    }, updateObj, {
                            multi: true
                        })
                        .then(() => {
                            if (appConfig.stage == 'prod') {
                                let imgNameWithoutExtention = newItem.oldImageName && newItem.oldImageName.split('.').length > 0 ? newItem.oldImageName.split('.')[0] : '';
                                if (imgNameWithoutExtention) {
                                    let public_id = `promotion/${imgNameWithoutExtention}`;
                                    cloudinaryService.delete(public_id);
                                }
                            }
                            resolve({
                                success: true,
                                message: MessageConstants.SavedSuccessfully
                            })
                        })
                }
            })
    });
}

module.exports.getPromotions = (providerId, criteria) => {
    return new Promise((resolve, reject) => {
        let query = {
            provider: providerId,
            isDeleted: {
                '$ne': true
            }
        };

        var getPromise = Promotion.find(query).sort({
            createdAt: -1
        })
            .skip(criteria.itemPerPage * (criteria.page - 1))
            .limit(criteria.itemPerPage);
        var cntPromise = Promotion.find(query).count();
        Promise.all([getPromise, cntPromise])
            .then(([promotions, cnt]) => {
                let page = Math.ceil(cnt / criteria.itemPerPage);
                if (page == 0) page = 1;
                criteria.totalPage = page;
                resolve({
                    page,
                    promotions,
                    criteria
                });
            }).catch(err => reject(err));
    });
}

module.exports.getPromotionByIdV2 = (promotionId) => {
    return new Promise((resolve, reject) => {
        var query = {
            _id: promotionId
        }
        Promotion.findById(query)
            .then(promotion => resolve({
                success: true,
                data: promotion
            }))
            .catch(err => reject(err));
    });
}

module.exports.getPromotionById = (promotionId) => {
    return new Promise((resolve, reject) => {
        var query = {
            _id: promotionId
        }
        Promotion.findById(query)
            .then(promotion => resolve(promotion))
            .catch(err => reject(err));
    });
}

module.exports.deletePromotionById = (promotionId) => {
    return new Promise((resolve, reject) => {
        Promotion.findById(promotionId).then(v => {
            v.isDeleted = true;
            v.save().then(v1 => {
                resolve({
                    success: true
                })
            }).catch(err => reject(err));
        });
    });
}

