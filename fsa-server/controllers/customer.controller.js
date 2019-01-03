const customerService = require('../services/customer.service');

module.exports.getCustomerRequestingChat = (req, res, next) => {
    customerService.getCustomersRequestingChat()
        .then(rs => res.json(rs))
        .catch(err => next(err));
}
