const currencyConfig = require('../configs/currency.config');

module.exports.USDtoVND = (value) => {
    var rs = Number((Math.round(Number(value) * currencyConfig.exchangeRate / 1000)).toFixed(2)) * 1000;
    return s ? rs : 0;
}

module.exports.VNDtoUSD = (value) => {
    var rs = Number((value / 1000 / (currencyConfig.exchangeRate / 1000)).toFixed(2));
    return rs ? rs : 0;
}
