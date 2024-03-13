const Team = require('../../../../models/mongoDB/organizationManagement/team/team.model');
const mongoose = require('mongoose');

async function createTeam(teamObject) {
    return Team.create(teamObject);
}

async function getAllTeams(query, sort, order, page, limit, skip) {
    if (limit > 0) {
        return Team.find(query)
            .select('name _id')  // Include _id in the select clause for exclusion
            .sort({[sort]: order})
            .skip(skip)
            .limit(limit)
            .lean()
            .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    } else {
        return Team.find(query)
            .select('name _id')  // Include _id in the select clause for exclusion
            .sort({[sort]: order})
            .lean()
            .then(results => results.map(({_id, ...rest}) => ({...rest, id: _id})));
    }
}

async function countTeams(query) {
    return Team.countDocuments(query);
}

async function getTeam(query) {
    const result = await Team.findOne(query).select('name _id').lean();
    if (result) {
        const {_id, ...rest} = result;
        return {...rest, id: _id};
    }
    return null;
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
    checkExistingTeam,
    checkExistingNameForBusinessUnit,
    returnInvalidTeams
};