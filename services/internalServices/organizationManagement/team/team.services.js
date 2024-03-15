const TeamOperations = require('../../../../dbOperations/mongoDB/organizationManagement/team/team.dbOperations');
const paginationHandler = require('../../../../utils/objectHandlers/paginationHandler');
const teamResObjConverter = require('../../../../utils/objectHandlers/resObjConverters/organizationManagement/team/team.resObjConverter');


async function createTeam(teamObject) {
    const team = await TeamOperations.createTeam(teamObject);
    return teamResObjConverter.teamCreateResponse(team);
}

async function getAllTeams(req) {
    let query = {
        isEnabled: true,
        isDeleted: false,
    };
    if(req.businessUnit) {
        query.businessUnit = req.businessUnit;
    }

    if(req.departments) {
        query.department = { $in: req.departments };
    }
    if (req.query.name) {
        query.name = {$regex: req.query.name, $options: 'i'};
    }
    let populateFields = req.query.populateFields;
    let selectFields = req.query.selectFields;

    populateFields = populateFields
        ? [...new Set(populateFields.split(','))].join(' ')
        : "";

    selectFields = selectFields
        ? [...new Set(selectFields.split(',')), 'name', '_id'].join(' ')
        : ['name', '_id'];

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const skip = (page - 1) * limit;

    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'desc' ? -1 : 1;

    const countTeams = await TeamOperations.countTeams(query);

    if (limit === 0 && page > 1) {
        return paginationHandler.paginationResObj(page, 1, countTeams, []);
    }
    const teams = await TeamOperations.getAllTeams(query, sort, order, page, limit, skip, selectFields, populateFields);
    const totalPages = countTeams === 0 ? 0 : (limit === 0 ? 1 : Math.ceil(countTeams / limit));

    return paginationHandler.paginationResObj(page, totalPages, countTeams, teams);
}

async function getTeam(id, selectFields, populateFields, businessUnit) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    populateFields = populateFields
        ? [...new Set(populateFields.split(','))].join(' ')
        : "";

    selectFields = selectFields
        ? [...new Set(selectFields.split(',')), 'name', '_id'].join(' ')
        : ['name', '_id'];
    return await TeamOperations.getTeam(query, selectFields, populateFields);
}

async function enableTeam(id, businessUnit) {
    let query = {
        _id: id,
        // isEnabled: false,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await TeamOperations.enableTeam(query);
}

async function enableTeams(ids, businessUnit) {
    let query = {
        _id: {$in: ids},
        // isEnabled: false,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await TeamOperations.enableTeams(query);
}

async function disableTeam(id, businessUnit) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await TeamOperations.disableTeam(query);
}


async function disableTeams(ids, businessUnit) {
    let query = {
        _id: {$in: ids},
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await TeamOperations.disableTeams(query);
}

async function deleteTeam(id, businessUnit) {
    let query = {
        _id: id,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await TeamOperations.deleteTeam(query);
}

async function deleteTeams(ids, businessUnit) {
    let query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await TeamOperations.deleteTeams(query);
}

async function updateTeam(id, updateObject, businessUnit) {
    let query = {
        _id: id,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await TeamOperations.updateTeam(query, updateObject);
}

async function appendUsersToTeam(teamId, users, businessUnit) {
    let query = {
        _id: teamId,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await TeamOperations.appendUsersToTeam(query, users);
}

async function removeUsersFromTeam(teamId, users, businessUnit) {
    let query = {
        _id: teamId,
        isDeleted: false
    };
    if(businessUnit) {
        query.businessUnit = businessUnit;
    }
    return await TeamOperations.removeUsersFromTeam(query, users);
}

async function returnUsersFromTeams(teamsObjs){
    console.log('teamsObjs', teamsObjs)
    const users = [];
    teamsObjs.forEach(team => {
        users.push(...team.users);
    });
    return users;
}

module.exports = {
    createTeam,
    getAllTeams,
    getTeam,
    enableTeam,
    enableTeams,
    disableTeam,
    disableTeams,
    deleteTeam,
    deleteTeams,
    updateTeam,
    appendUsersToTeam,
    returnUsersFromTeams
};