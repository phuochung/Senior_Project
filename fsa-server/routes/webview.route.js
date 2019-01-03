const router = require('express').Router(),
    webviewController = require('../controllers/webview.controller');

// router.get('', giftController.index);
router.get('/promotion-detail', webviewController.getPromotionById);

module.exports = router;