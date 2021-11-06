const express = require("express");
const router = express.Router();
const fs = require('fs');
const multer = require('multer')
const {v4: uuidV4} = require('uuid');
const cors = require('cors')

// Load User model
// const User = require("../../models/User");
const Courses = require("../../models/Courses");
const Lessons = require("../../models/Lessons");
const Topics = require("../../models/Topics");
const Payments = require("../../models/Payments");

// middleware
const auth = require('../../middleware/check-auth');
const {m} = require("caniuse-lite/data/browserVersions");
const validateChangePasswordInput = require("../../validation/change-pw");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const Past = require("../../models/Past");
const Team = require("../../models/Team");

// validation
//const validateCourseInput = require("../../validation/course");

const CORS_URL = require("../../config/keys").CORS_URL;
// CORS
const corsOptions = {
    origin: CORS_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// multer
const DIR = 'public/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const exploded_name = file.originalname.split(".")//toLowerCase().split(' ').join('-');
        let ext = exploded_name[exploded_name.length - 1];
        const newName = uuidV4() + '-' + new Date().getTime() + '.' + ext;
        cb(null, newName)
    }
});


// courses
// get courses information
router.route('/courses').get(cors(corsOptions), auth.isAuthenticated, (req, res, next) => {
    if (req.role == 3) {
        Courses.find({status: 1}, (error, data) => {
            if (error) {
                return (error)
            } else {
                res.json(data)
                //next()
            }
        }).sort({name: 1})
    }
})

// public courses
// get courses information publicly
router.route('/pub-courses').get((req, res, next) => {
    Courses.find({status: 1}, (error, data) => {
        if (error) {
            return (error)
        } else {
            res.json(data)
            //next()
        }
    }).sort({name: 1})
})

// get courses information
router.route('/course').get(cors(corsOptions), auth.isAuthenticated, (req, res, next) => {
    if (req.role == 3) {
        Courses.find({_id: req.query.course, status: 1}, (error, data) => {
            if (error) {
                return (error)
            } else {
                res.json(data)
                //next()
            }
        }).limit(1)
    }
})

// get courses information
router.route('/m-course').get(cors(corsOptions), auth.isAuthenticated, (req, res, next) => {
    if (req.role == 3) {
        Payments.find({course: req.query.course, user_id: req.id, status: 1}, (error1, data1) => {
            if (error1) {
                return (error1)
            } else {
                if (data1[0]) {
                    Courses.find({_id: req.query.course, status: 1}, (error, data) => {
                        if (error) {
                            return (error)
                        } else {
                            res.json(data)
                            //next()
                        }
                    }).limit(1)
                } else {
                    Courses.find({_id: req.query.course, fee: 0, status: 1}, (error4, data4) => {
                        if (error4) {
                            return (error4)
                        } else {
                            if (data4[0]) {
                                res.json(data4)
                                //next()
                            } else {
                                res.status(404)
                            }
                        }
                    }).limit(1)
                }
            }
        }).limit(1)
    }
})

let upload = multer({
    storage: storage,
    limits: {fileSize: 5000000},
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// course payment
router.route('/payment').post(cors(corsOptions), auth.isAuthenticated, upload.single('slip'), (req, res, next) => {
    if (req.role == 3) {

        let fileName = req.file.filename;
        let mime = req.file.mimetype;
        let size = req.file.size;

        if (size <= 5000000) {
            if (mime == 'image/jpeg' || mime == 'image/jpg' || mime == 'image/png') {

                const addPayment = new Payments({
                    course: req.body.course,
                    user: req.name,
                    tel: req.tel,
                    email: req.email,
                    user_id: req.id,
                    file: fileName,
                    date: new Date()
                });
                addPayment.save()
                    .then(response => {
                        console.log("saved");
                        return res
                            .status(200)
                            .json(response);
                    }).catch(err => {
                    console.log(err);
                    return res
                        .status(404)
                        .json({internalError: "Error saving payment"});
                })
            } else {
                return res
                    .status(404)
                    .json({file: "Invalid file type"});
            }
        } else {
            return res
                .status(404)
                .json({file: "The file size should be less than 5MB"});
        }
    }
})
// get payment check
router.route('/payment-check').get(cors(corsOptions), auth.isAuthenticated, (req, res, next) => {
    if (req.role == 3) {
        Payments.find({course: req.query.course, user_id: req.id}, (error, data) => {
            if (error) {
                return (error)
            } else {
                res.json(data)
                //next()
            }
        }).limit(1)
    }
})

// delete payment
router.route('/delete-payment').post(cors(corsOptions), auth.isAuthenticated, async (req, res, next) => {
    if (req.role == 3) {
        let course = req.body.course;
        await Payments.find({course: course, user_id: req.id}).limit(1).then(async data => {
            let file = data[0].file
            await Payments.deleteOne({course: course, user_id: req.id}).then(async data => {
                res.json(data)
                await fs.unlink(DIR + "/" + file, err => {
                    if (err) console.log(err);
                    else {
                        console.log("File Deleted");
                    }
                });
            }).catch(error => {
                return (error)
            })
        }).catch(err => {
            res.status(404).json(err)
        })
    }
})


// Lessons
// get lessons information
router.route('/lessons').get(cors(corsOptions), auth.isAuthenticated, (req, res, next) => {
    if (req.role == 3) {
        Payments.find({course: req.query.course, user_id: req.id, status: 1}, (error1, data1) => {
            if (error1) {
                return (error1)
            } else {
                if (data1[0]) {
                    let course = req.query.course;
                    Lessons.find({course: course}, (error, data) => {
                        if (error) {
                            return (error)
                        } else {
                            res.json(data)
                            //next()
                        }
                    }).sort({position: 1})
                } else {
                    Courses.find({_id: req.query.course, fee: 0, status: 1}, (error4, data4) => {
                        if (error4) {
                            return (error4)
                        } else {
                            if (data4[0]) {
                                Lessons.find({course: req.query.course}, (error6, data6) => {
                                    if (error6) {
                                        return (error6)
                                    } else {
                                        if (data6[0]) {
                                            res.json(data6)
                                            //next()
                                        } else {
                                            res.status(404)
                                        }
                                    }
                                }).sort({position: 1})
                            } else {
                                res.status(404)
                            }
                        }
                    }).limit(1)
                }
            }
        }).limit(1)
    }
})


// Topics
// get topic information
router.route('/topics').get(cors(corsOptions), auth.isAuthenticated, (req, res, next) => {
    if (req.role == 3) {
        Payments.find({course: req.query.course, user_id: req.id, status: 1}, (error1, data1) => {
            if (error1) {
                return (error1)
            } else {
                if (data1[0]) {
                    let course = req.query.course;
                    Topics.find({course: course}, (error, data) => {
                        if (error) {
                            return (error)
                        } else {
                            res.json(data)
                            //next()
                        }
                    }).sort({position: 1})
                } else {
                    Courses.find({_id: req.query.course, fee: 0, status: 1}, (error4, data4) => {
                        if (error4) {
                            return (error4)
                        } else {
                            if (data4[0]) {
                                let course = req.query.course;
                                Topics.find({course: course}, (error, data) => {
                                    if (error) {
                                        return (error)
                                    } else {
                                        res.json(data)
                                        //next()
                                    }
                                }).sort({position: 1})


                            } else {
                                res.status(404)
                            }
                        }
                    })
                }
            }
        }).limit(1)
    }
})

// get first topic information
router.route('/topics/first').get(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 3) {
        let course = req.query.course;
        Payments.find({course: req.query.course, user_id: req.id, status: 1}, (error1, data1) => {
            if (error1) {
                return (error1)
            } else {
                if (data1[0]) {
                    Lessons.find({course: course}).sort({position: 1}).limit(1).then(data11 => {
                        let lesson = data11[0]._id
                        Topics.find({lesson: lesson}).sort({position: 1}).limit(1).then(data12 => {
                            res.status(200).json(data12[0]._id)
                        }).catch(err12 => {
                            res.status(404).json(err12)
                        })
                    }).catch(err11 => {
                        res.status(404).json(err11)
                    })
                } else {
                    Courses.find({_id: req.query.course, fee: 0, status: 1}, (error4, data4) => {
                        if (error4) {
                            return (error4)
                        } else {
                            if (data4[0]) {
                                Lessons.find({course: course}).sort({position: 1}).limit(1).then(data11 => {
                                    let lesson = data11[0]._id
                                    Topics.find({lesson: lesson}).sort({position: 1}).limit(1).then(data12 => {
                                        res.status(200).json(data12[0]._id)
                                    }).catch(err12 => {
                                        res.status(404).json(err12)
                                    })
                                }).catch(err11 => {
                                    res.status(404).json(err11)
                                })
                            } else {
                                res.status(404)
                            }
                        }
                    })
                }
            }
        }).limit(1)
    }
})

// get first lesson information
router.route('/lessons/first').get(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 3) {
        let course = req.query.id;
        Payments.find({course: req.query.id, user_id: req.id, status: 1}, (error1, data1) => {
            if (error1) {
                return (error1)
            } else {
                if (data1[0]) {
                    Lessons.find({course: course}).sort({position: 1}).limit(1).then(data => {
                        res.json(data)
                    }).catch(error => {
                        return (error)
                    })
                } else {
                    res.status(404)
                }
            }
        }).limit(1)
    }
})

// get last topic information
router.route('/topics/last').get(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 3) {
        let lesson = req.query.id;
        Topics.find({lesson: lesson}).sort({position: -1}).limit(1).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(404).json(err)
        })
    }
})

// get last lesson information
router.route('/lessons/last').get(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 3) {
        let course = req.query.id;
        Payments.find({course: req.query.id, user_id: req.id, status: 1}, (error1, data1) => {
            if (error1) {
                return (error1)
            } else {
                if (data1[0]) {
                    Lessons.find({course: course}).sort({position: -1}).limit(1).then(data => {
                        res.json(data)
                    }).catch(error => {
                        return (error)
                    })
                } else {
                    res.status(404)
                }
            }
        }).limit(1)
    }
})

// get display topic information
router.route('/topic').get(cors(corsOptions), auth.isAuthenticated, (req, res, next) => {
    if (req.role == 3) {
        Payments.find({course: req.query.course, user_id: req.id, status: 1}, (error1, data1) => {
            if (error1) {
                return (error1)
            } else {
                if (data1[0]) {
                    let topic = req.query.topic;
                    Topics.find({_id: topic}, (error, data) => {
                        if (error) {
                            return (error)
                        } else {
                            res.json(data)
                            //next()
                        }
                    }).limit(1)
                } else {
                    Courses.find({_id: req.query.course, fee: 0, status: 1}, (error4, data4) => {
                        if (error4) {
                            return (error4)
                        } else {
                            if (data4[0]) {
                                let topic = req.query.topic;
                                Topics.find({_id: topic}, (error, data) => {
                                    if (error) {
                                        return (error)
                                    } else {
                                        res.json(data)
                                        //next()
                                    }
                                }).limit(1)
                            } else {
                                res.status(404)
                            }
                        }
                    })
                }
            }
        }).limit(1)
    }
})

// user/settings - change password
router.route('/settings/password').post(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 3) {

        const {errors, isValid} = validateChangePasswordInput(req.body);

        // Check validation
        if (!isValid) {
            console.log(errors);
            return res.status(400).json(errors);
        }


        let id = req.id;
        let curPassword = req.body.curPassword;
        let password = req.body.password;
        let confirmPassword = req.body.confirmPassword;
        if (password == confirmPassword) {


            // Find user by email
            User.findOne({_id: id, status: 1}).then(user => {
                // Check if user exists
                if (!user) {
                    return res.status(404).json({curPassword: "User not found"});
                }
                // Check password
                bcrypt.compare(curPassword, user.password).then(isMatch => {
                    if (isMatch) {

                        // Hash password before saving in database
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(password, salt, (err, hash) => {
                                if (err) throw err;
                                password = hash;
                                User.updateOne({_id: id}, {
                                    password: password
                                }).then(async data1 => {
                                    res.status(200).json(data1);
                                }).catch(err1 => {
                                    res.status(404).json(err1)
                                })
                            });
                        });

                    } else {
                        return res
                            .status(400)
                            .json({curPassword: "Password incorrect"});
                    }
                });
            });
        } else {
            res.status(400).json({confPassword: "Password mismatch"});
        }
    }
})


// past
router.route('/home/past').get(cors(corsOptions), (req, res) => {
    Past.find({}).then((data3) => {
        res.status(200).json(data3)
    }).catch((error3) => {
        console.log(error3);
        return res
            .status(404)
            .json({internalError: "Unexpected error occurred! Please try again."});
    })
})


// team
router.route('/home/team').get(cors(corsOptions), (req, res) => {
    Team.find({}).then((data3) => {
        res.status(200).json(data3)
    }).catch((error3) => {
        console.log(error3);
        return res
            .status(404)
            .json({internalError: "Unexpected error occurred! Please try again."});
    })
})

// on-demand
router.route('/home/courses').get(cors(corsOptions), (req, res) => {

    Courses.find({}).limit(10).sort({onDemand: -1}).then((data3) => {
        res.status(200).json(data3)
    }).catch((error3) => {
        console.log(error3);
        return res
            .status(404)
            .json({internalError: "Unexpected error occurred! Please try again."});
    })

})


module.exports = router;