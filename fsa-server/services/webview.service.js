const Promotion = require('mongoose').model('Promotion');

module.exports.getPromotionByIdV2 = (providerId, id) => {
    return new Promise((resolve, reject) => {
        let query = {
            _id: id,
            provider: providerId,
            isDeleted: {
                '$ne': true
            }
        };
        Promotion.findOne(query)
            .populate('provider')
            .exec((err, promotion) => {
                var providerInfo = { name: promotion.provider.name, address: promotion.provider.address, currency: promotion.provider.currency };
                resolve({ success: true, providerInfo, promotion });
            })
            .catch(err => reject(err));
    });
}