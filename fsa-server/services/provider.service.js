const mongoose = require('mongoose'),
    passwordHelper = require('../helpers/password.helper'),
    Provider = mongoose.model('Provider'),
    Book = mongoose.model('Book'),
    Ship = mongoose.model('Ship'),
    Menu = mongoose.model('Menu'),
    Currency = mongoose.model('Currency'),
    constants = require('../common/constants'),
    MessageConstants = constants.MessageConstants,
    CurrencyCode = constants.CurrencyCode,
    currencyService = require('../services/currency.service'),
    fs = require('fs'),
    uniqueHelper = require('../helpers/unique.helper');

let configs = [];

module.exports.loadBotConfigs = (callback) => {
    return new Promise((resolve, reject) => {
        Provider.find({ isActivedBot: true }).then(providers => {
            let tmpConfigs = [];
            for (let i = 0; i < providers.length; i++) {
                let tmpToken = {
                    "username": providers[i].username,
                    botToken: providers[i].botToken
                }
                tmpConfigs.push(tmpToken);
            }
            configs = tmpConfigs;
            resolve();
        }).catch(err => reject(err));
    }).catch(err => reject(err));
}
module.exports.getAllBotConfig = () => {
    return configs;
}
module.exports.getBotConfig = (username) => {
    for (var i = 0; i < configs.length; i++) {
        if (configs[i].username == username) {
            return configs[i].botToken;
        }
    }
    return null;
}
module.exports.register = (host, p) => {
    return new Promise((resolve, reject) => {
        fs.readFile('temp/default_sp.json', 'utf8', function (err, data) {
            if (err) throw err;
            let sp = JSON.parse(data);
            var username = p.username.toLowerCase();
            Provider.findOne({
                username: username
            })
                .then(provider => {
                    if (provider != null) {
                        return resolve({
                            result: false,
                            message: MessageConstants.UsernameExistingError
                        })
                    } else {
                        let code = uniqueHelper.generate();
                        let currencies = currencyService.getAll();
                        let currencyId = currencies.find(c => c.code == CurrencyCode.VND)._id;
                        let provider = new Provider({
                            name: p.name,
                            username: username,
                            password: passwordHelper.hash(username, p.password),
                            email: p.email,
                            tel: p.tel,
                            address: p.address,
                            coin: 0,
                            background: '',
                            currency: currencyId,
                            criterion: sp.criterion,
                            isActive: false,
                            lang: p.lang,
                            createdAt: new Date()
                        });

                        provider.save().then(() => {
                            // informm to sp
                            resolve({
                                success: true,
                                message: MessageConstants.RegisterSuccessfully
                            });
                        }).catch(err => reject(err));
                    }
                })
                .catch(err => reject(err));
        });
    });
}

module.exports.checkUsername = (username) => {
    return new Promise((resolve, reject) => {
        Provider.findOne({
            username: username
        })
            .then(provider => {
                if (provider) {
                    resolve({ success: false, message: MessageConstants.UsernameExistingError })
                } else {
                    resolve({ success: true })
                }
            })
            .catch(err => reject(err));
    });
}

module.exports.verify = (username, code) => {
    return new Promise((resolve, reject) => {
        Provider.findOne({
            username: username,
        })
            .then(provider => {
                if (provider == null) {
                    resolve(MessageConstants.LinkNotExistingError)
                } else {
                    if (!provider.isActive) {
                        provider.isActive = true;
                        provider.save().then(() => {
                            resolve(MessageConstants.VerifyEmailSuccessfully);
                        }).catch(err => reject(err));
                    } else {
                        resolve(MessageConstants.EmailVerified);
                    }


                }
            })
            .catch(err => reject(err));
    });
}

module.exports.getAll = () => {
    return new Promise((resolve, reject) => Provider.find()
        .then(providers => resolve(providers))
        .catch(err => reject(err)));
}

module.exports.getByUsername = (username) => {
    return new Promise((resolve, reject) => {
        Provider.findOne({
            username: username
        })
            .then(provider => {
                resolve(provider)
            })
            .catch(err => reject(err));
    });
}

module.exports.getByFanpageId = (fanpageId) => {
    return new Promise((resolve, reject) => {
        Provider.findOne({
            fanpageId: fanpageId
        })
            .then(provider => {
                resolve(provider)
            })
            .catch(err => reject(err));
    });
}

module.exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        Provider.findById(id)
            .populate('currency')
            .exec((err, provider) => resolve(provider))
            .catch(err => reject(err));
    });
}

module.exports.getProviderWithMenuById = (id) => {
    return new Promise((resolve, reject) => {
        const menuPromise = Menu.find({ provider: id, isDeleted: false })
            .sort({ name: 1 })
            .populate('price.currency');

        const providerPromise = Provider.findById(id)
            .populate('currency');
        const currencyPromise = Currency.find({});

        Promise.all([menuPromise, providerPromise, currencyPromise])
            .then(([rs, provider, currencies]) => {
                if (!provider.currency) provider.currency = currencies.find(c => c.code = CurrencyCode.VND);
                resolve({ provider, menus: rs })
            });
    });
}

module.exports.addOrUpdate = (provider) => {
    return new Promise((resolve, reject) => {
        let query = {
            _id: provider._id
        };
        let options = {
            upsert: true
        };
        Provider.findOneAndUpdate(query, provider, options)
            .then(cus => resolve(cus))
            .catch(err => reject(err));
    });
}

module.exports.updateBackground = (providerId, bgName) => {
    return new Promise((resolve, reject) => {
        let query = {
            _id: providerId
        };
        let options = {
            upsert: true
        };
        Provider.findOneAndUpdate(query, {
            background: bgName
        }, options)
            .then(cus => resolve(cus))
            .catch(err => reject(err));
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

        var getPromise = Book.find(query)
            .sort({ createdAt: -1 })
            .skip(criteria.itemPerPage * (criteria.page - 1))
            .limit(criteria.itemPerPage);

        var cntPromise = Book.find(query).count();
        Promise.all([getPromise, cntPromise])
            .then(([books, cnt]) => {
                let page = Math.ceil(cnt / criteria.itemPerPage);
                resolve({
                    page,
                    books
                });
            }).catch(err => reject(err));
    })
}

// FOR TEST WEBSOCKET NOTIFY
module.exports.getShipById = (providerId) => {
    return new Promise((resolve, reject) => {
        let query = {
            providerId: providerId
        };
        Ship.findOne(query)
            .then(ship => resolve(ship));
    });
}

module.exports.addDeviceToken = (providerId, data) => {
    let deviceToken = data.deviceToken;
    return new Promise((resolve, reject) => {
        Provider.findById(providerId)
            .then(provider => {
                if (provider.deviceTokens) {
                    if (provider.deviceTokens.indexOf(deviceToken) < 0) {
                        {
                            provider.deviceTokens.push(deviceToken);
                            provider.save().then(() => resolve({
                                success: true, message: "Device token was added successfully"
                            }));
                        }
                    } else {
                        resolve({
                            success: true, message: "Device token already exists"
                        });
                    }
                } else {
                    provider.deviceTokens = [deviceToken];
                    provider.save().then(() => resolve({
                        success: true, message: "Device token was added successfully"
                    }));
                }
            })
            .catch(err => reject(err));
    });
}