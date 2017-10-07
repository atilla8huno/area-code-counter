/**
 * Created by @atilla8huno on 9/30/17.
 */

/**
 * Third part and Node.js libs
 */
const winston = require('winston');

/**
 * Internal libs
 */

/**
 * Instance used by Winston to config its transports/log files
 */
const logger = new winston.Logger({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({
            name: 'info',
            level: 'info',
            filename: 'logs/area-codes.info.' + process.env.NODE_ENV + '.log'
        }),
        new (winston.transports.File)({
            name: 'debug',
            level: 'debug',
            filename: 'logs/area-codes.debug.' + process.env.NODE_ENV + '.log'
        }),
        new (winston.transports.File)({
            name: 'warn',
            level: 'warn',
            filename: 'logs/area-codes.warn.' + process.env.NODE_ENV + '.log'
        }),
        new (winston.transports.File)({
            name: 'error',
            level: 'error',
            filename: 'logs/area-codes.error.' + process.env.NODE_ENV + '.log'
        })
    ]
});

module.exports = logger;