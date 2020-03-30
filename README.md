# OrgChart
A program that reads 3 separate sets of data from 3 files and provides a consolidated output based on a set of search parameters: FirstName, LastName[optional], User ID [optional], Level[optional]

Written in JavaScript and Node.js, Unit Tests in Jest.

## Assumptions
- Data is taken from the 3 files named 'orgData.json', 'personalData.json', and 'teamData.json', and the data is in valid JSON format.
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

Unit tests can be run with 
```bash
npm run test
```