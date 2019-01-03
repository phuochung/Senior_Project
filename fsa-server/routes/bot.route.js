const router = require('express').Router(),
    botController = require('../controllers/bot.controller'),
    authController = require('../controllers/auth.controller'),
    customerController = require('../controllers/customer.controller'),
    providerController = require('../controllers/provider.controller');

router.all('*', authController.authorizeBotAPI);

router.post('/book', botController.addOrUpdateBook);
router.post('/book/get', botController.getBooks);
router.get('/book/getById', botController.getBookById);

router.post('/ship', botController.addOrUpdateShip);
router.post('/ship/get', botController.getShips);
router.get('/ship/getById', botController.getShipById);

router.post('/menu/get', botController.getMenu);
router.get('/menu/getById', providerController.getItemOnMenuById);
router.post('/menu/save', providerController.addOrUpdateItemToMenu);
router.get('/menu/deleteById', providerController.deleteMenuById);
router.post('/menu/checkMenuName', botController.checkMenuName);

router.post('/promotion/get', botController.getPromotions);
router.get('/promotion/getById', botController.getPromotionById);
router.post('/promotion/save', botController.addOrUpdatePromotion);
router.delete('/promotion/delete', botController.deletePromotion);

router.post('/image/upload', providerController.uploadImage);

//intents
router.get('/answerFaq/getAll', providerController.getAnswerFaqs)
router.put('/answerFaq', providerController.updateAnswerFaq)

router.get('/customer-request-chat', customerController.getCustomerRequestingChat)

module.exports = router;