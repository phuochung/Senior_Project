const providerService = require('../services/provider.service'),
    authService = require('../services/auth.service'),
    localizationService = require('../services/localization.service'),
    notificationService = require('../services/notification.service'),
    bookService = require('../services/book.service'),
    shipService = require('../services/ship.service'),
    promotionService = require('../services/promotion.service'),
    menuService = require('../services/menu.service'),
    answerFaqService = require('../services/answerFaq.Service'),
    cloudinaryService = require('../services/cloudinary.service'),
    fs = require('fs'),
    path = require('path'),
    uuid = require('uuid'),
    appConfig = require('../statics/app.config'),
    Jimp = require("jimp");

module.exports.index = (req, res) => {
    providerService.getAll()
        .then(providers => res.render('provider/index', {
            providers: providers
        }))
        .catch(err => next(err));
}

module.exports.getLocalizations = (req, res) => {
    let fields = localizationService.getAll()
    res.json(fields);
}

module.exports.getCurrentUser = (req, res, next) => {
    providerService.getById(req.body.id)
        .then(provider => res.json(provider))
        .catch(err => next(err));
}

module.exports.getMenu = (req, res, next) => {
    menuService.getMenu(req.body.id)
        .then(menu => res.json(menu))
        .catch(err => next(err));
}

module.exports.getItemOnMenuById = (req, res, next) => {
    menuService.getItemOnMenuById(req.body.id, req.query.id)
        .then(item => {
            res.json(item)
        })
        .catch(err => next(err));
}

module.exports.addOrUpdateItemToMenu = (req, res, next) => {
    menuService.addOrUpdateItemToMenu(req.body.id, req.query.act, req.body)
        .then((success) => res.json(success))
        .catch(err => next(err));
}

module.exports.deleteItemOnMenu = (req, res, next) => {
    menuService.deleteItemOnMenu(req.body.id, req.body)
        .then(rs => res.json(rs))
        .catch(err => next(err));
}

module.exports.deleteMenuById = (req, res, next) => {
    menuService.deleteMenuById(req.body.id, req.query.id)
        .then(rs => res.json(rs))
        .catch(err => next(err));
}

module.exports.uploadImage = (req, res, next) => {
    var providerId = req.body.id.toString();
    var type = req.query.type;
    var fstream;
    var localPath = '';
    var fileNameOut = '';
    var pathImage = '';
    if (req.busboy) {
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            // check directory exists
            var directoryPath = path.join(__dirname, '../public') + '/img/upload/' + type;
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath);
            }
            //
            fileNameOut = providerId + "_" + uuid.v4();
            localPath = '/img/upload/' + type + '/' + fileNameOut;
            pathImage = path.join(__dirname, '../public') + localPath;
            fstream = fs.createWriteStream(pathImage);
            file.pipe(fstream);
        });
        req.busboy.on('finish', function () {
            if (appConfig.stage == 'prod') {
                Jimp.read(pathImage, function (err, lenna) {
                    lenna.resize(600, Jimp.AUTO).quality(80).write(pathImage, function () {
                        fs.stat(pathImage, function (err, stats) {
                            publicId = `${type}/${fileNameOut}`;
                            cloudinaryService.upload(pathImage, publicId).then(result => {
                                if (result && result['success']) {
                                    res.json({
                                        success: true,
                                        data: `${fileNameOut}.${result.format}`,
                                    });
                                } else {
                                    res.json({
                                        success: false,
                                    });
                                }
                            })
                        })
                    });
                });
            } else {
                res.json({
                    success: false,
                });
            }
        });
    }

}

module.exports.getPromotions = (req, res, next) => {
    promotionService.getPromotions(req.body.id, req.body)
        .then(data => {
            res.json({
                data: data.promotions,
                totalPage: data.page
            })
        })
        .catch(err => next(err));
}

module.exports.getPromotionById = (req, res, next) => {
    promotionService.getPromotionById(req.query.id)
        .then(rs => {
            res.json(rs)
        })
        .catch(err => next(err));
}

module.exports.deletePromotionById = (req, res, next) => {
    promotionService.deletePromotionById(req.query.id)
        .then(rs => res.json(true))
        .catch(err => next(err));
}

module.exports.getBooks = (req, res, next) => {
    bookService.getBooks(req.body.id, req.body)
        .then(data => {
            res.json({
                success: true,
                data: data.books,
                totalPage: data.page
            })
        })
        .catch(err => next(err));
}

module.exports.updateBookById = (req, res, next) => {
    bookService.addOrUpdateBook(req.body)
        .then((success) => res.json(success))
        .catch(err => next(err));
}

module.exports.getShips = (req, res, next) => {
    shipService.getShips(req.body.id, req.body)
        .then(data => {
            res.json({
                data: data.ships,
                totalPage: data.page,
                costShip: data.costShip
            })
        })
        .catch(err => next(err));
}

module.exports.updateShipById = (req, res, next) => {
    shipService.addOrUpdateShip(req.body)
        .then((success) => res.json(success))
        .catch(err => next(err));
}

module.exports.deleteShip = (req, res, next) => {
    shipService.deleteShip(req.body.id, req.query.id)
        .then((success) => res.json(success))
        .catch(err => next(err));
}

module.exports.getNotifications = (req, res, next) => {
    notificationService.getNotifications(req.body.id, req.body)
        .then(data => {
            res.json({
                data: data.notifications,
                totalPage: data.page
            })
        })
        .catch(err => next(err));
}

module.exports.markAsReadNotifications = (req, res, next) => {
    notificationService.markAsReadNotifications(req.body.id, req.query.type)
        .then(rs => {
            res.json(rs)
        })
        .catch(err => next(err));
}

module.exports.addDeviceToken = (req, res, next) => {
    providerService.addDeviceToken(req.body.id, req.body)
        .then((success) => res.json(success))
        .catch(err => next(err));
}

//intentsOutput - Faq
module.exports.getAnswerFaqs = (req, res, next) => {
    answerFaqService.getAll(req.body.id)
        .then(rs => res.json(rs))
        .catch(err => next(err));
}

module.exports.updateAnswerFaq = (req, res, next) => {
    answerFaqService.update(req.body)
        .then(rs => res.json(rs))
        .catch(err => next(err));
}