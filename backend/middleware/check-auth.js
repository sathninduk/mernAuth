const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
//const User = require("../models/User");


module.exports = {
    isAuthenticated: function (req, res, next) {
        const token = req.headers['x-access-token'];
            //req.body.token ||
            //req.query.token ||
            //req.cookies.token;
        if (!token) {
            res.status(401).send('Unauthorized: No token provided');
        } else {
            jwt.verify(token, keys.secretOrKey, function (err, decoded) {
                if (err) {
                    console.log(err, "error")
                    res.status(401).send('Unauthorized: Invalid token');
                } else {
                    req.id = decoded.id;
                    req.name = decoded.name;
                    req.tel = decoded.tel;
                    req.email = decoded.email;
                    req.role = decoded.role;
                    next();
                }
            });
        }
    },
    getUserData: function (req, res, next) {
        const token = req.headers['x-access-token'];
            //req.body.token ||
            //req.query.token ||
            //req.headers['x-access-token'] ||
            //req.cookies.token;
        if (!token) {
            res.status(401).send('Unauthorized: No token provided');
        } else {
            jwt.verify(token, keys.secretOrKey, function (err, decoded) {
                req.id = decoded.id;
                req.name = decoded.name;
                req.tel = decoded.tel;
                req.email = decoded.email;
                req.role = decoded.role;
                next();
            });
        }
    }
};
