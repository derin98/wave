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
            createdAt.$gte = new Date(createdAtStart);
        }
        if (createdAtEnd) {
            createdAt.$lte = new Date(createdAtEnd);
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
            updatedAt.$gte = new Date(updatedAtStart);
        }
        if (updatedAtEnd) {
            updatedAt.$lte = new Date(updatedAtEnd);
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