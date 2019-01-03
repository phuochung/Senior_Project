const mongoose = require('mongoose'),
    Provider = mongoose.model('Provider'),
    constants = require('../common/constants'),
    CurrencyCode = constants.CurrencyCode,
    currencyService = require('../services/currency.service');

module.exports.modifyCurrencyProvider = () => {
    return new Promise((resolve, reject) => {
        var currencies = currencyService.getAll();
        Provider.find()
            .then(providers => {
                var promises = [];
                providers.forEach(provider => {
                    if (!provider.currency) {
                        provider.currency = currencies.find(c => c.code == CurrencyCode.VND)._id;
                        promises.push(provider.save());
                    }
                })
                if (promises.length > 0)
                    Promise.all(promises)
                        .then(() => { })
            })
    })
}