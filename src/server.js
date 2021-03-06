const http = require("http")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mongoose = require("mongoose")

const logging = require("./config/logging") 
const config = require('./config/config')

/* Routes Import */
const testRoutes = require('./routes/index')
const userRoutes = require('./routes/users')
const authRoutes = require('./routes/auth')
const orderRoutes = require('./routes/orders')
const shopRoutes = require('./routes/shops')

const NAMESPACE = 'Server';
const app = express();

/* Connect to MongoDB */
mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then(() => logging.info(NAMESPACE, `DATABASE [Online] => Name: ${config.mongo.dbName}`))
    .catch((error) => logging.error(NAMESPACE, error.message, error));

/* Logging the request */

app.use((req, res, next) => {
    logging.info(NAMESPACE, `METHOD: [${req.method}] => URL: [${req.url}] => IP: [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        logging.info(NAMESPACE, `METHOD: [${req.method}] => URL: [${req.url}] => IP: [${req.socket.remoteAddress}] => STATUS: [${res.statusCode}]`);
    });

    next();
});

/* Parse the request */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Rules of our API */
app.use(cors());

/* Routes */
app.use('/', testRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/order', orderRoutes);
app.use('/shop', shopRoutes);

/* Error handling */
app.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

/* Create the server */
const httpServer = http.createServer(app);
httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `API [Online] => Running on: ${config.server.hostname}:${config.server.port}`));