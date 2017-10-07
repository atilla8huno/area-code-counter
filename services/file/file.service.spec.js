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
const constantes = require('../../util/constants').Constants;
const fileService = require('./file.service').FileService.getInstance();

/**
 * Suite of tests
 */
describe('== Test suite of the service: FileService ==', () => {

    /**
     * Reusable test that calls a method by name to check if valid path.
     *
     * @param methodName - the name of the method to be called on the service
     */
    const checkInvalidArray = (methodName) => {
        it(`should validate that the path is invalid on ${methodName}`, (done) => {
            const invalidPaths = [[], null, true, 123];

            invalidPaths.forEach(path => {
                fileService
                    [methodName](path) // calls the method by its name passing the array as argument
                    .then(() => done(new Error('Should not be done without any error.')))
                    .catch(e => {
                        // ok, should have errors
                    });
            });
            // if has not done with error, resume - async
            setTimeout(() => done(), 0);
        });
    };

    describe('== Test suite of the method: validatePath ==', () => {

        it('should validate the relative path of a valid dir/file successfully', (done) => {
            const path = '/data/input/';

            fileService
                .validatePath(path)
                .then(() => {
                    done(); // ends successfully
                })
                .catch(e => {
                    if (e.message && e.message.indexOf('No access to:') > constantes.INVALID_INDEX) {
                        done(); // was validated but does not have permission
                    } else {
                        done(e); // other errors should not be thrown
                    }
                });
        });

        it('should validate that the dir/file does not exist', (done) => {
            const path = '/some/invalid/path.txt';

            fileService
                .validatePath(path)
                .then(() => {
                    done(new Error('Should not be done without any error.'));
                })
                .catch(e => {
                    if (e && constantes.FILE_OR_DIR_NO_EXISTS === e.code) {
                        done(); // was validated that the dir/file does not exist
                    } else {
                        done(e); // other errors should not be thrown
                    }
                });
        });

        checkInvalidArray('validatePath');
    });

    describe('== Test suite of the method: readFile ==', () => {

        it('should read an existing file successfully', (done) => {
            const path = '/data/input/numbers.test.txt';

            fileService
                .readFile(path)
                .then((data) => {
                    if (data && data.length > constantes.ONE_DIGIT) {
                        done(); // ends successfully
                    } else {
                        done(new Error('Have not read the file properly.'));
                    }
                })
                .catch(e => done(e));
        });

        it('should validate that the path is about a file, not a dir, and should not read dirs', (done) => {
            const path = '/data/input/';

            fileService
                .readFile(path)
                .then(() => {
                    done(new Error('Have not read the file properly.'));
                })
                .catch(e => {
                    if (e && e.message.indexOf('only possible read files') > constantes.INVALID_INDEX) {
                        done();
                    } else {
                        done(e);
                    }
                });
        });

        it('should validate that the file/dir of the path does not exist', (done) => {
            const path = '/some/invalid/path.txt';

            fileService
                .readFile(path)
                .then(() => {
                    done(new Error('Should not be done without any error.'));
                })
                .catch(e => {
                    if (e && constantes.FILE_OR_DIR_NO_EXISTS === e.code) {
                        done(); // was validated that the dir/file does not exist
                    } else {
                        done(e); // other errors should not be thrown
                    }
                });
        });

        checkInvalidArray('readFile');
    });

    describe('== Test suite of the method: writeOnFile ==', () => {

        it('should write the object content on a file successfully', (done) => {
            const toWrite = {
                '1': 1,
                '351': 7,
                '911': 1,
                '991': 1,
                '55': 1,
                '112': 2,
                '244': 1
            };

            // calls the write method passing the object
            fileService
                .writeOnFile(toWrite)
                .then((msg) => {
                    // check the result message
                    expect(msg && msg.indexOf('has been created') > constantes.INVALID_INDEX).toBeTruthy();

                    // check if the file was actually created
                    try {
                        // get the full path of the file
                        const realPath = process.cwd() + constantes.OUTPUT_PATH + constantes.OUTPUT_FILE_NAME;
                        // check if the output file exists
                        fs.stat(realPath, (err) => {
                            // fails the test in case there is no generated output file
                            if (err && constantes.FILE_OR_DIR_NO_EXISTS === err.code) {
                                return done(err); // the file should exist
                            }

                            // otherwise, check the file content
                            const data = fs.readFileSync(realPath).toString().trim().split('\n');
                            // check if the file was read properly
                            expect(data).toBeTruthy();

                            // check if the content of the files matches with the expected object key/value pairs
                            data.forEach((count, i) => {
                                const key = count.split(constantes.OBJECT_SEPARATOR)[constantes.FIRST_ITEM];
                                const value = count.split(constantes.OBJECT_SEPARATOR)[constantes.SECOND_ITEM];

                                // check if the key exists
                                expect(toWrite[key]).toBeTruthy();
                                // check if the value matches, does not need to have the same type, so ==, not ===
                                expect(toWrite[key] == value).toBeTruthy();
                            });

                            done(); // ends successfully
                        });
                    } catch (e) {
                        done(e); // should not throw any error
                    }
                })
                .catch(e => done(e)); // if there is any error, fails the test
        });

        checkInvalidArray('writeOnFile');
    });

    describe('== Test suite of the method: removeOutputIfExists ==', () => {

        it('should remove the output file if it exists', (done) => {
            // get the full path of the file
            const path = process.cwd() + constantes.OUTPUT_PATH + constantes.OUTPUT_FILE_NAME;

            fileService
                .removeOutputIfExists()
                .then(() => {
                    fs.stat(path, (err) => {
                        // if the file does not exist, it is ok and is not possible to remove
                        if (err && constantes.FILE_OR_DIR_NO_EXISTS === err.code) {
                            // file removed as expected
                            done();
                        } else {
                            // file was not removed as expected
                            done(new Error('Should not be done without any error.'));
                        }
                    });
                })
                .catch(e => done(e)); // if there is any error, fails the test
        });
    });

    describe('== Test suite of the method: checkIfPathExists ==', () => {

        it('should validate that the valid path is about an existing file/dir', (done) => {
            fileService
                .checkIfPathExists(constantes.AREA_CODE_DATA_PATH)
                .then(() => done()) // ends successfully
                .catch(e => done(e)); // if there is any error, fails the test
        });

        it('should validate that the dir/file does not exist', (done) => {
            const path = '/some/invalid/path.txt';

            // after sure file does not exist anymore, calls the validation
            fileService
                .checkIfPathExists(path)
                .then(() => {
                    // should throw error bc the file does not exist
                    done(new Error('Should not be done without any error.'));
                })
                .catch(e => {
                    if (e && constantes.FILE_OR_DIR_NO_EXISTS === e.code) {
                        done(); // was validated that the dir/file does not exist
                    } else {
                        done(e); // other errors should not be thrown
                    }
                });
        });

        checkInvalidArray('checkIfPathExists');
    });

    describe('== Test suite of the method: getFullPath ==', () => {

        it('should return the full path of a relative path', () => {
            const relative = 'some-text.txt';

            const fullpath = fileService.getFullPath(relative);

            // check if the fullpath is defined
            expect(fullpath).toBeTruthy();
            // check if the fullpath is greater than relative path
            expect(fullpath.length > relative.length).toBeTruthy();
        });

        it('should return the full path of a relative path in case it is inside a subdir', () => {
            // starts with relative dir
            const relative = '/data/some-text.txt';

            const fullpath = fileService.getFullPath(relative);

            // check if the fullpath is defined
            expect(fullpath).toBeTruthy();
            // check if the fullpath is greater than relative path
            expect(fullpath.length > relative.length).toBeTruthy();
            // check if the function did not add extra /
            expect(fullpath.indexOf('//data/some-text.txt')).toBe(constantes.INVALID_INDEX);
        });
    });
});