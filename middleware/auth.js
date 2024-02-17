const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

// if user trying to get private routes authenticate the route first then allow user to enter in
module.exports.auth = async function(req, res, next, omitSecondFactor=false) {
    token = req.cookies.auth_token;
    if(!token) {
        return res.status(401).json({ok: false, message: 'Unauthorized'});
    }
    try {
        const {username} = jwt.verify(token, process.env.JWT_PRIVATE_TOKEN||"UNSECURED_JWT_PRIVATE_TOKEN");
        const user = await User.find({username: username}, ["id", "username"]);
        if (!user) {
            return res.status(401).json({ok: false, message: 'Sorry, you are not allowed to access this page'});
        }
   
        req.user = user;
        return next();
    } catch (error) {
        return next(error);
    }
}
// if token is valid and user trying to login or register render user to dashboard directly...
module.exports.forwardAuthenticate = async function(req, res, next) {
    token = req.cookies.auth_token;
    if(!token) {
        return next();
    }
    try {
        const {username} = jwt.verify(token, process.env.JWT_PRIVATE_TOKEN || "UNSECURED_JWT_PRIVATE_TOKEN");
        const user = await User.find({username: username});

        if (!user) {
            return next();
        }

        req.user = user;
        return res.status(206).redirect('../vault');
    } catch (error) {
        return next(error);
    }
}
