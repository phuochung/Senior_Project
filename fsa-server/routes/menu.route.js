const router = require('express').Router(),
    authController = require('../controllers/auth.controller'),
    menuController = require('../controllers/menu.controller');

router.all('*', authController.authorizeMenu);
router.get('', menuController.index);

module.exports = router;