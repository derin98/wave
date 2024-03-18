const Team = require('../../../../models/mongoDB/organizationManagement/team/team.model');
const mongoose = require('mongoose');

async function createTeam(teamObject) {
    return Team.create(teamObject);
}

// async function getAllTeams(query, sort, order, page, limit, skip, selectFields, populateFields) {
//     if (limit > 0) {
//         return Team.find(query)
//             .select('name _id')  // Include _id in the select clause for exclusion
//             .sort({[sort]: order})
//             .skip(skip)
//             .limit(limit)
//             .lean()
//             .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
//     } else {
//         return Team.find(query)
//             .select('name _id')  // Include _id in the select clause for exclusion
//             .sort({[sort]: order})
//             .lean()
//             .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
//     }
// }
async function getAllTeams(query, sort, order, page, limit, skip, selectFields, populateFields) {
    try {
        let queryObject;
        console.log("query", query, selectFields,",", populateFields);
        if (limit > 0) {
            queryObject = Team.find(query)
                .sort({[sort]: order})
                .skip(skip)
                .limit(limit);
        } else {
            queryObject = Team.find(query).sort({[sort]: order});
        }

        if (selectFields) {
            console.log("selectFields", selectFields)
            const selectFieldsArray = selectFields.split(' ');
            if (selectFieldsArray.includes('usersCount') && !selectFieldsArray.includes('users')) {
                selectFieldsArray.push('users');
            }
            queryObject = queryObject.select(selectFieldsArray.join(' '));
        }

        if (populateFields) {
            const populateFieldsArray = populateFields.split(' ');
            const validPopulateFields = populateFieldsArray.filter(field => Team.schema.path(field) != null);
            queryObject = queryObject.populate({
                path: validPopulateFields.join(' '), // Convert back to a string
                select: '_id name shortName',
                options: {
                    lean: true, // Ensure the result is in plain JavaScript objects
                    transform: doc => {
                        if (!doc) return null; // Add this line to handle null doc
                        const {_id, ...rest} = doc;
                        return {...rest, id: _id};
                    },
                },
            });
        }

        const results = await queryObject.lean();

        return results.map(result => {
            if (result.users && !selectFields.includes('users')) {
                delete result.users;
            }
            if (selectFields.includes('usersCount')) {
                result.usersCount = result.users ? result.users.length : 0;
            }
            const {_id, ...rest} = result;
            return {...rest, id: _id};
        });
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        return null;
    }
}

// async function getAllTeams(query, sort, order, page, limit, skip, selectFields, populateFields) {
//     try {
//         let queryObject
//         console.log("query", query)
//         if(limit > 0){
//             queryObject = Team.find(query)
//                 .sort({[sort]: order})
//                 .skip(skip)
//                 .limit(limit)
//             ;
//         }
//         else{
//             queryObject = Team.find(query).sort({[sort]: order});
//         }
//
//         if (selectFields) {
//             queryObject = queryObject.select(selectFields);
//         }
//
//         if (populateFields) {
//             const populateFieldsArray = populateFields.split(' ');
//             const validPopulateFields = populateFieldsArray.filter(field => Team.schema.path(field) != null);
//             queryObject = queryObject.populate({
//                 path: validPopulateFields.join(' '), // Convert back to a string
//                 select: '_id name shortName',
//                 options: {
//                     lean: true, // Ensure the result is in plain JavaScript objects
//                     transform: doc => {
//                         // Rename _id to id within the populated item
//                         const {_id, ...rest} = doc;
//                         return {...rest, id: _id};
//                     },
//                 },
//             });
//         }
//
//         const results = await queryObject.lean();
//
//         return results.map(result => {
//             const {_id, ...rest} = result;
//             return {...rest, id: _id};
//         });
//     } catch (error) {
//         console.error('Error in getAllUsers:', error);
//         return null;
//     }
// }

async function countTeams(query) {
    return Team.countDocuments(query);
}

// async function getTeam(query) {
//     const result = await Team.findOne(query).select('name _id').lean();
//     if (result) {
//         const {_id, ...rest} = result;
//         return {...rest, id: _id};
//     }
//     return null;
// }

async function getTeam(query, selectFields, populateFields) {
    try {
        let queryObject = Team.findOne(query);

        if (selectFields) {
            queryObject = queryObject.select(selectFields);
        }

        if (populateFields) {
            // Convert populateFields string to an array
            const populateFieldsArray = populateFields.split(' ');

            // Filter out invalid fields
            const validPopulateFields = populateFieldsArray.filter(field => Team.schema.path(field) != null);


            queryObject = queryObject.populate({
                path: validPopulateFields.join(' '), // Convert back to a string
                select: '_id name shortName',
                options: {
                    lean: true, // Ensure the result is in plain JavaScript objects
                    transform: doc => {
                        // Rename _id to id within the populated item
                        const { _id, ...rest } = doc;
                        return { ...rest, id: _id };
                    },
                },
            });
        }

        const result = await queryObject.lean();

        if (result) {
            const { _id, ...rest } = result;
            return { ...rest, id: _id };
        }

        return null;
    } catch (error) {
        console.error('Error in getUser:', error);
        return null;
    }
}


async function enableTeam(query) {
    return Team.updateOne(query, {$set: {isEnabled: true}});
}

async function enableTeams(query) {
    return Team.updateMany(query, {$set: {isEnabled: true}});
}

async function disableTeam(query) {
    return Team.updateOne(query, {$set: {isEnabled: false}});
}

async function disableTeams(query) {
    return Team.updateMany(query, {$set: {isEnabled: false}});
}

async function deleteTeam(query) {
    return Team.updateOne(query, {$set: {isDeleted: true}});
}

async function deleteTeams(query) {
    return Team.updateMany(query, {$set: {isDeleted: true}});
}

async function updateTeam(query, updateObject) {
    return Team.updateOne(query, {$set: updateObject});
}
async function updateTeams(query, updateObject) {
    try {
        return await Team.updateMany(query, updateObject);
    } catch (error) {
        console.error('Error updating teams:', error);
        return false; // Indicate failure
    }
}

// async function appendUsersToTeam(teamId, users) {
//     return Team.updateOne({_id: teamId, isDeleted: false}, {$addToSet: {users: {$each: users}, usersCount: {$inc: users.length}}});
// }
async function appendUsersToTeam(teamId, users) {
    return Team.updateOne(
        { _id: teamId, isDeleted: false },

            {$push:{ users: { $each: users } }}

    );
}

async function removeUsersFromTeam(teamId, users) {
    return Team.updateOne(
        { _id: teamId, isDeleted: false },
        {
            $pull: { users: { $in: users } }
        }
    );
}

async function checkExistingTeam(id, department) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    }
    const query = {_id: id, isDeleted: false}
    if(department) {
        query.department = department;
    }
    const existingTeam = await Team.findOne(query);
    return existingTeam !== null;
}

async function checkExistingNameForBusinessUnit(name, department) {
    const query = {
        name: {$regex: new RegExp(`^${name}$`, 'i')},
        isDeleted: false
    };
    if(department) {
        query.department = department;
    }
    const existingNameTeam = await Team.findOne(query);
    return existingNameTeam !== null;
}

const returnInvalidTeams = async (ids, department) => {

    let invalidTeams = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));

    if (invalidTeams.length > 0) {
        return invalidTeams;
    }

    const query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if(department) {
        query.department = department;
    }
    const existingTeams = await Team.find(query).select('_id');

    const filterIds = existingTeams.map(team => team._id.toString());

    invalidTeams.push(...ids.filter(id => !filterIds.includes(id)));

    return Array.from(new Set(invalidTeams));
}

const returnValidAndInvalidTeams = async (ids, department) => {

    let invalidTeams = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));

    if (invalidTeams.length > 0) {
        return invalidTeams;
    }

    const query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if(department) {
        query.department = department;
    }
    const existingTeams = await Team.find(query).select('_id users');

    const filterIds = existingTeams.map(team => team._id.toString());

    invalidTeams.push(...ids.filter(id => !filterIds.includes(id)));

    let validAndInvalidTeams = {
        validTeams: existingTeams,
        invalidTeams: Array.from(new Set(invalidTeams))
    }
    return validAndInvalidTeams;
}

module.exports = {
    createTeam,
    getAllTeams,
    countTeams,
    getTeam,
    enableTeam,
    enableTeams,
    disableTeam,
    disableTeams,
    deleteTeam,
    deleteTeams,
    updateTeam,
    updateTeams,
    checkExistingTeam,
    checkExistingNameForBusinessUnit,
    returnInvalidTeams,
    appendUsersToTeam,
    removeUsersFromTeam,
    returnValidAndInvalidTeams
};