'use strict';
const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3001;
const DEBUG = env !== 'production';
const path = require('path');

let config = {
    env: env,
    port: port,
    app: {
        name: "blog",
        keys: ["keys"]
    },
    database: {
        mongo: {
            url: 'mongodb://127.0.0.1:27017/blog',
            poolSize: 5,
        },
        mysql: {
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '123456',
            database: 'blog',
            pool: true,
            connectionLimit: 10,
            waitForConnections: true
        },
    }
};
module.exports = config;
