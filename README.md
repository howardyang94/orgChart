# OrgChart
A program that reads 3 sets of data from 3 separate files and provides a consolidated output based on a set of search parameters: FirstName, LastName[optional], User ID [optional], Level[optional]

Written in JavaScript and Node.js, Unit Tests in Jest.

## Problem Statement
Print an Org Chart for an Employee.

Write a program that reads three sets of data from 3 files 1) Personal 2) Organization 3) Team and provides a consolidated
output given a person first name or lastname or both.
For example:
Personal
firstName, lastName, address, phoneNumber, personID
Organization
Title, Organization, personID
Team
manager (personID), teamMember(personID)

Ask:
1. Given a person firstName or lastName or firstName and LastName print the person’s info and
people reporting into that person to all Levels
2. If a level is given ( 1 or 2 or 3) only print upto that level. Minimum acceptable level is 1
3. You can use Java or JavaScript as programming languages.
4. Make sure you write Unit Test Cases
5. Please state any assumptions you are making
6. If you have any questions, feel free reach out we will respond as soon as we can


## Assumptions
- Data is read from the 3 files named 'orgData.json', 'personalData.json', and 'teamData.json', and the data is in valid JSON format.
- There is no data with duplicate 'personId' s (will throw an exception)
- Each data object from 'orgData' must have a corresponding entry in 'personalData', 2 pieces of data that represent one employee (will throw an exception otherwise)
- All fields will contain singular values
- First and Last name each consist of one word

I included the option to include UserID in the search.  It will allow you to find the appropriate user given the same first and last names. However, valid first and/or last name searches with a non-matching or invalid UserID will throw an error.

## Getting Started
Will need to have Node.js and Node Package Manager installed.  node_modules have been removed to decrease file size and will have to be installed:

```bash
npm install
npm start
```

Then follow the prompts and enter your search parameters.

Unit tests can be run with:
```bash
npm run test
```
