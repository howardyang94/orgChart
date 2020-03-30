const orgChart = require('./orgChartProblem');
const fs = require('fs');

let personalMap = new Map(), orgMap = new Map(), teamMap = new Map();
const personalData = fs.readFileSync('./personalData.json', 'utf8');
personal = JSON.parse(personalData);

const orgData = fs.readFileSync('./orgData.json', 'utf8');
org = JSON.parse(orgData);

const teamData = fs.readFileSync('./teamData.json', 'utf8');
team = JSON.parse(teamData);
//setup
function buildMaps() {
    for(let data of personal) {
        const id = data.personId;
        if(personalMap.has(id)) {
            throw new Error(`Duplicate ID exists in "Personal" data`);
        }
        personalMap.set(id, data);    
    }
    for(let data of org) {
        const id = data.personId;
        if(!personalMap.has(id)) {
            throw new Error('Error, data from "Personal" does not match data from "Organization"');
        }
        if(orgMap.has(id)) {    
            throw new Error(`Duplicate ID exists in "Organization" data`);
        }
        orgMap.set(id, data);    
    }
    if(orgMap.size != personalMap.size) {
        throw new Error('Error, data from "Personal" does not match data from "Organization"');
    }
    for(let data of team) {
        const id = data.manager;
        const teammate = data.teamMember;
        if(!teamMap.has(id)) {
            teamMap.set(id, new Set([teammate]));
        } else {
            const curr = teamMap.get(id);
            if(curr.has(teammate)) {
                console.log('There is duplicated data in "Team" table, it will be ignored');
            } else {
                curr.add(teammate);
            }
        }
    }
}

beforeAll(() => {
    buildMaps();

})

test('no name provided will throw an error', () => {
    expect(() =>{ 
        orgChart.search('', '', '', personalMap, orgMap, teamMap) 
    }).toThrow(/name/);
});

test('invalid decimal number for levels will throw an error', () => {
    expect(() =>{ 
        orgChart.search('temp', '', '1.2', personalMap, orgMap, teamMap) 
    }).toThrow(/valid value for levels/);
});

test('invalid negative number for levels will throw an error', () => {
    expect(() =>{ 
        orgChart.search('temp', '', '-1', personalMap, orgMap, teamMap) 
    }).toThrow(/valid value for levels/);
});

test('invalid number for levels that is not 1, 2 or 3 will throw an error', () => {
    expect(() =>{ 
        orgChart.search('temp', '', '45', personalMap, orgMap, teamMap) 
    }).toThrow(/valid value for levels/);
});

test('no name provided will throw an error even if other fields are valid', () => {
    expect(() =>{ 
        orgChart.search('', '1000', '3', personalMap, orgMap, teamMap) 
    }).toThrow(/name/);
});

test('providing more than 2 words for name will throw an error', () => {
    expect(() =>{ 
        orgChart.search('a b c', '', '', personalMap, orgMap, teamMap) 
    }).toThrow(/Too many names/);
});

test('providing a name not in the data will throw a "not found" error', () => {
    expect(() =>{ 
        orgChart.search('foo bar', '', '', personalMap, orgMap, teamMap) 
    }).toThrow(/not found/);
});

test('only given first name, will throw error if there are duplicates: throws duplicate error when searching for "John"', () => {
    expect(() =>{ 
        orgChart.search('John', '', '', personalMap, orgMap, teamMap) 
    }).toThrow(/duplicate/);
});

test('Searching for names is NOT case sensitive', () => {
    const res1 = orgChart.search('BOB', '', '', personalMap, orgMap, teamMap);
    const res2 = orgChart.search('bob', '', '', personalMap, orgMap, teamMap);
    const res3 = orgChart.search('Bob', '', '', personalMap, orgMap, teamMap);
    expect(res1).toEqual(res2);
    expect(res2).toEqual(res3);
    expect(res1).toEqual(res3);
});

test('can use ID to find correct user with duplicate first names and/or last names', () => {
    const res1 = orgChart.search('John Doe', '1000', '', personalMap, orgMap, teamMap);
    const res2 = orgChart.search('John Doe', '1001', '', personalMap, orgMap, teamMap);
    const res3 = orgChart.search('John', '1007', '', personalMap, orgMap, teamMap);
    expect(res1).not.toEqual(res2);
    expect(res2).not.toEqual(res3);
    expect(res1).not.toEqual(res3);
});

test('if duplicate first name exists, can find by last name if first/last combination is unique', () => {
    expect(orgChart.search('John Deer', '', '', personalMap, orgMap, teamMap)).toEqual([1007]);
});

test('Providing an ID that does not match, even if the provided name is valid, will throw an error', () => {
    expect(() =>{ 
        orgChart.search('John', 'Deer', '1001', personalMap, orgMap, teamMap) 
    }).toThrow(Error);
});

test('Expected result: returns 3 records when searching "John , id 1000" and depth of 2', () => {
    const res = orgChart.search('John', '1000', '2', personalMap, orgMap, teamMap)
    expect(res).toEqual([1000,1001,1002]);
    expect(res.length).toBe(3);
});

test('Expected result: returns 2 records when searching "Harry" and depth of 1', () => {
    const res = orgChart.search('harry', '', '1', personalMap, orgMap, teamMap);
    expect(res).toEqual([1002,1003]);
    expect(res.length).toBe(2);
});

test('Expected result: returns 6 records when searching for "Harry" and depth of 3', () => {
    const res = orgChart.search('Harry', '', 3, personalMap, orgMap, teamMap)
    expect(res).toEqual([1002,1003,1004,1005,1007,1006]);
    expect(res.length).toBe(6);
});

test('returns all team members, Alice has 2 direct reports; Expected result: searching "Alice" depth of 1 should return 3 results', () => {
    const res = orgChart.search('Alice', '', 1, personalMap, orgMap, teamMap)
    expect(res).toEqual([1003,1004,1005]);
    expect(res.length).toBe(3);
});

test('returns all team members of team members, Alice has 2 direct reports and they have 1 direct report each; Expected result: searching "Alice" depth of 1 should return 5 results', () => {
    const res = orgChart.search('Alice', '', 3, personalMap, orgMap, teamMap)
    expect(res).toEqual([1003,1004,1005,1007,1006]);
    expect(res.length).toBe(5);
});
