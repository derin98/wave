exports.successResponse = function (res, message, result, status) {

    status = status || 200;
    return res.status(status).json({
        status,
        message,
        result
    });
};

exports.errorResponse = function (res, message, status, errorInfo) {
    status = status || 500;
    return res.status(status).json({
        status,
        message,
        errorInfo
    });
};