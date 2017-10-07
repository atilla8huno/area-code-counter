/**
 * Created by @atilla8huno on 10/7/17.
 */

/**
 * Third part and Node.js libs
 */

/**
 * Internal libs
 */
const constants = require('../util/constants').Constants;

/**
 * Class used by the app to deal with the area code use case/rules/logic.
 */
class NumberDto {
    /**
     * Constructor of the class.
     *
     * @param areaCode
     * @param number
     * @param valid
     */
    constructor(areaCode, number, valid = false) {
        this.areaCode = areaCode;
        this.number = number;
        this.valid = valid;
    }

    /**
     * Method used to build a new instance of NumberDto based on the areaCodes and number
     *
     * @param areaCodes
     * @param numero
     * @returns {NumberDto}
     */
    build(areaCodes, numero) {
        // checks if the number is a three digits number before checking the area code
        if (constants.THREE_DIGITS === numero.length) {
            return new NumberDto(numero, constants.EMPTY_STRING, true);
        }
        // checks if the first three digits are a valid area code, then splits it
        else if (areaCodes.includes(numero.substring(constants.FIRST_ITEM, constants.THREE_DIGITS))) {
            return new NumberDto(
                numero.substring(constants.FIRST_ITEM, constants.THREE_DIGITS),
                numero.substring(constants.FOURTH_ITEM, numero.length),
                true
            );
        }
        // checks if the first two digits are a valid area code, then splits it
        else if (areaCodes.includes(numero.substring(constants.FIRST_ITEM, constants.TWO_DIGITS))) {
            return new NumberDto(
                numero.substring(constants.FIRST_ITEM, constants.TWO_DIGITS),
                numero.substring(constants.THIRD_ITEM, numero.length),
                true
            );
        }
        // checks if the first digit is a valid area code, then splits it
        else if (areaCodes.includes(numero.substring(constants.FIRST_ITEM, constants.ONE_DIGIT))) {
            return new NumberDto(
                numero.substring(constants.FIRST_ITEM, constants.ONE_DIGIT),
                numero.substring(constants.SECOND_ITEM, numero.length),
                true
            );
        }
        // otherwise, it is a invalid number and will be a no area code object - needed to be removed later
        else {
            return new NumberDto(null, numero, false);
        }
    }

    /**
     * Method used to get an instance of NumberDto class.
     *
     * @returns {NumberDto}
     */
    static getInstance() {
        // returns a new instance
        return new NumberDto();
    }
}

module.exports = { NumberDto };