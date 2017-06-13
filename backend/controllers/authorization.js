import config from '../configs/config';
import jwt from 'jsonwebtoken';
import LocalStrategy from 'passport-local';
import User from '../models/User';

const auth = (function () {
    let instance;
    function createInstance() {
        let obj = {
            passport: null,
            strategies: [],
            refresh: null,
            logoutURLs: [],
            serviceToken: null
        };
        return obj;
    }
    return {
        getInstance: function() {
            if(!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

const createLocalStrategy = () => {
    var strategy = new LocalStrategy(
        {
            usernameField: 'name',
            passwordField: 'password'
        },
        function(username, password, done) {
            console.log('password', password);
            User.findOne({ name: username, provider: 'local' }, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                if (!user.validPassword(password)) { return done(null, false); }
                let expires_in = 7*24*60*60*1000; // One week
                return done(null, { token: null, uuid: user.name, expires_in: expires_in });
            });
        }
    );
    return strategy;
};

const selectStrategy = (req, res, next) => {
    let authInstance = auth.getInstance();
    if(typeof authInstance.strategies[req.params.id] == 'undefined' && req.params.id != 'local') {
        console.error('ERROR: authentication strategy not found for '+req.params.id+' provider!');
        next();
    } else {
        let md = authInstance.passport.authenticate(req.params.id);
        md(req, res, next);
    }
}

const checkTokenMiddleware = (req, res, next) => {
    req.user = null;
    let refreshing = false;
    if(req.cookies['accessToken']) {
        req.user = validateAccessToken(req.cookies['accessToken']);
        if(req.user) {
            if(req.user.provider != 'local') {
                let timestamp = +new Date();
                if(req.user.expires_in < timestamp) {
                    console.log('[checkTokenMiddleware] '+req.user.uuid+' - token has expired');
                    if(req.session.refresh_token) {
                        refreshing = true;
                        console.log('[checkTokenMiddleware] '+req.user.uuid+' - Try to refresh token');
                        let authInstance = auth.getInstance();
                        authInstance.refresh.requestNewAccessToken(req.user.provider, req.session.refresh_token, function(err, accessToken, refreshToken, params) {
                            if (refreshToken && req.session.refresh_token != refreshToken) {
                                console.log('[checkTokenMiddleware] '+req.user.uuid+' - Received new refreshToken (truncated)', refreshToken.substr(0, 25));
                                req.session.refresh_token = refreshToken;
                            }
                            if(!err && accessToken) {
                                console.log('[checkTokenMiddleware] '+req.user.uuid+' - Token refreshing is done');
                                req.user.token = accessToken;
                                req.user.expires_in = +new Date() + params.expires_in*1000;
                                let token = getSignedToken(req.user);
                                res.cookie('accessToken', token, { httpOnly: true });
                            } else {
                                console.error('[checkTokenMiddleware] '+req.user.uuid+' - Refreshing token failed: ', err);
                                res.clearCookie('accessToken');
                                req.session.refresh_token = null;
                                req.user = null;
                            }
                            next();
                        });
                    } else {
                        res.clearCookie('accessToken');
                        req.user = null;
                        next();
                    }
                }
            }
        } else {
            res.clearCookie('accessToken');
            req.session.refresh_token = null;
        }
    }
    if(!refreshing) next();
};

const createAccessToken = (req, res) => {
    let token = getSignedToken({ uuid: req.user.uuid, token: req.user.token, provider: req.params.id, expires_in: +new Date() + req.user.expires_in*1000 });
    req.session.refresh_token = req.user.refresh_token;
    res.cookie('accessToken', token, { httpOnly: true });
    let url = req.session.redirectURL ? req.session.redirectURL : process.env.CORE_URL+'dashboard';
    req.session.redirectURL = null;
    if(req.params.id == 'local') {
        res.send({ success: true, name: req.user.uuid, redirectURL: url });
    } else {
        res.redirect(url);
    }
}

const validateAccessToken = (accessToken) => {
    var payload = null;
    try {
        payload = jwt.verify(accessToken, config.privateKey);
    }
    catch(e) {
        console.warn('Dropping unverified accessToken', e);
    }
    return payload;
}

const getRootToken = () => {
    return getSignedToken({
        provider: null,
        token: fakeToken(20),
        uuid: 'root'
    });
};

function fakeToken(length) {
    var token = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for( let i=0; i < length; i++ )
        token += possible.charAt(Math.floor(Math.random() * possible.length));
    return token;
}

const getSignedToken = (data) => {
    return jwt.sign(data, config.privateKey);
};

export default {
    auth,
    createAccessToken,
    checkTokenMiddleware,
    getRootToken,
    createLocalStrategy,
    selectStrategy
};