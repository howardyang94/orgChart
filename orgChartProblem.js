module.exports = { search };

function search(name, id, levels, personalMap, orgMap, teamMap){
    if(name == '' || name == null) {
        throw new Error('Please provide the name of the employee you wish to search for');
    } 
    if (levels == '' || levels == null) {
        levels = 1; // default will return 1 level
    } else if (levels > 3 || levels < 1 || Math.floor(levels) != levels) {
        throw new Error('Please enter a valid value for levels (1, 2, or 3)');
    }
    name = name.split(' ');
    if(name.length > 2) {
        throw new Error('Too many names entered, please enter only first name and last name');
    }
    // ignore Caps
    const firstName = name[0].toUpperCase();
    const lastName = (name[1] || '').toUpperCase();
    const uId = id;

    let lookupId = findUser();

    if(lookupId == null) {      // user not found in data
        notFoundError('Personal');
    }
    if(!orgMap.has(lookupId)) { // user not found in data
        notFoundError('Organization');
    }
    const res = [];             // array to store all relevant fields to be displayed
    const resIDs = [];          // array to store user IDs of the search results
    addRow(lookupId, res, 0);   // add found user to result
    addTeam(lookupId);          // add team members, if any
    printLog();                 // log results to terminal
    return resIDs;              // return results for testing

    // helper functions
    function addRow(id, arr, depth) {
        let curr = personalMap.get(id);
        let row = [];
        row.push(curr.firstName);
        row.push(curr.lastName);
        row.push(curr.phoneNumber);
        curr = orgMap.get(id);
        row.push(curr.title);
        row.push(curr.organization);
        row.push('Level: ' + depth)
        arr.push(row.join('\t\t'));
        resIDs.push(id);
    }
    function addTeam(id, depth = 1) {
        let teamMembers = teamMap.get(id);
        if(teamMembers == null || teamMembers.length == 0) {
            return;
        }
        for(let member of teamMembers) {
            addRow(member, res, depth);
        }
        if(depth < levels) {
            for(let member of teamMembers) {
                addTeam(member, depth + 1);
            }
        }
    }
    function notFoundError(table) {
        const string = userSearchString();
        throw new Error(`Employee "${string}" was not found in the ${table} data`);

    }
    function userSearchString() {
        let string = firstName;
        if(lastName) {
            string += ' ' + lastName;
        }
        if(uId) {
            string += ', ID # ' + uId;
        }
        return string;
    }
    function printLog() {
        const string = userSearchString();
        console.log(`\nYour search for "${string}" for a depth of ${levels} level(s) returned ${res.length} results:\n${res.join('\n')}`);
    }
    function findUser() {
        let result;
        for(let [id, data] of personalMap) {
            if(lastName != '' && data.firstName.toUpperCase() == firstName && data.lastName.toUpperCase() == lastName
            || lastName == '' && data.firstName.toUpperCase() == firstName) {
                // found matching user
                if(uId != '' && uId != null) {
                    // if user id was provided, it must match as well
                    if(uId == id) {
                        // all provided fields match, return data
                        return id;
                    }
                } else {
                    if(result != null) {
                        throw new Error('There exists a duplicate user(s) with the same first and/or last name'+
                        '\nYour request could not be completed.'+
                        '\nPlease try again, including the User\'s personal ID');
                    }
                    result = id;
                }
            }
        }
        return result;
    }
}