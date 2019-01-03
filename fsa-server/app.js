const mongooseConfig = require('./configs/mongoose.config'),
    expressConfig = require('./configs/express.config'),
    appConfig = require('./statics/app.config'),
    chalk = require('chalk');

mongooseConfig.loadModels();

module.exports.init = () => {
    return new Promise((resolve, reject) => {
        mongooseConfig.connect().then((db) => {
            let app = expressConfig.init();
            resolve(app, db);
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports.start = () => {
    this.init().then((app, db) => {        
        app.listen(appConfig.env.port, () => {
            console.log(chalk.green('Server started on ' + appConfig.env.host + ':' + appConfig.env.port));
        });
    }).catch((err) => {
        console.log(chalk.red('Cannot start server. Err' + err));
    });
}