import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { blog } from './controllers';
import db from 'mongoose';
import ServerSideRendering from './middleware/serverSideRendering';
import config from './configs/config';

var app = express();

const host = process.env.NODE_ENV == 'development'?config.server.develop:config.server.production;
const port = config.server.port;

let root = process.env.CORE_URL;
if(!root) {
    root = '/';
    process.env['CORE_URL'] = root;
}


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(ServerSideRendering);

app.use('/css', express.static(__dirname + '/static/css'));
app.get('/blog', blog.getAllPosts);
app.get('/blog/new', blog.blog);
app.post('/blog/new', blog.newPost);
app.get('/blog/:id', blog.blog);
app.post('/blog/addComment', blog.blog);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

db.Promise = global.Promise;
db.connect('mongodb://' + config.database.host + '/' + config.database.db);

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

app.listen(port, host, function(error) {
    if (error) {
      console.error("APP ERROR:")
      console.error(error)
    } else {
        console.info("==> 🌎  Web APP listening on port %s. Open up http://%s:%s/ in your browser.", port, host, port)
    }
})
