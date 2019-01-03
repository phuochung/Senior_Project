const router = require('express').Router(),
    authController = require('../controllers/auth.controller');

router.post('/login-provider', authController.loginProvider);
router.post('/register', authController.register);
router.get('/checkUsername', authController.checkUsername);
router.get('/verify', authController.verify)
router.get('/token/verify', authController.verifyToken);

module.exports = router;