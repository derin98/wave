/**
 * This file will contain the middlewares for getting the business unit id
 */

const BusinessUnitDbOperations = require('../../../dbOperations/mongoDB/organizationManagement/businessUnit/businessUnit.dbOperations');
const apiResponseHandler = require("../../../utils/responseHandlers/apiResponseHandler.js");


const verifyBusinessUnitId = async (req, res, next) => {
    // Validate request
    req.businessUnitId = req.isSuperAdmin ? req.query.businessUnitId : req.businessUnitId ? req.businessUnitId : undefined;
    if (!req.isSuperAdmin) {
        if (!req.businessUnitId) {
            return apiResponseHandler.errorResponse(
                res,
                "BusinessUnit Id must be a non-empty string",
                400,
                null
            );
        }
    }
    if(req.isSuperAdmin === false){
        const existingBusinessUnit = await BusinessUnitDbOperations.checkExistingBusinessUnit(req.businessUnitId);
        if (!existingBusinessUnit) {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! BusinessUnit does not exist",
                400,
                null
            );
        }
    }
    else if(req.businessUnitId !== undefined && req.isSuperAdmin === true){
        const existingBusinessUnit = await BusinessUnitDbOperations.checkExistingBusinessUnit(req.businessUnitId);
        if (!existingBusinessUnit) {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! BusinessUnit does not exist",
                400,
                null
            );
        }

    }
    next();
}


const verifyBusinessUnitAfterAuth = {
    verifyBusinessUnitId: verifyBusinessUnitId
};
module.exports = verifyBusinessUnitAfterAuth;