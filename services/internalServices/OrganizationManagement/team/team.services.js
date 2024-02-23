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
    if(req.businessUnitId) {
        query.businessUnitId = req.businessUnitId;
    }
    console.log("query", query)
    if (req.query.name) {
        query.name = {$regex: req.query.name, $options: 'i'};
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const skip = (page - 1) * limit;

    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'desc' ? -1 : 1;

    const countTeams = await TeamOperations.countTeams(query);

    if (limit === 0 && page > 1) {
        return paginationHandler.paginationResObj(page, 1, countTeams, []);
    }
    const teams = await TeamOperations.getAllTeams(query, sort, order, page, limit, skip);
    const totalPages = countTeams === 0 ? 0 : (limit === 0 ? 1 : Math.ceil(countTeams / limit));

    return paginationHandler.paginationResObj(page, totalPages, countTeams, teams);
}

async function getTeam(id, businessUnitId) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await TeamOperations.getTeam(query);
}

async function enableTeam(id, businessUnitId) {
    let query = {
        _id: id,
        // isEnabled: false,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await TeamOperations.enableTeam(query);
}

async function enableTeams(ids, businessUnitId) {
    let query = {
        _id: {$in: ids},
        // isEnabled: false,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await TeamOperations.enableTeams(query);
}

async function disableTeam(id, businessUnitId) {
    let query = {
        _id: id,
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await TeamOperations.disableTeam(query);
}


async function disableTeams(ids, businessUnitId) {
    let query = {
        _id: {$in: ids},
        // isEnabled: true,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await TeamOperations.disableTeams(query);
}

async function deleteTeam(id, businessUnitId) {
    let query = {
        _id: id,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await TeamOperations.deleteTeam(query);
}

async function deleteTeams(ids, businessUnitId) {
    let query = {
        _id: {$in: ids},
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await TeamOperations.deleteTeams(query);
}

async function updateTeam(id, updateObject, businessUnitId) {
    let query = {
        _id: id,
        isDeleted: false
    };
    if(businessUnitId) {
        query.businessUnitId = businessUnitId;
    }
    return await TeamOperations.updateTeam(query, updateObject);
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
    updateTeam
};