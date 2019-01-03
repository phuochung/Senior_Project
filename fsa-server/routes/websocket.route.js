const router = require('express').Router(),
    authController = require('../controllers/auth.controller'),
    websocketController = require('../controllers/websocket.controller');

router.post('*', authController.authorizeWebsocketSP);
router.get('*', authController.authorizeWebsocketSP);

router.ws('/ship', websocketController.notifyShip);
router.ws('/ship/:username', websocketController.notifyShip);

router.ws('/book', websocketController.notifyBook);
router.ws('/book/:username', websocketController.notifyBook);

//router.get('/testupdate', websocketController.testUpdate);
module.exports = router;