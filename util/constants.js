/**
 * Created by @atilla8huno on 9/30/17.
 */

/**
 * Third part and Node.js libs
 */

/**
 * Internal libs
 */
const environment = require('../config/environment-config');

/**
 * Constants to be exported
 */
const FIRST_ITEM = 0;
const INVALID_INDEX = -1;
const SECOND_ITEM = 1;
const THIRD_ITEM = 3;
const FOURTH_ITEM = 4;
const ONE_DIGIT = 1;
const TWO_DIGITS = 2;
const THREE_DIGITS = 3;
const NUMBERS_OF_VALID_CHARS = [3, 7, 8, 9, 10, 11, 12];
const OBJECT_SEPARATOR = ':';
const PLUS_SIGNAL = '+';
const EMPTY_STRING = '';
const BLANK_SPACE = ' ';
const AREA_CODE_DATA_PATH = require('../config/environment')[environment].areaCodeFilePath;;
const OUTPUT_PATH = require('../config/environment')[environment].outputDirPath;
const OUTPUT_FILE_NAME = require('../config/environment')[environment].outputFileName;
const FILE_OR_DIR_NO_EXISTS = 'ENOENT';
const DIR_SEPARATOR = '/';

/**
 * Class used by the app to access common static constants.
 */
class Constants {

    /**
     * @returns {number}
     */
    static get FIRST_ITEM() {
        return FIRST_ITEM;
    }

    /**
     * @returns {number}
     */
    static get SECOND_ITEM() {
        return SECOND_ITEM;
    }

    /**
     * @returns {number}
     */
    static get THIRD_ITEM() {
        return THIRD_ITEM;
    }

    /**
     * @returns {number}
     */
    static get FOURTH_ITEM() {
        return FOURTH_ITEM;
    }

    /**
     * @returns {number}
     */
    static get ONE_DIGIT() {
        return ONE_DIGIT;
    }

    /**
     * @returns {number}
     */
    static get TWO_DIGITS() {
        return TWO_DIGITS;
    }

    /**
     * @returns {number}
     */
    static get THREE_DIGITS() {
        return THREE_DIGITS;
    }

    /**
     * @returns {number}
     */
    static get INVALID_INDEX() {
        return INVALID_INDEX;
    }

    /**
     * @returns {[number,number,number,number,number,number,number]}
     */
    static get NUMBERS_OF_VALID_CHARS() {
        return NUMBERS_OF_VALID_CHARS;
    }

    /**
     * @returns {string}
     */
    static get PLUS_SIGNAL() {
        return PLUS_SIGNAL;
    }

    /**
     * @returns {string}
     */
    static get EMPTY_STRING() {
        return EMPTY_STRING;
    }

    /**
     * @returns {string}
     */
    static get BLANK_SPACE() {
        return BLANK_SPACE;
    }

    /**
     * @returns {string}
     */
    static get AREA_CODE_DATA_PATH() {
        return AREA_CODE_DATA_PATH;
    }

    /**
     * @returns {string}
     */
    static get OUTPUT_PATH() {
        return OUTPUT_PATH;
    }

    /**
     * @returns {string}
     */
    static get OUTPUT_FILE_NAME() {
        return OUTPUT_FILE_NAME;
    }

    /**
     * @returns {string}
     */
    static get FILE_OR_DIR_NO_EXISTS() {
        return FILE_OR_DIR_NO_EXISTS;
    }

    /**
     * @returns {string}
     */
    static get OBJECT_SEPARATOR() {
        return OBJECT_SEPARATOR;
    }

    /**
     * @returns {string}
     */
    static get DIR_SEPARATOR() {
        return DIR_SEPARATOR;
    }
}

module.exports = { Constants };