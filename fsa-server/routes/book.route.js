const router = require('express').Router(),
authController = require('../controllers/auth.controller'),
bookController = require('../controllers/book.controller');

router.all('*', authController.authorizeBook);
router.get('/', bookController.index);
router.post('/submit', bookController.submitBook);

module.exports = router;