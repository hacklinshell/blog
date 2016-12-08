'use strict';
// const uuid = require('node-uuid');
/**
 * Logger
 *
 * @param {object} winstonInstance
 */
function logger(winstonInstance) {
    return function* middleWare(next) {
        // this.requestId = uuid.v4();
        const start = new Date();
        yield next;
        const ms = new Date() - start;

        let logLevel;
        if (this.status >= 500) {
            logLevel = 'error';
        } else if (this.status >= 400) {
            logLevel = 'warn';
        } else if (this.status >= 100) {
            logLevel = 'info';
        }

        if (this.originalUrl == '/ping' || this.originalUrl == '/console/main/ping' || this.originalUrl == '/tenant/main/ping') {
            return;
        }

        let msg = `${this.method} ${this.originalUrl} ${this.status} ${ms}ms`

        winstonInstance.log(logLevel, msg);
    };
}


module.exports = logger;
