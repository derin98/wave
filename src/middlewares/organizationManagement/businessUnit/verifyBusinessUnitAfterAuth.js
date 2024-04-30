/**
 * This file will contain the middlewares for getting the business unit id
 */

const BusinessUnitDbOperations = require('../../../dbOperations/mongoDB/organizationManagement/businessUnit/businessUnit.dbOperations');
const apiResponseHandler = require("../../../utils/objectHandlers/apiResponseHandler.js");


const verifyBusinessUnit = async (req, res, next) => {
    // Validate request
    req.businessUnit = req.isSuperAdmin ? (req.query.businessUnit || req.body.businessUnit) : req.businessUnit ? req.businessUnit : req.query.businessUnit;
    if (!req.isSuperAdmin) {
        if (!req.businessUnit) {
            return apiResponseHandler.errorResponse(
                res,
                "BusinessUnit Id must be a non-empty string",
                400,
                null
            );
        }
    }
    if(req.isSuperAdmin === false){
        const existingBusinessUnit = await BusinessUnitDbOperations.checkExistingBusinessUnit(req.businessUnit);
        if (!existingBusinessUnit) {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! BusinessUnit does not exist",
                400,
                null
            );
        }
    }
    else if(req.businessUnit !== undefined && req.isSuperAdmin === true){
        const existingBusinessUnit = await BusinessUnitDbOperations.checkExistingBusinessUnit(req.businessUnit);
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

const verifyBusinessUnitForSignIn = async (req, res, next) => {
    req.businessUnit = req.body.businessUnit;
    if (!req.businessUnit) {
        return apiResponseHandler.errorResponse(
            res,
            "BusinessUnit Id must be a non-empty string",
            400,
            null
        );
    }
    else {
        let existingBusinessUnit = await BusinessUnitDbOperations.getBusinessUnit({_id: req.businessUnit, isDeleted: false});
        if (!existingBusinessUnit) {
            existingBusinessUnit = await BusinessUnitDbOperations.getBusinessUnit({name: req.businessUnit, isDeleted: false});
        }
        req.businessUnitObj = existingBusinessUnit;
        if (!existingBusinessUnit) {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! BusinessUnit does not exist",
                400,
                null
            );
        }
    }
next()
}


const verifyBusinessUnitAfterAuth = {
    verifyBusinessUnit: verifyBusinessUnit,
    verifyBusinessUnitForSignIn: verifyBusinessUnitForSignIn
};
module.exports = verifyBusinessUnitAfterAuth;