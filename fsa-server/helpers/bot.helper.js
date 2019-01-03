const builder = require('botbuilder'),
    appConfig = require('../statics/app.config'),
    spController = require('../controllers/spbot.controller');

var customersBots = appConfig.spBot;
let bots = [];
let routeBotDatas = [];
// expose a designated Messaging Endpoint for each of the customers
customersBots.forEach(cust => {
    let connector = new builder.ChatConnector({
        appId: cust.appId,
        appPassword: cust.appPassword
    });
    var azure = require('botbuilder-azure');

    var docDbClient = new azure.DocumentDbClient(appConfig.botstatedb);
    var tableStorage = new azure.AzureBotStorage({
        gzipData: true
    }, docDbClient);

    var bot = new builder.UniversalBot(connector).set('storage', tableStorage);
    let tmpBot = {
        "botName": cust.botName,
        "bot": bot
    };
    bots.push(tmpBot);
    // spController.bindDialogsToBot(bot, cust.botName);
    routeBotDatas.push({
        bot: bot,
        botName: cust.botName,
        connector: connector
    })
});

module.exports.getRouteBotData = () => {
    return routeBotDatas;
}
module.exports.getAllBots = () => {
    return bots;
}
module.exports.getBotBybotName = (botName) => {
    for (var i = 0; i < bots.length; i++) {
        if (bots[i].botName == botName) {
            return bots[i].bot;
        }
    }
    return null;
}