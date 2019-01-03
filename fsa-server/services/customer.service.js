const Customer = require('mongoose').model('Customer'),
    fbService = require('../services/facebook.service');

module.exports.getCustomersRequestingChat = () => {
    return new Promise((resolve, reject) => {
        const condition = {
            isChatWithAdmin: true
        }

        Customer.find(condition).lean()
            .then(customers => resolve({ success: true, data: customers }))
            .catch(err => resolve({ success: false, error: err }));
    });
}

module.exports.addOrUpdate = (customer) => {
    return new Promise((resolve, reject) => {
        let query = {
            fbId: customer.fbId
        };
        let options = {
            upsert: true
        };
        Customer.findOneAndUpdate(query, customer, options)
            .then(cus => resolve(cus))
            .catch(err => reject(err));
    });
}

module.exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        Customer.findById(id)
            .then(customer => resolve(customer))
            .catch(err => reject(err));
    });
}

module.exports.getByFacebookId = (fbId) => {
    return new Promise((resolve, reject) => {
        Customer.findOne({ fbId: fbId })
            .then(customer => resolve(customer))
            .catch(err => reject(err));
    });
}


module.exports.getOrAddUserInfoBySession = (providerId, session) => {
    return new Promise((resolve, reject) => {
        let user_id = session.message.user.id;
        let user_name = session.message.user.name;
        let savedAddress = session.message.address;
        Customer.findOne({ fbId: user_id })
            .then(profil => {
                if (profil != null) {
                    if (profil.savedAddress.id == savedAddress.id) {
                        resolve(profil);
                    } else {
                        profil.savedAddress = savedAddress;
                        if (providerId != null && profil.providerId == null) {
                            profil.providerId = providerId;
                        }
                        profil.save().then(profil => resolve(profil)).catch(err => reject(err.track));
                    }
                    if (providerId != null && profil.providerId == null) {
                        profil.providerId = providerId;
                        profil.save().then(profil => resolve(profil)).catch(err => reject(err.track));
                    }
                }
                else {
                    setUserInfo(providerId, user_id, user_name, savedAddress).then(profil => {
                        resolve(profil)
                    })
                }
            })
            .catch(err => reject(err.track));
    });
}

function setUserInfo(providerId, user_id, user_name, savedAddress) {
    return new Promise((resolve, reject) => {
        fbService.getUserInfo(user_id).then(
            userInfo => {
                let customer = new Customer({
                    providerId: providerId,
                    fbId: user_id,
                    name: user_name,
                    gender: userInfo.gender,
                    savedAddress: savedAddress,
                });
                customer.save().then(profil => {
                    resolve(profil);
                }).catch(err =>
                    reject(err.track)
                );
            }
        ).catch(err => console.log(err));

    });
}

module.exports.getAll = () => {
    return new Promise((resolve, reject) => Customer.find()
        .then(customers => resolve(customers))
        .catch(err => reject(err)));
}