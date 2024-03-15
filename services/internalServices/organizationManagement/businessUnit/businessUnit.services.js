// organizationManagement.db.js

const BusinessUnitOperations = require("../../../../dbOperations/mongoDB/organizationManagement/businessUnit/businessUnit.dbOperations");
const paginationHandler = require("../../../../utils/objectHandlers/paginationHandler");
const businessUnitResObjConvertor = require("../../../../utils/objectHandlers/resObjConverters/organizationManagement/businessUnit/businessUnit.resObjConverter");
const userService = require("../../userManagement/user/user.services");


async function createBusinessUnit(businessUnitObject) {
    const businessUnit = await BusinessUnitOperations.createBusinessUnit(businessUnitObject);
    return businessUnitResObjConvertor.businessUnitCreateResponse(businessUnit);
}

    async function getAllBusinessUnits(req) {
    let query = {
        isEnabled : true,
        isDeleted : false
    };


        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: 'i' };
            query.shortName = { $regex: req.query.shortName, $options: 'i' };
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 0;
        const skip = (page - 1) * limit;

        const sort = req.query.sort || 'createdAt';
        const order = req.query.order === 'desc' ? -1 : 1;

        const countBusinessUnits =  await BusinessUnitOperations.countBusinessUnits(query);

        if (limit === 0 && page > 1) {
            // Return an appropriate response for your use case
            return paginationHandler.paginationResObj(page, 1, countBusinessUnits, []);
        }
        const businessUnits =  await BusinessUnitOperations.getAllBusinessUnits(query, sort, order, page, limit, skip);
        console.log(businessUnits, query, sort, order, page, limit, skip)
        const totalPages = countBusinessUnits === 0 ? 0 : (limit === 0 ? 1 : Math.ceil(countBusinessUnits / limit));

        return paginationHandler.paginationResObj(page, totalPages, countBusinessUnits, businessUnits);

    }



    async function getBusinessUnit(id) {

        let query = {
            // isEnabled : true,
            isDeleted : false,
            _id : id
        };
        return await BusinessUnitOperations.getBusinessUnit(query);
    }

async function returnNewBuUserIdAndName(id, selectFields) {

    let query = {
        // isEnabled : true,
        isDeleted : false,
        _id : id
    };
    selectFields = selectFields
        ? [...new Set(selectFields.split(',')), 'name', 'shortName', '_id', 'userCount'].join(' ')
        : ['name', 'shortName', '_id', 'userCount'];

    const businessUnit = await BusinessUnitOperations.getBusinessUnit(query, selectFields);
    let buUserId = businessUnit.shortName+(businessUnit.userCount+1);
    const existingBuUserId = await userService.getUserByBuUserId(buUserId)
    // const existingBuUserId = await UserDbOperations.getUser({ buUserId: buUserId });
    if (existingBuUserId != null) {
        res.status(400).send({
            message: "Failed! BuUserId  already exists!"
        });
        return;
    }

    return {
        buUserId,
        name: businessUnit.name,
    }

}

async function getBusinessUnitByName(name, selectFields, populateFields) {

    let query = {
        // isEnabled : true,
        isDeleted : false,
        name : name
    };
    populateFields = populateFields
        ? [...new Set(populateFields.split(',')), 'name', '_id'].join(' ')
        : "";
    selectFields = selectFields
        ? [...new Set(selectFields.split(',')), 'name', 'shortName', '_id'].join(' ')
        : ['name', 'shortName', '_id'];

    return await BusinessUnitOperations.getBusinessUnit(query, selectFields, populateFields);
}

    async function enableBusinessUnit(id) {
        let query = {
            isDeleted : false,
            _id : id
        };
        return await BusinessUnitOperations.enableBusinessUnit(query);
    }

    async function enableBusinessUnits(ids) {
        let query = {
            isDeleted : false,
            _id : { $in: ids }
        };
        return await BusinessUnitOperations.enableBusinessUnits(query);
    }

    async function disableBusinessUnit(id) {
        let query = {
            isDeleted : false,
            _id : id
        };
        return await BusinessUnitOperations.disableBusinessUnit(query);
    }

    async function disableBusinessUnits(ids) {
        let query = {
            isDeleted : false,
            _id : { $in: ids }
        };
        return await BusinessUnitOperations.disableBusinessUnits(query);
    }

async function deleteBusinessUnit(id) {
    let query = {
        isDeleted : false,
        _id : id
    };
    return await BusinessUnitOperations.deleteBusinessUnit(query);
}


    async function deleteBusinessUnits(ids) {
        let query = {
            isDeleted : false,
            _id : { $in: ids }
        };
        return await BusinessUnitOperations.deleteBusinessUnits(query);
    }

    async function updateBusinessUnit(id, businessUnitObject) {
        let query = {
            isDeleted : false,
            _id : id
        };
        return await BusinessUnitOperations.updateBusinessUnit(query, businessUnitObject);
    }
async function updateBusinessUnitUserCountByOne(id) {
    let query = {
        isDeleted : false,
        _id : id
    };
    let businessUnitObject = {
        $inc: { userCount: 1 }
    };
    return await BusinessUnitOperations.updateBusinessUnit(query, businessUnitObject);
}

module.exports = {
    createBusinessUnit,
    getAllBusinessUnits,
    getBusinessUnit,
    returnNewBuUserIdAndName,
    enableBusinessUnit,
    enableBusinessUnits,
    disableBusinessUnit,
    disableBusinessUnits,
    deleteBusinessUnit,
    deleteBusinessUnits,
    updateBusinessUnit,
    updateBusinessUnitUserCountByOne,
    getBusinessUnitByName
};