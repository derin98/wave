/**
 * This is the controller for the BusinessUnit resource
 */

const businessUnitReqObjExtractor = require("../../../utils/objectHandlers/reqObjExtractors/organizationManagement/businessUnit/businessUnit.reqObjExtractor");
const apiResponseHandler = require("../../../utils/objectHandlers/apiResponseHandler.js");
const businessUnitService = require("../../../services/internalServices/OrganizationManagement/businessUnit/businessUnit.services");
/**
 * Create a BusinessUnit
 *
 */

exports.createBusinessUnit = async (req, res) => {
    try {
        const businessUnitObject = businessUnitReqObjExtractor.createBusinessUnitObject(req);

        const businessUnit = await businessUnitService.createBusinessUnit(businessUnitObject);

        const message = "BusinessUnit created successfully";

        return apiResponseHandler.successResponse(res, message, businessUnit, 201);
    } catch (err) {
        console.log("Some error happened while creating businessUnit", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500);
    }
};


/**
 * Get all BusinessUnits
 *
 */

exports.getAllBusinessUnits = async (req, res) => {
    try {
        const businessUnits = await businessUnitService.getAllBusinessUnits(req);

        const message = "BusinessUnits fetched successfully";

        return apiResponseHandler.successResponse(res, message, businessUnits, 200);
    } catch (err) {
        console.log("Some error happened while fetching businessUnits", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500);
    }
}

/**
 * Get a BusinessUnit
 *
 */

exports.getBusinessUnit = async (req, res) => {
    try {
        const businessUnit = await businessUnitService.getBusinessUnit(req.params.businessUnit);

        if (!businessUnit) {
            return apiResponseHandler.errorResponse(res, "BusinessUnit not found", 404);
        }

        const message = "BusinessUnit fetched successfully";

        return apiResponseHandler.successResponse(res, message, businessUnit, 200);
    } catch (err) {
        console.log("Some error happened while fetching businessUnit", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500);
    }
}

/**
 * Enable a BusinessUnit
 *
 */

exports.enableBusinessUnit = async (req, res) => {
    try {
        await businessUnitService.enableBusinessUnit(req.params.businessUnit);

        const message = "BusinessUnit enabled successfully";

        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Some error happened while enabling businessUnit", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500);
    }
}

/**
 * Disable a BusinessUnit
 *
 */

exports.disableBusinessUnit = async (req, res) => {
    try {
        await businessUnitService.disableBusinessUnit(req.params.businessUnit);

        const message = "BusinessUnit disabled successfully";

        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Some error happened while disabling businessUnit", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500);
    }
    }

    /**
     * Enable BusinessUnits
     *
     */

    exports.enableBusinessUnits = async (req, res) => {
        try {
            await businessUnitService.enableBusinessUnits(req.body.businessUnits);

            const message = "BusinessUnits enabled successfully";

            return apiResponseHandler.successResponse(res, message, null, 200);
        } catch (err) {
            console.log("Some error happened while enabling businessUnits", err.message);
            return apiResponseHandler.errorResponse(res, "Some internal server error", 500);
        }
    }

    /**
     * Disable BusinessUnits
     *
     */

    exports.disableBusinessUnits = async (req, res) => {
        try {
            await businessUnitService.disableBusinessUnits(req.body.businessUnits);

            const message = "BusinessUnits disabled successfully";

            return apiResponseHandler.successResponse(res, message, null, 200);
        } catch (err) {
            console.log("Some error happened while disabling businessUnits", err.message);
            return apiResponseHandler.errorResponse(res, "Some internal server error", 500);
        }
    }


    /**
     * Delete a BusinessUnit
     *
     */

    exports.deleteBusinessUnit = async (req, res) => {
        try {
            await businessUnitService.deleteBusinessUnit(req.params.businessUnit);

            const message = "BusinessUnit deleted successfully";

            return apiResponseHandler.successResponse(res, message, null, 200);
        } catch (err) {
            console.log("Some error happened while deleting businessUnit", err.message);
            return apiResponseHandler.errorResponse(res, "Some internal server error", 500);
        }
    }

    /**
     * Delete BusinessUnits
     *
     */

    exports.deleteBusinessUnits = async (req, res) => {
        try {
            await businessUnitService.deleteBusinessUnits(req.body.businessUnits);

            const message = "BusinessUnits deleted successfully";

            return apiResponseHandler.successResponse(res, message, null, 200);
        } catch (err) {
            console.log("Some error happened while deleting businessUnits", err.message);
            return apiResponseHandler.errorResponse(res, "Some internal server error", 500);
        }
    }

    /**
     * Update a BusinessUnit
     *
     */

    exports.updateBusinessUnit = async (req, res) => {
        try {
            const businessUnitObject = businessUnitReqObjExtractor.updateBusinessUnitObject(req);

            await businessUnitService.updateBusinessUnit(req.params.businessUnit, businessUnitObject);

            const message = "BusinessUnit updated successfully";

            return apiResponseHandler.successResponse(res, message, null, 200);
        } catch (err) {
            console.log("Some error happened while updating businessUnit", err.message);
            return apiResponseHandler.errorResponse(res, "Some internal server error", 500);
        }
    }