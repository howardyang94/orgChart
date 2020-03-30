const { stdin, stdout } = process;
const orgChart = require('./orgChartProblem')
const fs = require('fs');
const personalData = fs.readFileSync('./personalData.json', 'utf8');
const personal = JSON.parse(personalData);

const orgData = fs.readFileSync('./orgData.json', 'utf8');
const org = JSON.parse(orgData);

const teamData = fs.readFileSync('./teamData.json', 'utf8');
const team = JSON.parse(teamData);

main();

function prompt(question) {
    return new Promise((resolve, reject) => {
        stdin.resume();
        stdout.write(question);
        
        stdin.on('data', data => resolve(data.toString().trim()));
        stdin.on('error', err => reject(err));
    });
}

async function main() {
    const [pMap, oMap, tMap] = [...buildMaps()];
    try {
        const name = await prompt("\nEnter Name (Required, Last Name Optional): ")
        const id = await prompt("Enter User ID (Optional): ")
        const levels = await prompt("Enter number of Levels to return (Optional, default = 1): ");
        stdin.pause();
        orgChart.search(name, id, levels, pMap, oMap, tMap);
    } catch(error) {
        console.log("\nEncountered an error, see details below:");
        console.log(error + '\n');
    }
    process.exit();
}

// process our data and set up maps for quick lookup and data retrieval for repeated operations
function buildMaps() {
    const personalMap = new Map();
    const orgMap = new Map();
    const teamMap = new Map();
    for(let data of personal) {
        const id = data.personId;
        if(personalMap.has(id)) {
            // should only have one row of data per user ID
            duplicateIDError('Personal');
        }
        personalMap.set(id, data);    
    }
    for(let data of org) {
        const id = data.personId;
        if(!personalMap.has(id)) {
            throw new Error('Error, data from "Personal" does not match data from "Organization"');
        }
        if(orgMap.has(id)) {    
            // should only have one row of data per user ID
            duplicateIDError('Organization');
        }
        orgMap.set(id, data);    
    }
    if(orgMap.size != personalMap.size) {
        throw new Error('Error, data from "Personal" does not match data from "Organization"');
    }
    for(let data of team) {
        const id = data.manager;
        const teammate = data.teamMember;
        // each manager can have multiple team members, store as a Set to easily detect duplicates
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
    return [personalMap, orgMap, teamMap];
}

function duplicateIDError(table) {
    throw new Error(`Duplicate ID exists in "${table}" data`);
}