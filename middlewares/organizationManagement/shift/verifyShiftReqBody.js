/**
 * This file will contain the middlewares for valdiating the shift request body
 */
const ShiftDbOperations = require('../../../dbOperations/mongoDB/organizationManagement/shift/shift.dbOperations');
const apiResponseHandler = require("../../../utils/objectHandlers/apiResponseHandler.js");
const DesignationDbOperations = require("../../../dbOperations/mongoDB/organizationManagement/designation/designation.dbOperations");
const UserDbOperations = require('../../../dbOperations/mongoDB/userManagement/user/user.dbOperations');
const {isValid24HoursTime, isStartTimeLessThanEndTime} = require("../../common/verify24HoursTime.js")
const { shiftModeOfWork } = require("../../../utils/constants");
const { inOffice, remote, hybrid } = shiftModeOfWork;
validateCreateShiftRequestBody = async (req, res, next) => {
    // Validate request
    if (!req.businessUnit || typeof req.businessUnit !== 'string') {
        return apiResponseHandler.errorResponse(
            res,
            "BusinessUnit id must be a non-empty string",
            400,
            null
        );
    }

    else if (!req.body.name || typeof req.body.name !== 'string') {
        return apiResponseHandler.errorResponse(
            res,
            "Shift name must be a non-empty string",
            400,
            null
        );
    }

       // Check if the provided name already exists in the database
       const existingNameShift = await ShiftDbOperations.checkExistingNameForBusinessUnit(req.body.name, req.businessUnit);
       if (existingNameShift) {
           return apiResponseHandler.errorResponse(
               res,
               "Failed! Shift name already exists for the business unit",
               400,
               null
           );
       }

       else if (req.body.isWorkTimeFixed !== undefined) {
        if (typeof req.body.isWorkTimeFixed !== 'boolean') {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Shift isWorkTimeFixed should be a boolean",
                400,
                null
            );
        } else if (req.body.isWorkTimeFixed) {
            if (!req.body.startTime && !req.body.endTime) {
                return apiResponseHandler.errorResponse(
                    res,
                    "Failed! Shift startTime and endTime must be provided if isWorkTimeFixed is true",
                    400,
                    null
                );
            } else if (!req.body.startTime) {
                return apiResponseHandler.errorResponse(
                    res,
                    "Failed! Shift startTime must be provided if isWorkTimeFixed is true",
                    400,
                    null
                );
            } else if (!req.body.endTime) {
                return apiResponseHandler.errorResponse(
                    res,
                    "Failed! Shift endTime must be provided if isWorkTimeFixed is true",
                    400,
                    null
                );
            } else if (!isValid24HoursTime(req.body.startTime)) {
                return apiResponseHandler.errorResponse(
                    res,
                    "Failed! Invalid startTime format. Use HH:mm:ss",
                    400,
                    null
                );
            } else if (!isValid24HoursTime(req.body.endTime)) {
                return apiResponseHandler.errorResponse(
                    res,
                    "Failed! Invalid endTime format. Use HH:mm:ss",
                    400,
                    null
                );
            } else if (!isStartTimeLessThanEndTime(req.body.startTime, req.body.endTime)) {
                return apiResponseHandler.errorResponse(
                    res,
                    "Failed! startTime should be lesser than endTime",
                    400,
                    null
                );
            }
        }
    }

    else if (!req.body.modeOfWork){
        return apiResponseHandler.errorResponse(
            res,
            `Failed! Shift modeOfWork must be provided`,
            400,
            null
        );
    }

    else if (req.body.modeOfWork !== inOffice && req.body.modeOfWork !== remote && req.body.modeOfWork !== hybrid) {
        return apiResponseHandler.errorResponse(
            res,
            `Failed! Shift modeOfWork must be provided and should be one of ${inOffice, remote, hybrid}`,
            400,
            null
        );
    }

    else if (!req.body.defaultClockOutTime) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! Shift defaultClockOutTime must be provided",
            400,
            null
        );
    } 
    else if (!isValid24HoursTime(req.body.defaultClockOutTime)) {
        return apiResponseHandler.errorResponse(
            res,
            "Failed! Invalid defaultClockOutTime format. Use HH:mm:ss",
            400,
            null
        );

    }

    else if (req.body.inOfficeCheckClockInOutLocation !== undefined) {
        if (typeof req.body.inOfficeCheckClockInOutLocation !== 'boolean') {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Shift inOfficeCheckClockInOutLocation should be a boolean",
                400,
                null
            );
        }
    }

    else if (req.body.checkClockInOutLocation !== undefined) {
        if (typeof req.body.checkClockInOutLocation !== 'boolean') {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Shift checkClockInOutLocation should be a boolean",
                400,
                null
            );
        }
    }

    else if (req.body.modeOfWork == inOffice || req.body.modeOfWork == hybrid) {
    if(!req.body.inOfficeDaysPerMonth || typeof req.body.inOfficeDaysPerMonth !== 'object') {
        return apiResponseHandler.errorResponse(
            res,
            "inOfficeDaysPerMonth must be provided as an object",
            400,
            null
        );
    }
}

    else if (req.body.isEnabled !== undefined) {
        if (typeof req.body.isEnabled !== 'boolean') {
            return apiResponseHandler.errorResponse(
                res,
                "Failed! Shift isEnabled should be a boolean",
                400,
                null
            );
        }
}
next();
}

// validateUpdateShiftRequestBody = async (req, res, next) => {
//     // Validate request
//     if (req.body.name){
//         if (typeof req.body.name !== 'string') {
//             return apiResponseHandler.errorResponse(
//                 res,
//                 "BusinessUnit name must be a non-empty string",
//                 400,
//                 null
//             );
//         }

//         let department = req.shiftsObj ? req.shiftsObj.department ? req.shiftsObj.department : req.department : ""
//         const existingNameShift = await ShiftDbOperations.checkExistingNameForBusinessUnit(req.body.name, department);
//         if (existingNameShift) {
//             return apiResponseHandler.errorResponse(
//                 res,
//                 "Failed! Shift name already exists for the business unit",
//                 400,
//                 null
//             );
//         }
//         if (req.body.isEnabled !== undefined) {
//             if (typeof req.body.isEnabled !== 'boolean') {
//                 return apiResponseHandler.errorResponse(
//                     res,
//                     "Failed! BusinessUnit isEnabled should be a boolean",
//                     400,
//                     null
//                 );
//             }
//         }
//     }
//     next();
// }

// validateShift = async (req, res, next) => {
//     // Check if shift is in req.params
//     if(req.params.shift || req.body.shift){
//         if (req.params.shift && typeof req.params.shift === 'string') {
//             req.shift = req.params.shift;
//         }
//         // If not, check if shift is in req.body
//         else if (req.body.shift && typeof req.body.shift === 'string') {
//             req.shift = req.body.shift;
//         }
//         // If department is not in req.params or req.body, return an error response
//         else {
//             return apiResponseHandler.errorResponse(
//                 res,
//                 "Shift id must be a non-empty string in req.params or req.body",
//                 400,
//                 null
//             );
//         }
//         console.log("req.shift", req.shift, req.department)
//         let department = req.department ? req.department : req.userObj ? req.userObj.department ? req.userObj.department : "" : "";
//         let checkExistingShift = await ShiftDbOperations.checkExistingShift(req.shift, req.department);
//         if (!checkExistingShift) {
//             return apiResponseHandler.errorResponse(
//                     res,
//                     "Failed! Shift does not exist",
//                     400,
//                     null
//                 );
//         }
//         else{
//             next()
//         }
//     }
//     else{
//     next()
//     }
// }

// validateShiftAndReturnObj = async (req, res, next) => {

//     // Check if shift is in req.params
//     if(req.params.shift || req.body.shift){
//         if (req.params.shift && typeof req.params.shift === 'string') {
//             req.shift = req.params.shift;
//         }
//         // If not, check if shift is in req.body
//         else if (req.body.shift && typeof req.body.shift === 'string') {
//             req.shift = req.body.shift;
//         }
//         // If department is not in req.params or req.body, return an error response
//         else {
//             return apiResponseHandler.errorResponse(
//                 res,
//                 "Shift id must be a non-empty string in req.params or req.body",
//                 400,
//                 null
//             );
//         }
//         console.log("req.shift", req.shift, req.department)
//         let query = {_id: req.shift}
//         if(req.department) {
//             query.department =req.department
//         }
//         let existingShift = await ShiftDbOperations.getShift(query, "users department");
//         console.log("checkExistingShift", existingShift)
//         if (existingShift){
//             req.shiftObj = existingShift;
//             req.department = existingShift.department
//             next()
//         }

//         else if (!existingShift) {
//             return apiResponseHandler.errorResponse(
//                 res,
//                 "Failed! Shift does not exist",
//                 400,
//                 null
//             );
//         }

//     }
//     else {
//         next()
//     }
// }

// validateShifts = async (req, res, next) => {

//     if (!req.body.shifts || !Array.isArray(req.body.shifts) || req.body.shifts.length === 0) {
//         return apiResponseHandler.errorResponse(
//             res,
//             "Shift ids must be a non-empty array of strings",
//             400,
//             null
//         );
//     }
//     for (let i = 0; i < req.body.shifts.length; i++) {
//         if (typeof req.body.shifts[i] !== 'string') {
//             return apiResponseHandler.errorResponse(
//                 res,
//                 "Shift ids must be a non-empty array of strings",
//                 400,
//                 null
//             );
//         }
//     }

//     let invalidShifts = await ShiftDbOperations.returnInvalidShifts(req.body.shifts, req.department);
//     if (invalidShifts.length > 0) {
//         return apiResponseHandler.errorResponse(
//             res,
//             "Failed! Invalid Shift ids",
//             400,
//             { invalidShifts }
//         );
//     }
//     next();
// }

// validateShiftsFromBodyAndReturnObjs = async (req, res, next) => {

//     if (!req.body.shifts || !Array.isArray(req.body.shifts) || req.body.shifts.length === 0) {
//         return apiResponseHandler.errorResponse(
//             res,
//             "Shift ids must be a non-empty array of strings",
//             400,
//             null
//         );
//     }
//     for (let i = 0; i < req.body.shifts.length; i++) {
//         if (typeof req.body.shifts[i] !== 'string') {
//             return apiResponseHandler.errorResponse(
//                 res,
//                 "Shift ids must be a non-empty array of strings",
//                 400,
//                 null
//             );
//         }
//     }

//     let validAndInvalidShifts = await ShiftDbOperations.returnValidAndInvalidShifts(req.body.shifts, req.department);
//     let invalidShifts = validAndInvalidShifts.invalidShifts;
//     if (invalidShifts.length > 0) {
//         return apiResponseHandler.errorResponse(
//             res,
//             "Failed! Invalid Shift ids",
//             400,
//             { invalidShifts }
//         );
//     }
//     req.shiftsObjs = validAndInvalidShifts.validShifts;
//     next();
// }
// validateShiftsFromQuery = async (req, res, next) => {

//     if(req.query.shifts){
//         //convert the string to array

//         let shifts = req.query.shifts.split(",");

//         if (!shifts || !Array.isArray(shifts) || shifts.length === 0) {
//             return apiResponseHandler.errorResponse(
//                 res,
//                 "Shift ids must be a non-empty string with comma separated values",
//                 400,
//                 null
//             );
//         }

//         let invalidShifts = await ShiftDbOperations.returnInvalidShifts(shifts, req.department);
//         if (invalidShifts.length > 0) {
//             return apiResponseHandler.errorResponse(
//                 res,
//                 "Failed! Invalid Shift ids",
//                 400,
//                 { invalidShifts }
//             );
//         }

//         req.shifts = shifts;
//     }
//     next();
// }

// validateAppendAndRemoveUsersFromBody = async (req, res, next) => {
//     let isValid = true;
//     let message = "";
//     let errorInfo = null

//     //Check if appendUsers and removeUsers are in req.body
//     if (req.body.appendUsers || req.body.removeUsers) {
//         if (req.body.appendUsers && isValid) {
//             if (!Array.isArray(req.body.appendUsers) || req.body.appendUsers.length === 0) {
//                 isValid = false;
//                 message = "appendUsers must be a non-empty array of strings";
//                 errorInfo = null
//             }
//         }
//         if (req.body.removeUsers && isValid) {
//             if (!Array.isArray(req.body.removeUsers) || req.body.removeUsers.length === 0) {
//                 isValid = false;
//                 message = "removeUsers must be a non-empty array of strings";
//                 errorInfo = null
//             }
//         }

//         //return error if user is present in both appendUsers and removeUsers
//         if (req.body.appendUsers && req.body.removeUsers && isValid) {
//             let commonUsers = req.body.appendUsers.filter(user => req.body.removeUsers.includes(user));
//             if (commonUsers.length > 0) {
//                 isValid = false;
//                 message = "Failed! User cannot be present in both appendUsers and removeUsers";
//                 errorInfo = {commonUsers}
//             }
//         }

//         if (req.body.appendUsers && isValid) {
//             for (let i = 0; i < req.body.appendUsers.length; i++) {
//                 if (typeof req.body.appendUsers[i] !== 'string') {
//                     isValid = false;
//                     message = "appendUsers must be a non-empty array of strings";
//                     errorInfo = null
//                 }
//             }
//             let invalidUsers = await UserDbOperations.returnInvalidUserIds(req.body.appendUsers, req.businessUnit, req.department);
//             if (invalidUsers.length > 0) {
//                 isValid = false;
//                 message = "Failed! Invalid User ids";
//                 errorInfo = {invalidUsers}
//             }
//         }
//         if (req.body.appendUsers && isValid) {
//             let usersWithoutShift = await UserDbOperations.returnUsersWithoutShift(req.body.appendUsers, req.businessUnit, req.department);
//             console.log("usersWithoutShift", usersWithoutShift)
//             if (req.body.appendUsers.length !== usersWithoutShift.length) {
//                 isValid = false;
//                 message = "Failed! Some users already have a shift. But you are trying to append them";
//                 //send the users who already have a shift
//                 let usersWithShift = req.body.appendUsers.filter(user => !usersWithoutShift.includes(user));
//                 errorInfo = {usersWithShift}
//             }
//         }
//             if (req.body.removeUsers && isValid) {
//                 for (let i = 0; i < req.body.removeUsers.length; i++) {
//                     if (typeof req.body.removeUsers[i] !== 'string') {
//                         isValid = false;
//                         message = "removeUsers must be a non-empty array of strings",
//                             errorInfo = null
//                     }
//                 }
//                 let invalidUsers = await UserDbOperations.returnInvalidUserIds(req.body.removeUsers, req.businessUnit, req.department);
//                 if (invalidUsers.length > 0) {
//                     isValid = false;
//                     message = "Failed! Invalid User ids";
//                     errorInfo = {invalidUsers}
//                 }
//             }

//             if (req.body.removeUsers && isValid) {
//                 let usersWithSpecificShift = await UserDbOperations.returnUsersWithSpecificShift(req.body.removeUsers, req.shift, req.businessUnit, req.department);
//                 console.log("usersWithSpecificShift", usersWithSpecificShift)
//                 if (req.body.removeUsers.length !== usersWithSpecificShift.length) {
//                     isValid = false;
//                     message = "Failed! Some users doesn't belong to the shift. But you are trying to remove them";
//                     //send the users who do not have the shift
//                     let usersWithoutShift = req.body.removeUsers.filter(user => !usersWithSpecificShift.includes(user));
//                     errorInfo = {usersWithoutShift}
//                 }
//             }

//         if (isValid) {
//             next();
//         } else {
//             return apiResponseHandler.errorResponse(
//                 res,
//                 message,
//                 400,
//                 errorInfo
//             );
//         }
//         } else {
//             next()
//         }
// }

// const verifyShiftReqBody = {
//     validateCreateShiftRequestBody: validateCreateShiftRequestBody,
//     validateUpdateShiftRequestBody: validateUpdateShiftRequestBody,
//     validateShift: validateShift,
//     validateShifts: validateShifts,
//     validateShiftsFromQuery: validateShiftsFromQuery,
//     validateShiftAndReturnObj: validateShiftAndReturnObj,
//     validateAppendAndRemoveUsersFromBody:validateAppendAndRemoveUsersFromBody,
//     validateShiftsFromBodyAndReturnObjs: validateShiftsFromBodyAndReturnObjs
// };


module.exports = verifyShiftReqBody

