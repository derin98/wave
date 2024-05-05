/**
 * This is the controller for the designation resource
 */

const designationReqObjExtractor = require('../../../utils/objectHandlers/reqObjExtractors/organizationManagement/designation/designation.reqObjExtractor');
const apiResponseHandler = require('../../../utils/objectHandlers/apiResponseHandler');
const designationManager = require('../../../managers/internalManagers/organizationManagement/designation/designation.managers');
/**
 * Create a designation
 *
 */

exports.createDesignation = async (req, res) => {
    try {
        const designationReqObj = designationReqObjExtractor.createDesignationObject(req);
        const designation = await designationManager.createDesignation(designationReqObj);
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
        const designations = await designationManager.getAllDesignations(req);
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

        let populateFields = req.query.populateFields || undefined;
        let selectFields = req.query.selectFields || undefined;

        const designation = await designationManager.getDesignation(req.params.designation, selectFields, populateFields, req.businessUnit);

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
        const designation = await designationManager.enableDesignation(req.params.designation);
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
        const designation = await designationManager.disableDesignation(req.params.designation);
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
        await designationManager.enableDesignations(req.body.designations);
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
        await designationManager.disableDesignations(req.body.designations);
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
        await designationManager.deleteDesignation(req.params.designation);
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
        await designationManager.deleteDesignations(req.body.designations);
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
        const designation = await designationManager.updateDesignation(req.params.designation, designationReqObj);
        const message = "Designation updated successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while updating designation", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

/**
 * Update designations
 *
 */


exports.updateDesignations = async (req, res) => {
    try {
        const designationReqObj = designationReqObjExtractor.updateDesignationObject(req);
        await designationManager.updateDesignations(req.body.designations);
        const message = "Designations updated successfully";
        return apiResponseHandler.successResponse(res, message, null, 200);
    } catch (err) {
        console.log("Error while updating designations", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}

exports.updateMultipleDesignations = async (req, res) => {
    try {

        const designations = await designationManager.updateDesignations(req);
        if (designations.modifiedCount === req.body.designations.length) {
            const message = "Designations updated successfully";
            return apiResponseHandler.successResponse(res, message, null, 200);
        } else {
            return apiResponseHandler.errorResponse(res, "Some user permissions failed to update", 500, null);
        }
    } catch (err) {
        console.log("Error while updating designations", err.message);
        return apiResponseHandler.errorResponse(res, "Some internal server error", 500, null);
    }
}