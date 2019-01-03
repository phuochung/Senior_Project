const mongoose = require('mongoose'),
    path = require('path'),
    appConfig = require('../statics/app.config'),
    dbcConfig = require('./db.config'),
    pathHelper = require('../helpers/path.helper');

module.exports.loadModels = () => {
    let modelPaths = pathHelper.getGlobbedPaths(appConfig.file.models);
    modelPaths.forEach((modelPath) => require(path.resolve(modelPath)));
};

module.exports.connect = () => {
    mongoose.Promise = global.Promise;
    return new Promise((resolve, reject) => {
        let db = mongoose.connect(dbcConfig.uri, dbcConfig.options).then(() => {
            resolve(db);
        }).catch((err) => {
            reject(err);
        });
    });
};