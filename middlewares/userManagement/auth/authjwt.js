const jwt = require("jsonwebtoken");
const config = require("../../../configs/auth/auth.config");
const User = require("../../../models/mongoDB/userManagement/user/user.model");
const constants = require("../../../utils/constants");


verifyToken = (req, res, next) => {
    // let token = req.headers["x-access-token"];
    const token =req.headers.authorization.split(' ')[1]

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
        req.isSuperAdmin = decoded.isSuperAdmin;
        req.businessUnitId = decoded.businessUnitId;
        console.log("decoded", decoded)
        next();
    });
};

isAdmin = async (req, res, next) => {

    const user = await User.findOne({
        userId: req.userId
    })
    if (user && user.userType == constants.userTypes.admin) {
        next();
    } else {
        res.status(403).send({
            message: "Require Admin Role!"
        });
        return;
    }
};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin
};
module.exports = authJwt;