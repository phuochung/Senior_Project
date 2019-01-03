const mongoose = require('mongoose'),
    Currency = mongoose.model('Currency'),
    constants = require('../common/constants'),
    MessageConstants = constants.MessageConstants,
    CurrencyCode = constants.CurrencyCode;

let currencies;

module.exports.initDb = () => {
    return new Promise((resolve, reject) => {
        var query = { isActive: true, isDeleted: false };
        Currency.count(query, (err, cnt) => {
            if (cnt == 0) {
                var currencies = [{
                    code: CurrencyCode.VND,
                    description: 'Vietnam dong',
                    rate: 1,
                },
                {
                    code: CurrencyCode.USD,
                    description: 'Dollar',
                    rate: 22.5,
                }];
                Currency.insertMany(currencies)
                    .then(() => resolve({ success: true }));
            } else {
                resolve({ success: true })
            }
        })
    })
}


module.exports.getPriceByCurrencyCode = (price, currencyCode) => {
    var item = price.find(p => p.currency && p.currency.code == currencyCode);
    if (item) return item.value;
    return 0;
}

module.exports.getPriceByCurrencyId = (price, currencyId) => {
    if (currencyId) {
        var item = price.find(p => p.currency == currencyId);
        if (item) return item.value;
    }
    return 0;
}

module.exports.loadCurrencies = (callback) => {
    if (currencies) {
        if (callback) callback;
        return;
    };
    Currency.find().then(data => {
        currencies = data;
        if (callback) callback();
    });
}

module.exports.getAll = () => {
    return currencies;
}

module.exports.calculateMultiplicationPriceWithANumber = (price, num) => {
    var result = [];
    price.forEach(item => {
        var newValue = item.value * num;
        result.push({
            currency: item.currency,
            value: newValue
        })
    })

    return result;
}

module.exports.calculateSum2Prices = (price1, price2) => {
    var result = [];
    var currencies = this.getAll();
    currencies.forEach(currency => {
        var value1 = 0, value2 = 0;
        var item1 = price1.find(x => x.currency.equals(currency._id));
        var item2 = price2.find(x => x.currency.equals(currency._id));
        if (item1 && item2) {
            value1 = item1.value;
            value2 = item2.value;
        }
        result.push({
            currency: currency._id,
            value: value1 + value2
        })

    });

    return result;
}