const router = require('express').Router(),
    authController = require('../controllers/auth.controller'),
    providerController = require('../controllers/provider.controller');

router.get('/localization', providerController.getLocalizations);

router.post('*', authController.authorizeServiceProvider);
router.get('*', authController.authorizeServiceProvider);
router.get('/', providerController.index);

router.get('/logout', authController.logout);

router.get('/profile', providerController.getCurrentUser);

router.get('/menu', providerController.getMenu);
router.post('/menu', providerController.addOrUpdateItemToMenu);
router.get('/menu/getItem', providerController.getItemOnMenuById);
router.post('/menu/delete', providerController.deleteItemOnMenu);

router.post('/image/upload', providerController.uploadImage);

// PROMOTION
router.post('/promotions/getAllPromotion', providerController.getPromotions);
router.get('/promotions/getPromotionById', providerController.getPromotionById);
router.get('/promotions/deletePromotionById', providerController.deletePromotionById);

// BOOK
router.post('/books/getBooks', providerController.getBooks);
router.post('/books/updateBook', providerController.updateBookById);

// SHIP
router.post('/ships/getShips', providerController.getShips);
router.post('/ships/updateShip', providerController.updateShipById);
router.get('/ships/delete', providerController.deleteShip);

// NOTIFICATIONS
router.post('/notification', providerController.getNotifications);
router.get('/notification/read', providerController.markAsReadNotifications);

// DEVICE TOKENS
router.post('/deviceToken/add', providerController.addDeviceToken);

module.exports = router;