# Requeriments 
 - the full requeriments is located at `/data/requeriments.md`

Given a file with valid area codes and a second file with potential phone numbers, print the count of valid phone numbers by valid area code. Only the lines (of the second file) that include a valid phone number (and nothing more) according to the following rules should be accounted for:
 - has either 3 digits or between 7 and 12 digits (inclusive); 
 - can have the optional '+' character in the beginning (before any digit); 
 - can start with '00', in which case it shouldn't start with the '+' sign; 
 - if it starts with '00', these two digits don't count to the maximum number of digits; 
 - cannot have any letters; 
 - cannot have any symbol aside from the beginning '+' sign; 
 - cannot have any whitespace between the '+' sign and the first digit but can have any amount of whitespace in all other places;

# Before running

It is necessary to install all the dependencies before running the program.

 - execute the command below to install de dependencies
 
   ` $ npm install`
 
 - to run all automated tests, run the command below
 
   ` $ npm test`
 
 - to start the program with a default input file, run the command below
 
   ` $ npm start`
 
 - to start the program with a custom file name, run the command below
 
   ` $ node app.js your_file.txt`
 
 - the results should be generated on the folder /data/output/ (relative to the project root)
 
## Notes

* The node version used was v8.1.2 (or superior)
* The file name (input) passed by cmd line should be relative to root project
