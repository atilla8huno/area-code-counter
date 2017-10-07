/**
 * Created by @atilla8huno on 9/30/17.
 */

/**
 * Third part and Node.js libs
 */
const argv = require('yargs').argv;

/**
 * Internal libs
 */
const env = require('./config/environment-config');
const logger = require('./config/logging-config');
const constants = require('./util/constants').Constants;
const areaCodeService = require('./services/area-code/area-code.service').AreaCodeService.getInstance();

/**
 * Main class App. The entry class used by node.js to run the program properly.
 */
class App {

    /**
     * Constructor method
     */
    constructor() {}

    /**
     * Main method used to run the entire program
     */
    async main() {
        try {
            // gets the input file name by command line
            const input = argv._[constants.FIRST_ITEM];
            // checks if it was received
            this.checkInputParameter(input);

            logger.debug('In about to start reading the input file. Environment: %s', env);

            // calls AreaCodeService to read the input, validate it and create the output file
            await areaCodeService.countNumbersByAreaCode(input);
            logger.info('Output file generated successfully with the results...');
        } catch (e) {
            logger.error(e);
        }
    }

    /**
     * Method used to check if the input is defined.
     *
     * @param input - file name
     */
    checkInputParameter(input) {
        logger.info('Checking if the input file name was received...');

        if (!input) throw new Error('Input file name was not received. It is required.')
    }
}

// executes the program's main method
const app = new App();
app.main();

module.exports = { App };