const express = require('express'),
    compression = require('compression'),
    expressWs = require('express-ws')(express()),
    expressLayouts = require('express-ejs-layouts'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    busboy = require('connect-busboy'),
    cors = require('cors'),
    appConfig = require('../statics/app.config');
const oneWeek = 604800000;

module.exports.initViewEngine = (app) => {
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');
    app.use(expressLayouts);
}

module.exports.initStatic = (app) => {
    app.use(logger('dev'));
    // app.use(bodyParser.json());
    app.use(bodyParser.json({ limit: 5120000, type: 'application/json' }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(busboy());
    app.use("/public", express.static(path.join(__dirname, '../public'), {
        etag: false,
        maxAge: oneWeek
    }));
}

module.exports.initRoutes = (app) => {
    // app.use(cors({origin: 'http://localhost:3000'}));
    app.use(cors({ origin: true, credentials: true }));
    appConfig.routes.forEach((route) => {
        app.use(route.path, require(path.resolve(route.router)));
    })
}

module.exports.initHandleException = (app) => {
    app.use(function (err, req, res, next) {
        console.error(err);
        if (err.type != undefined && err.type == 'json') {
            res.status(err.status || 500).send(err);
        } else {
            console.log(err.message); // For debugging in future.
            res.locals.message = err.message;
            res.status(err.status || 500);
            res.render('error', {
                layout: 'layout-error'
            });
        }
    });
}

module.exports.init = () => {
    return new Promise((resolve, reject) => {
        let app = expressWs.app;
        app.use(compression());
        require('../services/provider.service').loadBotConfigs().then(config => {
            this.initViewEngine(app);
            this.initStatic(app);
            this.initRoutes(app);
            this.initHandleException(app);

            require('../services/localization.service').loadFields();

            require('../services/currency.service').initDb()
                .then(rs => { });

            require('../services/currency.service').loadCurrencies((() => {
                require('../services/manager.service').modifyCurrencyProvider();
            }));

            resolve(app);
        }).catch(err => reject(err));
    });
}

module.exports.expressWs = expressWs;

