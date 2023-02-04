/*
ALGORITHM
input: quiz, user, map, country??? maybe??? array???
possibly I could do a for each thing, but I don't know if that makes sense since the goal is to avoid opening sql repeatedly
procedure
split a string??? that's a possibility maybe, we'll see
JOIN! that's a thing
current idea: 
-use one giant table
-insert the data in as it comes (or alternatively, insert the data in at the end of a session)
-should users be allowed to leave a quiz unfinished? how to handle this situation? <- maybe if they do a certain % of it
-when I want to get all the data, use a procedure, array??? country???

TWO PARTS
-inputting data
    -input an array of data in with the results from that pass of the quiz (regardless of completion)
    -possibly add a complete option?
-accessing data
    -a ton of WHERE IF blablabla statements
    -preferably display everything from one map, so find all the sums for all the countries
    and show the amounts of time x was guessed for that country, the total, and the %, and potentially look into ordering
    everything
    -remember to use the case of if something exists? (like if a region doesn't have data)

-please test everything? maybe make a table and input some data in it and test it out there to understand what's going on
*/
/*
procedure that gets the sum for all the regions
*
/*
DROP TABLE IF EXISTS points;
CREATE TABLE points();
DELIMITE
*/
/*
Procedure for Calling sums
DROP PROCEDURE IF EXISTS regionSum;
DELIMITER $$
CREATE PROCEDURE regionSum(IN username CHAR(50), IN map CHAR(50), IN quiz CHAR(50), IN regions CHAR(10000))
BEGIN
//figure out what to with the regions
SELECT SUM(points) AS red FROM instances WHERE user = 'red';
END $$
*/
/*
NEW ATTEMPT
/*
tables:
// user, map, quiz, attempt #, region, binary correct
// user, map, quiz, attempt #, score (# correct), total attempted
to put info in the database
// send an array back to node with the information about the attempt (which regions were attempted, binary correct)
// individually put all of the instances in
// put the total attempt information in
// in terms of keeping track of attempt #, maybe when it's being stored, look at the attempts and see how many there
// think about having a save button? like if users want to store an unfinished quiz or not, have a save unfinished attempt option
when a user wants info about their progress
// select and look for the user, map, quiz, and process in node from there
// also select and look for the attempts and scores (potentially for an overview)


