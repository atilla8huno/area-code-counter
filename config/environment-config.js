/**
 * Created by @atilla8huno on 10/2/17.
 */

/**
 * Third part and Node.js libs
 */

/**
 * Internal libs
 */
const environment = require('./environment');

/**
 * sets a default NODE_ENV environment variable to be used by the app.
 *
 * @type {string}
 */
process.env.NODE_ENV = Object.keys(environment).includes(process.env.NODE_ENV) ? process.env.NODE_ENV : 'dev';

module.exports = process.env.NODE_ENV;