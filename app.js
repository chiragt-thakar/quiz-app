if (process.version !== 'v20.15.0') {
    console.log('Node version must be v20.15.0');
    process.exit(1);
};

const express = require('express');
const path = require('path');

const session = require('express-session');

const http = require('http');
const logger = require('morgan');

const mongoService = require('./services/database/mongo');

const { createdDirectoryIfNotExists } = require('./functions');

const config = require('./config');
const { passport, checkAuth, auth } = require('./helpers/auth');
const { errorHandler } = require('./helpers/middleware');



// normalize a port into a number, string, or false.
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (Number.isNaN(port) && port > 0) return val;
    if (port >= 0) return port;
    return false;
}

(async () => {

    await createdDirectoryIfNotExists('logs');
    await createdDirectoryIfNotExists('public');

    await mongoService.connect();

    const port = normalizePort(process.env.APP_PORT || 2001);

    // Initialize express app
    const app = express();



    app.set('port', port);

    // HTTP server listener 'error' event.
    function onError(error, port) {
        if (error.syscall !== 'listen') {
            throw error;
        }
        // eslint-disable-next-line no-undef
        const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    };

    const server = http.createServer(app);
    server.on('error', (error) => { onError(error, port) });


    app.use(session({
        name: 'sample',
        secret: config.session.secret,
        saveUninitialized: true,
        resave: true,
    }));

    //use connect flash 
    
    app.use(express.json({
        limit: '100mb'
    }));

    app.use(express.urlencoded({
        extended: false,
        limit: '100mb'
    }));



    app.use(express.static(path.join(__dirname, 'public')));

    app.get('/favicon.ico', (req, res) => {
        // TODO - send application fav icon
        res.end();
    });

    // attach passport middleware with express app
    auth(app);

    logger.token('ip', function (req, res) { return req.headers['x-forwarded-for'] })
    app.use(logger(':date[iso] | :ip | :method | :url | :status | :response-time ms'));


  

    // bind routes with app.
    app.use('/', require('./routes/index'));
    app.use('/user',require("./routes/user.route"))

    server.listen(port, async () => {
        console.info(`App started on port ${port}`);
      
    });
})();