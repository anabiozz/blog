import express from 'express';
import logger from 'morgan';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { blog, users, settings } from './controllers';
import config from './configs/config';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import db from 'mongoose';
import async from 'async';
//Custome middlewares
import ServerRenderingMiddleware from './middleware/serverSideRendering';
import setBundleHeaders from './middleware/setBundleHeaders';


var app = express();

const host = process.env.NODE_ENV == 'development'?config.server.develop:config.server.production;
const port = config.server.port;

let root = process.env.CORE_URL;
if(!root) {
    root = '/';
    process.env['CORE_URL'] = root;
}

var webpackConfig = null;
if (process.env.NODE_ENV == 'development') {
    webpackConfig = require('../webpack.dev');
} else {
    webpackConfig = require('../webpack.prod');
}
var compiler = webpack(webpackConfig);

app.use(function(req, res, next) {
    console.log('TRY ADD HEADERS FOR REQUEST ' + req.url);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

if (process.env.NODE_ENV == 'production') {
    app.use('*.js', setBundleHeaders); // USE GZIP COMPRESSION FOR PRODUCTION BUNDLE
    app.use(root+'dist', express.static(__dirname + '/../dist'));
} else {
    app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
    app.use(webpackHotMiddleware(compiler));
}

app.use(root+'css', express.static(__dirname + '/static/css'));
app.use(root+'images', express.static(__dirname + '/static/images'));
app.use(root+'favicon.ico', express.static(__dirname + '/static/images/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(parallel([
    ServerRenderingMiddleware,
    bodyParser.json()
]));

app.get(root+'blog', blog.getAllPosts);
app.get(root+'blog/new', blog.blog);
app.post(root+'blog/new', blog.newPost);
app.get(root+'blog/:id', blog.blog);
app.post(root+'blog/addComment', blog.blog);
app.get(root+'api/init-user', users.initUser);
app.get(root+'api/init-settings', settings.initSettings);

db.Promise = global.Promise;
db.connect('mongodb://' + config.database.host + '/' + config.database.db);

app.listen(port, host, function(error) {
    if (error) {
      console.error("APP ERROR:");
      console.error(error);
    } else {
        console.info("==> 🌎  Web APP listening on port %s. Open up http://%s:%s/ in your browser.", port, host, port);
    }
});

function parallel(middlewares) {
    return function(req, res, next) {
        async.each(middlewares, function(mw, cb) {
            mw(req, res, cb);
        }, next);
    };
}
