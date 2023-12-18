require('dotenv').config()

const POSTGRES_USER = process.env.USER
const POSTGRES_PASSWORD = process.env.PASSWORD
const POSTGRES_DBNAME = process.env.DATABASE
const POSTGRES_HOST = process.env.HOST

const POSTGRES = {
    host: POSTGRES_HOST,
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    dbName: POSTGRES_DBNAME
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const PORT = process.env.PORT || 3002;

const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 21600;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || 'jwt-issuer';
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || 'jwt-3ncrypt3d-p4ssw0rd';

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: PORT,
    token: {
        expireTime: SERVER_TOKEN_EXPIRETIME,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET
    }
};

const EMAIL_CONFIG = {
    user: process.env.EMAIL_USER || 'a9c799cf681af1',
    pass: process.env.EMAIL_PASS || 'bc8a20269d161e',
    host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
    port: process.env.EMAIL_PORT || '2525'
};

const config = {
    postgres: POSTGRES,
    server: SERVER
    //email: EMAIL_CONFIG
};

module.exports = config;