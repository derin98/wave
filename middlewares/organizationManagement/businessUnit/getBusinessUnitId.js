/**
 * This file will contain the middlewares for getting the business unit id
 */

const BusinessUnitDbOperations = require('../../../dbOperations/mongoDB/organizationManagement/businessUnit/businessUnit.dbOperations');
const apiResponseHandler = require("../../../utils/responseHandlers/apiResponseHandler.js");


const getBusinessUnitId = async (req, res, next) => {
    // Validate request

    req.businessUnitId = req.isAdmin ? req.params.businessUnitId : req.businessUnitId ? req.businessUnitId : "";
    if (!req.isAdmin) {
        if (!req.businessUnitId) {
            return apiResponseHandler.errorResponse(
                res,
                "BusinessUnit Id must be a non-empty string",
                400,
                null
            );
        }
    }
    if(req.businessUnitId !== ""){
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


const verifyBusinessUnitId = {
    getBusinessUnitId: getBusinessUnitId
}