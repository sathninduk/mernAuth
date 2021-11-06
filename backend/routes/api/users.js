const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const keys = require("../../config/keys");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const nodemailer = require("nodemailer");
const cors = require('cors');

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateResetInput = require("../../validation/reset");
const validateForgotInput = require("../../validation/forgot");

// Load User model
const User = require("../../models/User");
const Courses = require("../../models/Courses");
const Forgot = require("../../models/Forgot");

const auth = require("../../middleware/check-auth");
const CORS_URL = require("../../config/keys").CORS_URL;
// CORS
const corsOptions = {
    origin: CORS_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", cors(corsOptions), (req, res) => {
    // Form validation

    const {errors, isValid} = validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email}).then(user => {
        if (user) {
            return res.status(400).json({email: "Email already exists"});
        } else {
            const newUser = new User({
                name: req.body.name,
                tel: req.body.tel,
                role: 3,
                email: req.body.email,
                password: req.body.password
            });

            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", cors(corsOptions), (req, res) => {
    // Form validation

    const {errors, isValid} = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({email: email, status: 1}).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({emailnotfound: "Email not found"});
        }

        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name,
                    tel: user.tel,
                    email: user.email,
                    role: user.role
                };

                // Sign token
                const token = jwt.sign(
                    payload,
                    keys.secretOrKey, {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: token
                        });
                    }
                );


            } else {
                return res
                    .status(400)
                    .json({passwordincorrect: "Password incorrect"});
            }
        });
    });
});

router.post('/forgot', cors(corsOptions), (req, res) => {
    const {errors, isValid} = validateForgotInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let email = req.body.email;

    randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

    function randomString(length, chars) {
        let randString = '';
        for (let i = length; i > 0; --i) randString += chars[Math.floor(Math.random() * chars.length)];
        let codec = randString;

        let randString2 = '';
        for (let i = length; i > 0; --i) randString2 += chars[Math.floor(Math.random() * chars.length)];
        let codec2 = randString2;

        let randId = codec + codec2 + new Date().getTime();

        const forgotReq = new Forgot({
            id: randId,
            email: email
        });

        // Find user by email
        User.findOne({email: email, status: 1}).then(user => {
            // Check if user exists
            if (!user) {
                return res.status(404).json({emailnotfound: "Email not found"});
            } else {
                Forgot.findOne({email: email}).then(forgotReqData => {

                    // async..await is not allowed in global scope, must use a wrapper
                    async function forgotEmail() {
                        let transporter = nodemailer.createTransport({
                            host: keys.MAIL_HOST,
                            port: keys.MAIL_PORT,
                            secure: keys.MAIL_SECURE,
                            requireTLS: keys.MAIL_TLS,
                            auth: {
                                user: keys.MAIL_ACC,
                                pass: keys.MAIL_PW
                            }
                        });

                        let mailOptions = {
                            from: keys.MAIL_ACC,
                            to: email,
                            subject: 'Password recovery link - Votechno Institute',
                            //html: 'Your password recovery link of votechno.lk is ' + keys.PW_URL + 'forgot-change-password?id=' + randId
                            html: '<div><p>Your password recovery link of votechno.lk is</p><br><a href="' + keys.PW_URL + 'forgot-change-password?id=' + randId + '">' + keys.PW_URL + 'forgot-change-password?id=' + randId + '</a></div>'
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return console.log(error.message);
                            }
                            console.log('success');
                        });
                    }


                    // Check if forgot request exist
                    if (!forgotReqData) {


                        forgotReq
                            .save()
                            .then(user => {

                                res.json(user);


                                forgotEmail().then(r => {
                                    return res
                                        .status(200)
                                        .json({requestSent: "Password recovery link sent, Please check your email"});
                                }).catch(err => {
                                    return res
                                        .status(404)
                                        .json({errorsendingemail: "Error while sending email"});
                                })


                            })
                            .catch(err => console.log(err));


                    } else {


                        Forgot.updateOne({email: email}, {id: randId, date: new Date()}).then(updateReq => {
                            forgotEmail().then(r => {
                                return res
                                    .status(200)
                                    .json({requestSent: "Password recovery link sent, Please check your email"});
                            }).catch(err => {
                                return res
                                    .status(404)
                                    .json({errorsendingemail: "Error while sending email"});
                            })
                        }).catch(err => console.log(err));
                    }
                })
            }
        })
    }
})

router.get('/forgot-change-password', cors(corsOptions), (req, res) => {
    let id = req.query.id;

    // Find user by email
    Forgot.findOne({id: id}).then(request => {
        // Check if user exists
        if (!request) {
            return res.status(200).json({msg: 1});
        } else {
            let curTime = new Date();

            let reqDate = request.date,
                expDate = new Date(reqDate);
            expDate.setMinutes(reqDate.getMinutes() + 160);

            if (curTime >= reqDate && curTime <= expDate) {
                let email = request.email;
                User.findOne({email: email, status: 1}).then(user => {
                    // Check if user exists
                    if (!user) {
                        return res.status(200).json({msg: 2});
                    } else {
                        return res.status(200).json({msg: 200});
                    }
                })
            } else {
                return res.status(200).json({msg: 1});
            }
        }
    })
})

router.post('/reset-password', cors(corsOptions), (req, res) => {

    const {errors, isValid} = validateResetInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let id = req.body.tokenId;
    let password = req.body.password;
    let password2 = req.body.password2;

    // Find user by email
    Forgot.findOne({id: id}).then(request => {
        // Check if user exists
        if (!request) {
            // invalid token
            console.log("Invalid token");
            return res
                .status(400)
                .json({invalidtoken: "Invalid Request"});
        } else {
            let email = request.email;
            let curTime = new Date();
            let reqDate = request.date,
                expDate = new Date(reqDate);
            expDate.setMinutes(reqDate.getMinutes() + 160);

            if (curTime >= reqDate && curTime <= expDate) {

                console.log("Cur: " + curTime + ", Req: " + reqDate + ", Exp: " + expDate)

                User.findOne({email: email, status: 1}).then(user => {
                    if (!user) {
                        // no user exist
                        console.log("No user exist");
                        return res
                            .status(400)
                            .json({accountDelete: "Your account has been deleted."});
                    } else {
                        let email = user.email;
                        let role = user.role;
                        if (role === 1) {
                            console.log("Admin password cannot be recovered");
                            return res
                                .status(400)
                                .json({AdminPassword: "Admin password cannot be recovered due to security reasons."});
                        } else {
                            if (password === password2) {
                                // point
                                // Hash password before saving in database
                                bcrypt.genSalt(10, (err, salt) => {
                                    bcrypt.hash(password, salt, (err, hash) => {
                                        if (err) throw err;
                                        password = hash;
                                        User.updateOne({
                                            email: email,
                                            status: 1
                                        }, {password: password}).then(updateReq => {
                                            Forgot.deleteOne({email: email}).then(delReq => {
                                                //return res.status(200).json("Password updated");
                                                return res
                                                    .status(200)
                                                    .json({passwordReset: "Password recovery successful"});
                                            }).catch(err => console.log(err));
                                        }).catch(err => console.log(err));
                                    });
                                });

                            } else {
                                // password mismatch
                                console.log("Password mismatch");
                                return res
                                    .status(400)
                                    .json({passwordMissMatch: "Passwords must match"});
                            }
                        }
                    }
                }).catch(err => console.log(err));
            } else {
                // time expired link
                Forgot.deleteOne({email: email}).then(delReq => {
                    console.log("Expired link");
                    return res
                        .status(400)
                        .json({expiredLink: "Your recovery link has been expired"});
                }).catch(err => console.log(err));
            }
        }
    })
})

module.exports = router;