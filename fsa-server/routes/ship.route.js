const router = require('express').Router(),
    authController = require('../controllers/auth.controller'),
    shipController = require('../controllers/ship.controller');

router.all('*', authController.authorizeShip);
router.get('', shipController.index);
router.get('/shippingInformation', shipController.shippingInformation);
router.get('/receipt', shipController.receipt);
router.get('/complete', shipController.complete);
router.ws('/complete', shipController.complete);

router.post('/updateShipItems', shipController.updateShipItems);
router.post('/updateShipInfo', shipController.updateShipInfo);

module.exports = router;