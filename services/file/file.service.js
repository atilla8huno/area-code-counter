/**
 * Created by @atilla8huno on 9/30/17.
 */

/**
 * Third part and Node.js libs
 */
const fs = require('fs');
const _ = require('lodash');

/**
 * Internal libs
 */
const logger = require('../../config/logging-config');
const constants = require('../../util/constants').Constants;

/**
 * Class used by the app to deal with OS files.
 */
class FileService {

    /**
     * Constructor method
     */
    constructor() {}

    /**
     * Method used to check if there's properly permission on the dir or file.
     *
     * @param path - relative path of the dir or file
     * @param permission - the default permission is write permission
     * @returns {Promise}
     */
    validatePath(path, permission = fs.constants.W_OK) {
        // async operation
        return new Promise((resolve, reject) => {
            logger.debug('Checking the permission %s on: %s', permission, path);

            // the path is required
            if (!path || typeof path !== 'string') {
                logger.warn('Checking invalid path permissions...');
                return reject('Invalid path. It is not possible to check the permission of a null path.');
            }
            // gets the full OS path
            const fullpath = this.getFullPath(path);

            // gets the stats of the file, necessary to know the it is a valid path
            fs.stat(fullpath, (err, stats) => {
                // if there is any error, reject the promise with it
                if (err) return reject(err);

                logger.debug('File %s exists with stats %s', path, stats);

                // if valid path, checks its permission
                fs.access(fullpath, permission, (err) => {
                    if (err) return reject(`No access to: ${path}`);

                    resolve(path);
                })
            });
        });
    }

    /**
     * Method used to read a file. The default path is the area code database file.
     *
     * @param path - relative path of the file
     * @returns {Promise}
     */
    async readFile(path = constants.AREA_CODE_DATA_PATH) {
        // checks if there's read permission on the file
        await this.validatePath(path, fs.constants.R_OK);
        const stats = await this.checkIfPathExists(path);

        // read the file, if it is a file
        // checks if the path is about a file
        if (!stats.isFile()) throw new Error('Is only possible read files.');

        logger.debug('Reading the file: %s', path);
        // gets the full path of the file
        const fullpath = this.getFullPath(path);

        // gets the file content
        return fs.readFileSync(fullpath).toString().trim().split('\n');
    }

    /**
     * Method used to write the object key/value pairs on an a file inside the output dir.
     *
     * @param data - object (not array) to has its key/value pair written on the file
     * @returns {Promise}
     */
    writeOnFile(data) {
        // async operation
        return new Promise((resolve, reject) => {
            if (!data || data instanceof Array || typeof data !== 'object') {
                return reject('It only accepts objects to write its key/value on a file.');
            }

            logger.debug('In about to start writing the output file...');

            // gets the full OS path of the output file
            const path = this.getFullPath(constants.OUTPUT_PATH + constants.OUTPUT_FILE_NAME);

            // checks if there is write permission on the output fule
            this.validatePath(constants.OUTPUT_PATH).then(() => {
                // removes the existing output file
                this.removeOutputIfExists().then(() => {
                    logger.debug('In about to create the output file: %s', path);

                    // creates a write stream to write on the file line by line - async
                    let stream = fs.createWriteStream(path);
                    // once its opened, starts writing the content on the file
                    stream.once('open', () => {
                        let lines = [];
                        // loop over the object attributes/keys
                        _.forOwn(data, (value, key) => {
                            lines.push(`${key}:${value}`);
                        });

                        // sort the list alphabetically by area code
                        lines.sort((a, b) => {
                            return a.split(constants.OBJECT_SEPARATOR)[constants.FIRST_ITEM] >
                                b.split(constants.OBJECT_SEPARATOR)[constants.FIRST_ITEM]
                        });

                        // writes line by line on a file
                        lines.forEach(line => {
                            // writes the key, followed by : and its value with a break line at the end
                            stream.write(line + '\n');
                        });

                        // stop writing on the file
                        stream.end();

                        resolve('Output file %s has been created with the contents.', path);
                    });
                }).catch(e => reject(e));
            }).catch(e => reject(e));
        });
    }

    /**
     * Method used to remove the output file if it already exists.
     *
     * @returns {Promise}
     */
    removeOutputIfExists() {
        // async operation
        return new Promise((resolve, reject) => {
            // get the full path of the file
            const path = this.getFullPath(constants.OUTPUT_PATH + constants.OUTPUT_FILE_NAME);

            logger.debug('Checking if the file %s exists...', path);

            // does not use the 'checkIfPathExists' method b/c it throws error if the file does not exist
            fs.stat(path, (err, stats) => {
                // if the file does not exist, it is ok and is not possible to remove
                if (err && constants.FILE_OR_DIR_NO_EXISTS === err.code) {
                    return resolve('File %s does not exist, so it will not be removed. ');
                }

                logger.debug('The file %s exists. In about to remove it.', path);
                // trys to remove the file (unlink it)
                fs.unlink(path, (err) => {
                    // if there is any error, reject the promise
                    if (err) return reject(err);

                    logger.debug('The file was just deleted successfully.');
                    resolve('The file was just deleted successfully.');
                });
            });
        });
    }

    /**
     * Method used to check if a file or directory exists.
     *
     * @param path - relative path of the file/dir
     * @returns {Promise}
     */
    async checkIfPathExists(path) {
        // the path is required
        if (!path || typeof path !== 'string') {
            logger.warn('Checking invalid path existence...');
            throw new Error('Invalid path. It is not possible to check the dir/file exists.');
        }

        // gets the full OS path
        const fullpath = process.cwd() + (path.startsWith(constants.DIR_SEPARATOR) ? path :
                constants.DIR_SEPARATOR + path);

        const stats = fs.statSync(fullpath);
        logger.debug('Dir/File %s exists with stats %s.', path, stats);

        return stats;
    }

    /**
     * Method used to get the full path of a relative path - sync
     *
     * @param path
     */
    getFullPath(path) {
        return process.cwd() + (path.startsWith(constants.DIR_SEPARATOR) ? path : constants.DIR_SEPARATOR + path);
    }

    /**
     * Method used to get an instance of FileService class.
     *
     * @returns {FileService}
     */
    static getInstance() {
        // returns a new instance
        return new FileService();
    }
}

module.exports = { FileService };