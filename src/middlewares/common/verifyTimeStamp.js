const {errorResponse} = require("../../utils/objectHandlers/apiResponseHandler");


validateCreatedAtFromQueryForSearch = async (req, res, next) => {

    if(req.query.createdAt) {
        //convert the string to array

        let createdAt = req.query.createdAt.split(",");

        if (!createdAt || !Array.isArray(createdAt) || createdAt.length === 0) {
            return errorResponse(
                res,
                "CreatedAt must be a non-empty string with comma separated values",
                400,
                null
            );
        }
        let createdAtStart = new Date(createdAt[0]);
        let createdAtEnd = new Date(createdAt[1]);

        createdAt = {};

        if (createdAtStart) {
            createdAt.$gte = createdAtStart;
        }
        if (createdAtEnd) {
            createdAt.$lte = createdAtEnd;
        }
        console.log("createdAt", createdAt)
        if (createdAtStart == "Invalid Date" || createdAtEnd == "Invalid Date") {
            return errorResponse(
                res,
                "CreatedAt must be a non-empty string of date with comma separated values",
                400,
                null
            );
        }
        req.createdAt = createdAt;
    }



    next();
}

validateUpdatedAtFromQueryForSearch = async (req, res, next) => {

    if(req.query.updatedAt) {
        //convert the string to array

        let updatedAt = req.query.updatedAt.split(",");

        if (!updatedAt || !Array.isArray(updatedAt) || updatedAt.length === 0) {
            return errorResponse(
                res,
                "UpdatedAt must be a non-empty string with comma separated values",
                400,
                null
            );
        }
        let updatedAtStart = new Date(updatedAt[0]);
        let updatedAtEnd = new Date(updatedAt[1]);

        updatedAt = {};

        if (updatedAtStart) {
            updatedAt.$gte = updatedAtStart;
        }
        if (updatedAtEnd) {
            updatedAt.$lte = updatedAtEnd;
        }
        console.log("updatedAt", updatedAt)
            if (updatedAtStart == "Invalid Date" || updatedAtEnd == "Invalid Date") {
                return errorResponse(
                    res,
                    "UpdatedAt must be a non-empty string of date with comma separated values",
                    400,
                    null
                );
            }
        req.updatedAt = updatedAt;
    }


    next();
}



const verifyTimeStamp = {

    validateCreatedAtFromQueryForSearch: validateCreatedAtFromQueryForSearch,
    validateUpdatedAtFromQueryForSearch: validateUpdatedAtFromQueryForSearch

};
module.exports = verifyTimeStamp