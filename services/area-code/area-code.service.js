/**
 * Created by @atilla8huno on 9/30/17.
 */

/**
 * Third part and Node.js libs
 */
const _ = require('lodash');

/**
 * Internal libs
 */
const logger = require('../../config/logging-config');
const constants = require('../../util/constants').Constants;
const fileService = require('../file/file.service').FileService.getInstance();
const numberDto = require('../../dto/number.dto').NumberDto.getInstance();

/**
 * Class used by the app to deal with the area code use case/rules/logic.
 */
class AreaCodeService {

    /**
     * Constructor method
     */
    constructor() {}

    /**
     * Method used to count the input numbers by its area code.
     * It validates the input file (parameter).
     * It also generate an output file with the result content.
     *
     * @returns {Promise}
     */
    async countNumbersByAreaCode(input) {
        // checks if the parameter received by cmd line is valid using yargs (lib) and starts the reading process
        const data = await this.readAndValidateInputPath(input);
        logger.debug('Input parameter has been validated and converted...');

        // groups the numbers by area code/three digits numbers - async
        const groupedByAreaCode = await this.groupByAreaCode(data);
        logger.debug('The numbers have been grouped by area code/three digits numbers...');

        // creates the output file with the count content - async
        await fileService.writeOnFile(groupedByAreaCode);

        return 'Output file has been created with the expected results.';
    }

    /**
     * Method used to group and array by area code/three digits number.
     *
     * @param data
     * @returns {Promise}
     */
    async groupByAreaCode(data) {
        logger.debug('In about to group the array by area code/three digits number...');

        // the data array is required
        if (!data || !data instanceof Array || !data.length) {
            logger.warn('No data/array was received to group...');
            throw new Error('No data/array was received to group.');
        }

        // reads the area codes, then uses it to group the array
        let areaCodes = await fileService.readFile(constants.AREA_CODE_DATA_PATH);
        // orders the areaCodes alphabetically and reverse its order to be sure that the three digits area code
        // will be used first on the check of area code existence.
        // E.g.: Number: 321000000000 -> the first group (if valid area code) will be 321, then 32, then 1.
        areaCodes = areaCodes.sort().reverse();

        logger.debug('Turning numbers into objects with area code...');

        // transforms the simple number in object with area code and the number so it can be grouped later
        let numeros = data.map(numero => numberDto.build(areaCodes, numero));

        logger.debug('The numbers has been grouped. In about to start counting the numbers by area code...');

        // first removes the invalid numbers, then groups by area code
        return _.countBy(numeros.filter(num => num.valid), 'areaCode');
    }

    /**
     * Method used to validate if the input parameter is valid and, if it is, read and validate the contents.
     *
     * @param input - required relative file path received by command line
     * @returns {Promise}
     */
    async readAndValidateInputPath(input) {
        logger.debug('In about to validate the relative file path received by command line...');

        // if it was not received or is not a path, reject the promise
        if (!input || typeof input !== 'string') {
            throw new Error('No valid input file path received! ' +
                'Check if the relative file path was passed by command line to the program.');
        }

        logger.debug('Input file path %s received...', input);

        return await fileService
            // reads the input file content - async
            .readFile(input)
            // gets the numbers with valid initials chars - async
            .then(this.checkInitialChars)
            // gets the numbers without empty spaces in between - async
            .then(this.removeBlankSpaces)
            // gets the numbers without plus signal - async
            .then(this.removePlusSignal)
            // gets the numbers without double zero at the left - async
            .then(this.removeZerosAtLeft)
            // gets the valid numbers (only numbers) - async
            .then(this.checkOnlyNumbers)
            // gets the numbers with valid length - async
            .then(this.checkNumberOfChars)
            // returns the valid number list - async
            .then((data) => {
                return data;
            })
            // if there is any error, reject the promise with it
            .catch(e => {
                throw new Error(e);
            });
    }

    /**
     * Method used to check if the numbers start with valid chars and return the validated numbers.
     *
     * @param data - array with potential numbers
     * @returns {Promise}
     */
    async checkInitialChars(data) {
        logger.debug('In about to validate numbers with valid initial chars...');

        // the data array is required
        if (!data || !data instanceof Array) {
            logger.warn('No data/array was received to remove blank spaces...');
            throw new Error('No data/array was received to remove blank spaces.');
        }

        // gets the valid numbers
        let numerosValidos = data.filter(item => {
            // checks if it starts with + signal and numbers greater than 00 after that and no letters
            return item &&
                (typeof item === 'string' || typeof item === 'number') &&
                ((
                    // in case the number starts with +
                    item.toString().startsWith(constants.PLUS_SIGNAL) &&
                    // the next char should be a digit and not blank space or any other char/letter
                    /[0-9]/.test(item.toString().charAt(constants.SECOND_ITEM)) &&
                    // the next two digits should not be 00
                    item.toString().substring(constants.SECOND_ITEM, constants.THREE_DIGITS) !== '00'
                ) ||
                    // in case it should start with any number
                    /[0-9]/.test(item.toString().charAt(constants.FIRST_ITEM))
                );
        });

        logger.debug('These are the numbers with valid initials: %s', numerosValidos);

        // if there is any valid number, returns it, otherwise reject the promise
        if (numerosValidos.length) {
            return numerosValidos;
        } else {
            throw new Error('No number on the list starts with valid chars.');
        }
    }

    /**
     * Method used to remove any blank space in between the numbers.
     *
     * @param data - array with potential numbers
     * @returns {Promise}
     */
    async removeBlankSpaces(data) {
        logger.debug('In about to remove the blank spaces in between the numbers...');

        // the data array is required
        if (!data || !data instanceof Array) {
            logger.warn('No data/array was received to remove blank spaces...');
            throw new Error('No data/array was received to remove blank spaces.');
        }

        // gets the numbers without blank spaces
        let numerosValidos = data.map(item => {
            // first uses the blank spaces to split the number, then join it on an unique string
            return item ?
                item.toString()
                    // replace the whitespaces (tab character)
                    .replace(/\t/g, constants.EMPTY_STRING)
                    .split(constants.BLANK_SPACE)
                    .join(constants.EMPTY_STRING) :
                item;
        });

        logger.debug('These are the numbers without blank spaces in between: %s', numerosValidos);

        // if there is any valid number, returns it, otherwise reject the promise
        if (numerosValidos.length) {
            return numerosValidos;
        } else {
            throw new Error('No numbers without blank spaces.');
        }
    }

    /**
     * Method used to remove the plus signal at the beginning of the number.
     *
     * @param data - array with potential numbers
     * @returns {Promise}
     */
    async removePlusSignal(data) {
        logger.debug('In about to remove the plus signal of the number...');

        // the data array is required
        if (!data || !data instanceof Array) {
            logger.warn('No data/array was received to remove the plus signal...');
            throw new Error('No data/array was received to remove the plus signal.');
        }

        // gets the numbers without plus signal at the beginning
        let numerosValidos = data.map(item => {
            // if there is plus signal at the beginning of the number, removes it, otherwise returns the original
            return item && item.toString().startsWith(constants.PLUS_SIGNAL) ?
                item.replace(constants.PLUS_SIGNAL, constants.EMPTY_STRING) :
                item;
        });

        logger.debug('These are the numbers without starting with plus signal: %s', numerosValidos);

        // if there is any valid number, returns it, otherwise reject the promise
        if (numerosValidos.length) {
            return numerosValidos;
        } else {
            throw new Error('There is no number without plus signal.');
        }
    }

    /**
     * Method used to remove the first two zeros of the numbers, if it starts with 00.
     *
     * @param data - array with potential numbers
     * @returns {Promise}
     */
    async removeZerosAtLeft(data) {
        logger.debug('In about to remove the first two zeros of the numbers...');

        // the data array is required
        if (!data || !data instanceof Array) {
            logger.warn('No data/array was received to remove first two zeros...');
            throw new Error('No data/array was received to remove first two zeros.');
        }

        // gets the numbers without 00 at the beginning
        let numerosValidos = data.map(item => {
            // checks if the number starts with 00, then remove it, otherwise returns the original
            return item && item.toString().indexOf('00') === constants.FIRST_ITEM ?
                item.replace('00', constants.EMPTY_STRING) :
                item;
        });

        logger.debug('These are the numbers without 00 at the beginning: %s', numerosValidos);

        // if there is any valid number, returns it, otherwise reject the promise
        if (numerosValidos.length) {
            return numerosValidos;
        } else {
            throw new Error('There is no number without 00 at the beginning.');
        }
    }

    /**
     * Method used to check if the numbers have valid sizes and return the valid numbers.
     *
     * @param data - array with potential numbers
     * @returns {Promise}
     */
    async checkNumberOfChars(data) {
        logger.debug('In about to check if the numbers have valid sizes...');

        // the data array is required
        if (!data || !data instanceof Array) {
            logger.warn('No data/array was received to count the chars...');
            throw new Error('No data/array was received to count the chars.');
        }

        // gets the numbers with valid sizes
        let numerosValidos = data.filter(item => {
            return constants.NUMBERS_OF_VALID_CHARS.includes(item ? item.toString().length : item);
        });

        logger.debug('These are the numbers with valid sizes: %s', numerosValidos);

        // if there is any valid number, returns it, otherwise reject the promise
        if (numerosValidos.length) {
            return numerosValidos;
        } else {
            throw new Error('There is no number with valid size.');
        }
    }

    /**
     * Method used to check if the number is a valid number (only has digits [0-9]) and then returns the valid numbers.
     *
     * @param data - array with potential numbers
     * @returns {Promise}
     */
    async checkOnlyNumbers(data) {
        logger.debug('In about to check if there is only numbers on the text...');

        // the data array is required
        if (!data || !data instanceof Array) {
            logger.warn('No data/array was received to validate numbers...');
            throw new Error('No data/array was received to validate numbers.');
        }

        // gets the valid numbers
        let numerosValidos = data.filter(item => {
            // the regex checks if the string only contains numbers
            return /^\d+$/.test(item ? item.toString() : item);
        });

        logger.debug('These are the real valid numbers: %s', numerosValidos);

        // if there is any valid number, returns it, otherwise reject the promise
        if (numerosValidos.length) {
            return numerosValidos;
        } else {
            throw new Error('There is no valid number.');
        }
    }

    /**
     * Method used to get an instance of AreaCodeService class.
     *
     * @returns {AreaCodeService}
     */
    static getInstance() {
        // returns a new instance
        return new AreaCodeService();
    }
}

module.exports = { AreaCodeService };