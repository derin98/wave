/**
 * This is the controller for the designation resource
 */

const designationReqObjExtractor = require('../../../utils/objectHandlers/reqObjExtractors/organizationManagement/designation/designation.reqObjExtractor');
const apiResponseHandler = require('../../../utils/responseHandlers/apiResponseHandler');
const designationService = require('../../../services/internalServices/organizationManagement/designation/designation.services');
/**
 * Create a designation
 *
 */

exports.createDesignation = async (req, res) => {
    try {
        const designationReqObj = designationReqObjExtractor.createDesignationObject(req);
        const designation = await designationService.createDesignation(designationReqObj);
        const message = "Designation created successfully";
        return apiResponseHandler.successResponse(res, message, designation, 201);
    } catch (err) {
        console.log("Error while creating the designation", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Get all designations
 *
 */

exports.getAllDesignations = async (req, res) => {
    try {
        const designations = await designationService.getAllDesignations(req);
        const message = "Designations fetched successfully";
        return apiResponseHandler.successResponse(res, message, designations, 200);
    } catch (err) {
        console.log("Error while fetching designations", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }

}

/**
 * Get a designation
 *
 */

exports.getDesignation = async (req, res) => {
    try {
        const designation = await designationService.getDesignation(req.params.id);

        if (!designation) {
            return apiResponseHandler.errorResponse(res, "Designation not found", 404, null);
        }
        const message = "Designation fetched successfully";
        return apiResponseHandler.successResponse(res, message, designation, 200);
    } catch (err) {
        console.log("Error while fetching designation", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);

    }
}

/**
 * Enable a designation
 *
 */

exports.enableDesignation = async (req, res) => {
    try {
        const designation = await designationService.enableDesignation(req.params.id);
        const message = "Designation enabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while enabling designation", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}


/**
 * Disable a designation
 *
 */


exports.disableDesignation = async (req, res) => {
    try {
        const designation = await designationService.disableDesignation(req.params.id);
        const message = "Designation disabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while disabling designation", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Enable designations
 *
 */


exports.enableDesignations = async (req, res) => {
    try {
        await designationService.enableDesignations(req.body.ids);
        const message = "Designations enabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while enabling designations", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}


/**
 * Disable designations
 *
 */


exports.disableDesignations = async (req, res) => {
    try {
        await designationService.disableDesignations(req.body.ids);
        const message = "Designations disabled successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while disabling designations", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}


/**
 * Delete a designation
 *
 */

exports.deleteDesignation = async (req, res) => {
    try {
        await designationService.deleteDesignation(req.params.id);
        const message = "Designation deleted successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while deleting designation", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Delete designations
 *
 */

exports.deleteDesignations = async (req, res) => {
    try {
        await designationService.deleteDesignations(req.body.ids);
        const message = "Designations deleted successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while deleting designations", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Update a designation
 *
 */

exports.updateDesignation = async (req, res) => {
    try {
        const designationReqObj = designationReqObjExtractor.updateDesignationObject(req);
        const designation = await designationService.updateDesignation(req.params.id, designationReqObj);
        const message = "Designation updated successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while updating designation", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}