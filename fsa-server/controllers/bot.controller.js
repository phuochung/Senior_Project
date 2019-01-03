const
    shipService = require('../services/ship.service'),
    bookService = require('../services/book.service'),
    menuService = require('../services/menu.service'),
    providerService = require('../services/provider.service'),
    promotionService = require('../services/promotion.service'),
    authService = require('../services/auth.service'),
    appConfig = require('../statics/app.config');

module.exports.index = (req, res, next) => {
    if (req.query.token) {
        let err = {
            message: "Access Denied. Token is invalid",
            status: 403
        };
        let tokenStr = authService.verifyAccessToken(req.query.token);
        if (!tokenStr) {
            return next(err);
        } else {
            next();
        }
    } else {
        let err = {
            message: 'fbId or token is required',
            status: 400
        };
        return next(err);
    }
}

// BOOK CONTROLLER
module.exports.addOrUpdateBook = (req, res, next) => {
    bookService.addOrUpdateBook(req.body)
        .then((rs) => res.json(rs))
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

module.exports.getBookById = (req, res, next) => {
    bookService.getBookById(req.body.id, req.query.id)
        .then(data => {
            res.json(data)
        })
        .catch(err => next(err));
}

// SHIP CONTROLLER
module.exports.addOrUpdateShip = (req, res, next) => {
    shipService.addOrUpdateShip(req.body)
        .then((rs) => res.json(rs))
        .catch(err => next(err));
}

module.exports.getShips = (req, res, next) => {
    shipService.getShips(req.body.id, req.body)
        .then(data => {
            res.json({
                success: true,
                data: data.ships,
                totalPage: data.page,
                costShip: data.costShip
            })
        })
        .catch(err => next(err));
}

module.exports.getShipById = (req, res, next) => {
    shipService.getShipById(req.body.id, req.query.id)
        .then(data => {
            res.json(data)
        })
        .catch(err => next(err));
}

// MENU CONTROLLER
module.exports.checkMenuName = (req, res, next) => {
    menuService.checkMenuName(req.body.id, req.body.name, req.body.menuId).then(rs => {
        res.json(rs);
    }).catch(err => next(err));
}

module.exports.getMenu = (req, res, next) => {
    menuService.getMenuWithCriteria(req.body.id, req.body)
        .then(data => {
            res.json({
                success: true,
                data: {
                    menu: data.menu,
                    criteria: data.criteria
                }
            })
        })
        .catch(err => next(err));
}

// PROMOTIONS
module.exports.getPromotions = (req, res, next) => {
    promotionService.getPromotions(req.body.id, req.body)
        .then(data => {
            res.json({
                success: true,
                data: data
            })
        })
        .catch(err => next(err));
}

module.exports.addOrUpdatePromotion = (req, res, next) => {
    promotionService.addOrUpdatePromotion(req.body.id, req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

module.exports.deletePromotion = (req, res, next) => {
    promotionService.deletePromotion(req.query.id)
        .then(data => res.json(data))
        .catch(err => next(err));
}

module.exports.getPromotionById = (req, res, next) => {
    promotionService.getPromotionByIdV2(req.query.id)
        .then(data => res.json(data))
        .catch(err => next(err));
}

module.exports.uploadImage = (req, res, next) => {
    var providerId = req.body.id.toString();
    // Need to check on prod
    var type = req.query.type;
    var fstream;
    var localPath = '';
    var saveTo = '';
    var fileNameOut = '';
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        filename = providerId + "_" + uuid.v4() + path.extname(filename);
        fileNameOut = filename;
        localPath = '/img/upload/' + type + '/' + filename;
        var pathTemp = path.join(__dirname, '../public') + '/img/upload/' + type;
        if (!fs.existsSync(pathTemp)) {
            fs.mkdirSync(pathTemp);
        }
        saveTo = path.join(__dirname, '../public') + localPath;
        fstream = fs.createWriteStream(saveTo);
        file.pipe(fstream);
    });
    req.busboy.on('finish', function () {
        if (type == 'bg')
            providerService.updateBackground(providerId, fileNameOut);
        if (appConfig.stage == 'dev')
            res.json({
                success: true,
                data: fileNameOut
            });
        if (appConfig.stage == 'prod') {
            //send a copy to Gonjoy.io for better performance in vietnam
            let url = "http://gonjoy.io/static/upload.php";
            Jimp.read(saveTo, function (err, lenna) {
                lenna.resize(600, Jimp.AUTO).quality(80).write(saveTo, function () {
                    fs.stat(path.join(__dirname, '../public') + localPath, function (err, stats) {
                        fs.stat(saveTo, function (err, stats) {
                            var formData = {
                                "fileName": "public" + localPath,
                                "image": fs.createReadStream(saveTo)
                            }
                            request.post({
                                url: url,
                                formData: formData
                            }, function optionalCallback(err, httpResponse, body) {
                                if (err) {
                                    res.json({
                                        success: false
                                    });
                                    return console.error('upload failed:', err);
                                } else
                                    res.json({
                                        success: true
                                    });
                            });
                        });
                    });
                })
            });
        }

    });
}