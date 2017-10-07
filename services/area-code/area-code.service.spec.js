/**
 * Created by @atilla8huno on 9/30/17.
 */

/**
 * Third part and Node.js libs
 */
const fs = require('fs');
const expect = require('expect');
const _ = require('lodash');

/**
 * Internal libs
 */
const constants = require('../../util/constants').Constants;
const areaCodeService = require('./area-code.service').AreaCodeService.getInstance();

/**
 * Suite of tests
 */
describe('== Test suite of the service: AreaCodeService ==', () => {

    /**
     * Reusable test that calls a method by name to check invalid arrays.
     *
     * @param methodName - the name of the method to be called on the service
     */
    const checkInvalidArray = (methodName) => {

        it(`should validate the array of invalid paths on ${methodName}`, (done) => {
            const invalidArray = [[], null, 'not an array'];

            invalidArray.forEach(array => {
                areaCodeService
                    [methodName](array) // calls the method by its name passing the array as argument
                    .then(() => done(new Error('Should not be done without any error.')))
                    .catch(e => {
                        // ok, should have errors
                    });
            });
            // if has not done with error, resume - async
            setTimeout(() => done(), 0);
        });
    };

    describe('== Test suite of the method: checkOnlyNumbers ==', () => {

        it('should have a list of texts with, and only with, numbers', (done) => {
            // only two valid numbers
            const texts = ['fdas2341', '21344', 1234, null, true, '', '123+_)(*&^%$#@123', 'asfd', [1,2,3]];

            areaCodeService
                .checkOnlyNumbers(texts)
                .then((validNumbers) => {
                    // valid numbers should be 2
                    expect(validNumbers.length).toBe(2);

                    validNumbers.forEach((num) => {
                        // the valid numbers should be included on the list
                        expect(texts.includes(num)).toBeTruthy();
                    });

                    done(); // ends successfully
                })
                .catch(e => done(e)); // if there is any error, fails the test
        });

        checkInvalidArray('checkOnlyNumbers');
    });

    describe('== Test suite of the method: checkNumberOfChars ==', () => {

        it('should have a list of texts with, and only with, valid sizes', (done) => {
            // 7 valid numbers
            const textos = ['1', '12', '123', '1234', '12345', '123456', '1234567', '12345678', '123456789',
                '1234567890', '12345678901', '123456789012', '1234567890123', '12345678901234', null, true, [1,2,3]];

            areaCodeService
                .checkNumberOfChars(textos)
                .then((validNumbers) => {
                    // valid numbers should be 7
                    expect(validNumbers.length).toBe(7);

                    validNumbers.forEach((num) => {
                        // the valid numbers should be included on the list
                        expect(constants.NUMBERS_OF_VALID_CHARS.includes(num.length)).toBeTruthy();
                    });

                    done(); // ends successfully
                })
                .catch(e => done(e)); // if there is any error, fails the test
        });

        checkInvalidArray('checkNumberOfChars');
    });

    describe('== Test suite of the method: removeZerosAtLeft ==', () => {

        it('should have a list of text without the first double zero at the beginning', (done) => {
            // random items
            const texts = ['00111111', '01111', '11111', '10011111', '002222', '03333', null, true, [1,2,3]];
            // valid numbers without starting with double zero
            const numbersNotStartingWithDoubleZero =
                ['111111', '01111', '11111', '10011111', '2222', '03333'];

            areaCodeService
                .removeZerosAtLeft(texts)
                .then((validNumbers) => {
                    validNumbers.forEach((num) => {
                        // does not check objects, booleans or arrays
                        if (num && typeof num === 'string' || typeof num === 'number') {
                            // the valid numbers should be included on the list
                            expect(numbersNotStartingWithDoubleZero.includes(num)).toBeTruthy();
                        }
                    });

                    done(); // ends successfully
                })
                .catch(e => done(e)); // if there is any error, fails the test
        });

        checkInvalidArray('removeZerosAtLeft');
    });

    describe('== Test suite of the method: removePlusSignal ==', () => {

        it('should have a list of texts without plus signal at the beginning', (done) => {
            // random items
            const texts = ['+00111111', +1231, -123123, '-10011111', 'asdf', '+#$%^&*', null, true, [1,2,3]];
            // valid numbers without starting with +
            const textsNotStartingWithPlusSignal =
                ['00111111', 1231, -123123, '-10011111', 'asdf', '#$%^&*'];

            areaCodeService
                .removePlusSignal(texts)
                .then((validNumbers) => {
                    validNumbers.forEach((num) => {
                        // does not check objects, booleans or arrays
                        if (num && typeof num === 'string' || typeof num === 'number') {
                            // the valid numbers should be included on the list
                            expect(textsNotStartingWithPlusSignal.includes(num)).toBeTruthy();
                        }
                    });

                    done(); // ends successfully
                })
                .catch(e => done(e)); // if there is any error, fails the test
        });

        checkInvalidArray('removePlusSignal');
    });

    describe('== Test suite of the method: removeBlankSpaces ==', () => {

        it('should have a list of text without blank spaces in between it', (done) => {
            // random items
            const texts = ['1 2 3', '12 34', ' 12 ', 123, null, true, [1,2,3]];
            // valid numbers without starting with +
            const objectsWithoutBlankSpaces = ['123', '1234', '12', 123, 'true', '1,2,3'];

            areaCodeService
                .removeBlankSpaces(texts)
                .then((validNumbers) => {
                    validNumbers.forEach((num) => {
                        // does not check null objects and check the toString of other objects those are not string/num
                        // the valid numbers should be included on the list
                        expect(num ? objectsWithoutBlankSpaces.includes(num) : true).toBeTruthy();
                    });

                    done(); // ends successfully
                })
                .catch(e => done(e)); // if there is any error, fails the test
        });

        checkInvalidArray('removeBlankSpaces');
    });

    describe('== Test suite of the method: checkInitialChars ==', () => {

        it('should have a list of text with valid initials', (done) => {
            // random items
            const objects = ['1 2 3', '+12 34', '+ 12 ', '+0', '+001', '+1133', '+$%^&*(', '+asfd123', +23,
                null, true, [1,2]];
            // valid numbers without starting with +
            const objectsWithoutBlankSpaces = ['1 2 3', '+12 34', '+0', '+1133', 23];

            areaCodeService
                .checkInitialChars(objects)
                .then((validNumbers) => {
                    objectsWithoutBlankSpaces.forEach((num) => {
                        // does not check null objects and check the toString of other objects those are not string/num
                        // the valid numbers should be included on the list
                        expect(num ? validNumbers.includes(num) : true).toBeTruthy();
                    });

                    expect(validNumbers.length).toEqual(objectsWithoutBlankSpaces.length);

                    done(); // ends successfully
                })
                .catch(e => done(e)); // if there is any error, fails the test
        });

        checkInvalidArray('checkInitialChars');
    });

    describe('== Test suite of the method: readAndValidateInputPath ==', () => {

        it('should check the invalid paths/inputs', (done) => {
            // some of invalid inputs
            const invalidInputs = [true, 123, null, ['its an array'], { not: 'array' }];

            invalidInputs.forEach(item => {
                areaCodeService.readAndValidateInputPath(item)
                    .then(() => done(new Error('Should not be done without any error.')))
                    .catch(e => {
                        // ok, should have errors
                    });
            });

            setTimeout(() => done(), 0); // ends successfully - async
        });

        it('should check that file does not exist', (done) => {
            // some of invalid inputs
            const invalidPath = '/whatever/does_not_exist.txt';

            areaCodeService.readAndValidateInputPath(invalidPath)
                .then(() => done(new Error('Should not be done without any error.')))
                .catch(e => done()); // ok, should have errors bc the file does not exist
        });

        it('should read the input file and get a list of valid numbers', (done) => {
            const file = '/data/input/numbers.test.txt';

            const expectedValidNumbers = [
                '351960000000',
                '351961111111',
                '351210000000',
                '244910000000',
                '55323566664',
                '112',
                '911',
                '991',
                '112',
                '351960000000',
                '351960000000',
                '100123423423',
                '351',
                '35174329478'
            ];

            // pass the file with numbers to read and validate
            areaCodeService.readAndValidateInputPath(file)
                .then((validNumbers) => {
                    // check if the array has the expected length
                    expect(validNumbers.length).toEqual(expectedValidNumbers.length);

                    // check if all the expected numbers is on the generated numbers after all
                    expectedValidNumbers.forEach(number => {
                        expect(validNumbers.includes(number)).toBeTruthy();
                    });

                    done(); // ends successfully
                })
                .catch(e => done(e)); // if there is any error, fails the test
        });
    });

    describe('== Test suite of the method: groupByAreaCode ==', () => {

        it('should group numbers by area code successfully', (done) => {
            const validNumbers = [
                '351960000000',
                '351961111111',
                '351210000000',
                '244910000000',
                '55323566664',
                '112',
                '911',
                '991',
                '112',
                '351960000000',
                '351960000000',
                '100123423423',
                '351',
                '35174329478'
            ];

            const expectedGroupedObject = {
                '1': 1,
                '112': 2,
                '244': 1,
                '351': 7,
                '55': 1,
                '911': 1,
                '991': 1
            };

            areaCodeService
                .groupByAreaCode(validNumbers)
                .then(groupedObject => {
                    // check if the returned object has equal properties and values as expected
                    _.forOwn(groupedObject, (value, key) => {
                        // should have the key and the value should be the same
                        expect(expectedGroupedObject[key] === value).toBeTruthy();
                    });

                    done(); // ends successfully
                })
                .catch(e => done(e)); // if there is any error, fails the test
        });

        it('should group only valid numbers by area code', (done) => {
            // contains valid and not valid numbers
            const mixOfTexts = [
                'a351960000000',
                '00351961111111',
                '+351210000000',
                '244910000000',
                '55323566664',
                '112',
                '911',
                '991',
                '112',
                '3 51960000000',
                '$351960000000',
                '100123423423',
                '351',
                '35174329478'
            ];

            const expectedGroupedObject = {
                '1': 1,
                '112': 2,
                '244': 1,
                '351': 2,
                '55': 1,
                '911': 1,
                '991': 1
            };

            areaCodeService
                .groupByAreaCode(mixOfTexts)
                .then(groupedObject => {
                    // check if the returned object has equal properties and values as expected
                    _.forOwn(groupedObject, (value, key) => {
                        // should have the key and the value should be the same
                        expect(expectedGroupedObject[key] === value).toBeTruthy();
                    });

                    done(); // ends successfully
                })
                .catch(e => done(e)); // if there is any error, fails the test
        });

        checkInvalidArray('groupByAreaCode');
    });

    describe('== Test suite of the method: countNumbersByAreaCode ==', () => {

        it('should read the file, validate the path and generate an output file with the results', (done) => {
            const input = '/data/input/numbers.test.txt';

            const expectedGroupedObject = {
                '1': 1,
                '112': 2,
                '244': 1,
                '351': 7,
                '55': 1,
                '911': 1,
                '991': 1
            };

            areaCodeService
                .countNumbersByAreaCode(input)
                .then(msg => {
                    // check the result message
                    expect(msg && msg.indexOf('file has been created') > constants.INVALID_INDEX).toBeTruthy();

                    try {
                        // get the full path of the file
                        const realPath = process.cwd() + constants.OUTPUT_PATH + constants.OUTPUT_FILE_NAME;
                        // check if the output file exists
                        fs.stat(realPath, (err) => {
                            // fails the test in case there is no generated output file
                            if (err && constants.FILE_OR_DIR_NO_EXISTS === err.code) {
                                return done(err); // the file should exist
                            }

                            // otherwise, check the file content
                            const data = fs.readFileSync(realPath).toString().trim().split('\n');
                            // check if the file was read properly
                            expect(data).toBeTruthy();

                            // check if the content of the files matches with the expected object key/value pairs
                            data.forEach(count => {
                                const key = count.split(constants.OBJECT_SEPARATOR)[constants.FIRST_ITEM];
                                const value = count.split(constants.OBJECT_SEPARATOR)[constants.SECOND_ITEM];

                                // check if the key exists
                                expect(expectedGroupedObject[key]).toBeTruthy();
                                // check if the value matches
                                expect(expectedGroupedObject[key] == value).toBeTruthy();
                            });

                            done(); // ends successfully
                        });
                    } catch (e) {
                        done(e); // should not throw any error
                    }
                })
                .catch(e => done(e)); // if there is any error, fails the test
        });
    });
});