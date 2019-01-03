const router = require('express').Router(),
    spController = require('../controllers/spbot.controller'),
    botHelper = require('../helpers/bot.helper');

let routeBotDatas = botHelper.getRouteBotData();

routeBotDatas.forEach(item => {
    spController.bindDialogsToBot(item.bot, item.botName);
    router.post(`/${item.botName}`, item.connector.listen());
});
module.exports = router;

