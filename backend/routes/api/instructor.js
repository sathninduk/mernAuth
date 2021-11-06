const express = require("express");
const router = express.Router();

// Load models
const User = require("../../models/User");
const Courses = require("../../models/Courses");
const Lessons = require("../../models/Lessons");
const Topics = require("../../models/Topics");
const Payments = require("../../models/Payments");
const Assign = require("../../models/Assign");

// middleware
const auth = require('../../middleware/check-auth');
const fs = require("fs");
const bcrypt = require("bcryptjs");
const cors = require('cors')

// validation
const validateRegisterInput = require("../../validation/register");
const validateChangePasswordInput = require("../../validation/change-pw");
const validateCourseAddInput = require("../../validation/course");
const validateZoomInput = require("../../validation/zoom");
const validateLessonAddInput = require("../../validation/newLesson");
const validateLessonEditInput = require("../../validation/editLesson");
const validateTopicAddInput = require("../../validation/newTopic");
const validateTopicEditInput = require("../../validation/editTopic");
//const validateTopicVideoInput = require("../../validation/topicVideo");

const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// validation
//const validateCourseInput = require("../../validation/course");
const CORS_URL = require("../../config/keys").CORS_URL;
// CORS
const corsOptions = {
    origin: CORS_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// courses
// create new course
router.route('/courses').post(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 2) {

        const {errors, isValid} = validateCourseAddInput(req.body);

        // Check validation
        if (!isValid) {
            console.log(errors);
            return res.status(400).json(errors);
        }

        const addCourse = new Courses({
            name: req.body.name,
            summary: req.body.summary,
            fee: parseInt(req.body.fee),
            date: new Date()
        });

        addCourse.save()
            .then(async response => {

                console.log(response);

                const assign = new Assign({
                    instructor: req.id,
                    course: response._id
                });

                await assign.save()
                    .then(response2 => {
                        console.log(response2);
                        return res
                            .status(200)
                            .json(response2);
                    }).catch(err2 => {
                        console.log(err2);
                        return res
                            .status(404)
                            .json({internalError: "Unexpected error occurred! Please try again."});
                    })

            }).catch(err => {
            console.log(err);
            return res
                .status(404)
                .json({internalError: "Unexpected error occurred! Please try again."});
        })
    }
})

// get courses information
router.route('/courses').get(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 2) {
        Assign.find({instructor: req.id}).then(assignData => {
            if (assignData[0]) {
                let assignDataArray = [];
                for (let i = 0; i < assignData.length; i++) {
                    let assignDataOut = assignData[i].course;
                    assignDataArray.push({_id: assignDataOut});
                }
                Courses.find({$or: assignDataArray}, (error, data) => {
                    if (error) {
                        return (error)
                    } else {
                        res.json(data)
                    }
                }).sort({name: 1})
            } else {
                res.json({data: []})
            }
        }).catch(errAssign => {
            console.log(errAssign);
            res.status(401).json({internalError: "Unexpected error occurred! Please"})
        })
    }
})

// get course edit information
router.route('/course').get(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 2) {
        let id = req.query.id;
        Assign.find({instructor: req.id, course: id}).then(async assignData => {
            if (assignData[0]) {
                Courses.find({_id: id}, (error, data) => {
                    if (error) {
                        return (error)
                    } else {
                        res.json(data)
                    }
                }).limit(1)
            } else {
                res.json({data: []})
            }
        }).catch(errAssign => {
            console.log(errAssign);
            res.status(401).json({internalError: "Unexpected error occurred! Please"})
        })
    }
})

// update course information
router.route('/course/update').post(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 2) {
        const {errors, isValid} = validateCourseAddInput(req.body);
        // Check validation
        if (!isValid) {
            console.log(errors);
            return res.status(400).json(errors);
        }
        let id = req.query.id;
        let name = req.body.name;
        let summary = req.body.summary;
        let fee = parseInt(req.body.fee);
        Courses.updateOne({_id: id}, {name: name, summary: summary, fee: fee}, (error, data) => {
            if (error) {
                return (error)
            } else {
                res.json(data)
            }
        })
    }
})

// delete course information
router.route('/course/delete').post(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 2) {
        let id = req.query.id;
        let courseName = req.body.course;
        // get lessons count
        Lessons.countDocuments({course: id}).then(async data1 => {
            //res.json(data1)
            if (data1 > 0) {
                console.log("Deletion aborted due to remaining lessons");
            } else if (data1 == 0) {


                await Assign.deleteMany({course: id}).then(async data7 => {


                await Payments.updateMany({course: id}, {course: String(courseName), status: 4}).then(async data3 => {
                    // delete course
                    await Courses.deleteOne({_id: id}).then(data => {
                        res.json(data)
                    }).catch(error => {
                        console.log(error);
                        return res
                            .status(404)
                            .json({internalError: "Unexpected error occurred! Please try again."});
                    })
                }).catch(err3 => {
                    console.log(err3);
                    return res
                        .status(404)
                        .json({internalError: "Unexpected error occurred! Please try again."});
                })



                }).catch(async err7 => {
                    console.log(err7);
                    return res
                        .status(404)
                        .json({internalError: "Unexpected error occurred! Please try again."});
                })




            }
        }).catch(error1 => {
            console.log(error1);
            return res
                .status(404)
                .json({internalError: "Unexpected error occurred! Please try again."});
        })
    }
})


// Lessons
// create new lesson
router.route('/lessons/new').post(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 2) {

        const {errors, isValid} = validateLessonAddInput(req.body);

        // Check validation
        if (!isValid) {
            console.log(errors);
            return res.status(400).json(errors);
        }

        const position = parseInt(req.body.position)
        const courseId = req.query.id;
        //console.log(position);

        Lessons.find({course: courseId, position: position}).limit(1).then(async res1 => {
            if (res1[0]) {
                console.log("exist");

                await Lessons.find({course: courseId}).sort({position: -1}).limit(1).then(async res2 => {

                    let lastPosition = parseInt(res2[0].position);
                    console.log(lastPosition);

                    for (let i = lastPosition; i >= position; i--) {
                        console.log("Before - Position: " + position + ", lastPosition: " + lastPosition + ", i: " + i)

                        await Lessons.updateOne({course: courseId, position: i}, {
                            position: (i + 1)
                        }).then(res3 => {
                            //console.log(res3);
                            console.log("Updated - Position: " + position + ", lastPosition: " + lastPosition + ", i: " + i)
                            if (i == position) {
                                // saved
                                console.log("saved");
                                // incoming data
                                const addLesson = new Lessons({
                                    lesson: req.body.lesson,
                                    course: req.query.id,
                                    position: req.body.position,
                                    date: new Date()
                                });
                                // save
                                addLesson.save()
                                    .then(response => {
                                        return res
                                            .status(200)
                                            .json(response);
                                    }).catch(err => {
                                    console.log(err);
                                    return res
                                        .status(404)
                                        .json({internalError: "Unexpected error occurred! Please try again."});
                                })
                            }
                        }).catch(err3 => {
                            console.log(err3);
                            return res
                                .status(404)
                                .json({internalError: "Unexpected error occurred! Please try again."});
                        })
                    }
                }).catch(err2 => {
                    console.log(err2)
                    return res
                        .status(404)
                        .json({internalError: "Unexpected error occurred! Please try again."});
                })
            } else {
                console.log("clear");
                // incoming data
                const addLesson = new Lessons({
                    lesson: req.body.lesson,
                    course: req.query.id,
                    position: req.body.position,
                    date: new Date()
                });

                // save
                addLesson.save()
                    .then(response => {
                        return res
                            .status(200)
                            .json(response);
                    }).catch(err => {
                    console.log(err);
                    return res
                        .status(404)
                        .json({internalError: "Unexpected error occurred! Please try again."});
                })
            }
        }).catch(err1 => {
            console.log(err1);
            return res
                .status(404)
                .json({internalError: "Unexpected error occurred! Please try again."});
        })
    }
})

// get lessons information
router.route('/lessons').get(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 2) {
        let course = req.query.id;
        Assign.find({instructor: req.id, course: course}).then(async assignData => {
            if (assignData[0]) {
                Lessons.find({course: course}, (error, data) => {
                    if (error) {
                        return (error)
                    } else {
                        res.json(data)
                    }
                }).sort({position: 1})
            }
        }).catch(errAssign => {
            console.log(errAssign);
            res.status(401).json({internalError: "Unexpected error occurred! Please"})
        })

    }
})

// get first lesson information
router.route('/lessons/first').get(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 2) {
        let course = req.query.id;
        Lessons.find({course: course}).sort({position: 1}).limit(1).then(data => {
            res.json(data)
        }).catch(error => {
            console.log(error);
            return res
                .status(404)
                .json({internalError: "Unexpected error occurred! Please try again."});
        })
    }
})

// get last lesson information
router.route('/lessons/last').get(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 2) {
        let course = req.query.id;
        Lessons.find({course: course}).sort({position: -1}).limit(1).then(data => {
            res.json(data)
        }).catch(error => {
            console.log(error);
            return res
                .status(404)
                .json({internalError: "Unexpected error occurred! Please try again."});
        })
    }
})

// get lessons count
router.route('/lessons/count').get(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 2) {
        let course = req.query.id;
        Lessons.countDocuments({course: course}).then(data => {
            res.json(data)
        }).catch(error => {
            console.log(error);
            return res
                .status(404)
                .json({internalError: "Unexpected error occurred! Please try again."});
        })
    }
})

// get lesson edit information
router.route('/lesson').get(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 2) {
        let id = req.query.id;
        Lessons.find({_id: id}, (error, data) => {
            if (error) {
                return (error)
            } else {
                res.json(data)
            }
        }).limit(1)
    }
})

// update lesson information
router.route('/lesson/update').post(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 2) {

        const {errors, isValid} = validateLessonEditInput(req.body);

        // Check validation
        if (!isValid) {
            console.log(errors);
            return res.status(400).json(errors);
        }
        let id = req.query.id;
        let lesson = req.body.lesson;
        let position = req.body.position;

        Lessons.updateOne({_id: id}, {lesson: lesson, position: position}, (error, data) => {
            if (error) {
                return (error)
            } else {
                res.json(data)
            }
        })
    }
})

// delete lesson information
router.route('/lesson/delete').post(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 2) {
        let id = req.query.id;
        // delete here
        Topics.deleteMany({lesson: id}).then(res7 => {
            //console.log(res7);
            Lessons.deleteOne({_id: id}).then(res8 => {
                //console.log(res8);
                console.log("Full delete")
            }).catch(err8 => {
                console.log(err8);
                return res
                    .status(404)
                    .json({internalError: "Unexpected error occurred! Please try again."});
            })
        }).catch(err7 => {
            console.log(err7);
            return res
                .status(404)
                .json({internalError: "Unexpected error occurred! Please try again."});
        })
    }
})

// Topics
// create new topic -
router.route('/topics/new').post(cors(corsOptions), auth.isAuthenticated, async (req, res) => {
    if (req.role == 2) {

        const {errors, isValid} = validateTopicAddInput(req.body);

        // Check validation
        if (!isValid) {
            console.log(errors);
            return res.status(400).json(errors);
        }

        let id = req.query.id;
        await Lessons.find({_id: id}).limit(1).then(async data => {

            let course = data[0].course;
            const position = req.body.position

            console.log("Req Position: " + position);

            let videoUrl = req.body.video;
            let videoUrl2 = videoUrl.replace("https://youtu.be/", "https://www.youtube.com/embed/");
            let videoUrl3 = videoUrl2.replace("https://www.youtube.com/watch?v=", "https://www.youtube.com/embed/");
            const videoCompiledUrl = videoUrl3.replace("https://vimeo.com/", "https://player.vimeo.com/video/");

            await Topics.find({course: course, lesson: id, position: position}).limit(1).then(async res1 => {
                if (res1[0]) {
                    console.log("exist");
                    await Topics.find({course: course, lesson: id}).sort({position: -1}).limit(1).then(async res2 => {
                        let lastPosition = parseInt(res2[0].position);
                        console.log("Last position: " + lastPosition);
                        for (let i = lastPosition; i >= position; i--) {
                            console.log("Before - Position: " + position + ", lastPosition: " + lastPosition + ", i: " + i)
                            await Topics.updateOne({course: course, lesson: id, position: i}, {
                                position: i + 1
                            }).then(async res3 => {
                                //console.log(data);
                                console.log("Updated - Position: " + position + ", lastPosition: " + lastPosition + ", i: " + i)
                                if (i == position) {
                                    // saved
                                    // incoming data
                                    const addCourse = new Topics({
                                        topic: req.body.topic,
                                        lesson: req.query.id,
                                        course: course,
                                        video: videoCompiledUrl,
                                        position: req.body.position,
                                        date: new Date()
                                    });
                                    await addCourse.save()
                                        .then(response => {
                                            //console.log(response);
                                            console.log("saved");
                                            return res.status(200).json(course)
                                        }).catch(err => {
                                            console.log(err);
                                            return res
                                                .status(404)
                                                .json({internalError: "Unexpected error occurred! Please try again."});
                                        })
                                }
                            }).catch(err7 => {
                                console.log(err7);
                                return res
                                    .status(404)
                                    .json({internalError: "Unexpected error occurred! Please try again."});
                            })
                        }
                    }).catch(err2 => {
                        console.log(err2);
                        return res
                            .status(404)
                            .json({internalError: "Unexpected error occurred! Please try again."});
                    })
                } else {
                    console.log("clear")
                    const addLesson = new Topics({
                        topic: req.body.topic,
                        lesson: req.query.id,
                        course: course,
                        video: videoCompiledUrl,
                        position: req.body.position,
                        date: new Date()
                    });
                    await addLesson.save()
                        .then(response => {
                            //console.log(response)
                            return res
                                .status(200)
                                .json(course);
                        }).catch(err => {
                            console.log(err);
                            return res
                                .status(404)
                                .json({internalError: "Unexpected error occurred! Please try again."});
                        })
                }
            }).catch(err1 => {
                console.log(err1);
                return res
                    .status(404)
                    .json({internalError: "Unexpected error occurred! Please try again."});
            })
        }).catch(err10 => {
            console.log(err10);
            return res
                .status(404)
                .json({internalError: "Unexpected error occurred! Please try again."});
        })
    }
})


// get topic information
router.route('/topics').get(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 2) {
        let lesson = req.query.id;
        Topics.find({lesson: lesson}).sort({position: 1}).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            console.log(err);
            return res
                .status(404)
                .json({internalError: "Unexpected error occurred! Please try again."});
        })
    }
})

// get first topic information
router.route('/topics/first').get(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 2) {
        let lesson = req.query.id;
        Topics.find({lesson: lesson}).sort({position: 1}).limit(1).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            console.log(err);
            return res
                .status(404)
                .json({internalError: "Unexpected error occurred! Please try again."});
        })
    }
})

// get last topic information
router.route('/topics/last').get(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 2) {
        let lesson = req.query.id;
        Topics.find({lesson: lesson}).sort({position: -1}).limit(1).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            console.log(err);
            return res
                .status(404)
                .json({internalError: "Unexpected error occurred! Please try again."});
        })
    }
})

// get topics by course information
router.route('/topicsByCourse').get(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 2) {
        let course = req.query.id;
        Topics.find({course: course}, (error, data) => {
            if (error) {
                return (error)
            } else {
                res.json(data)
            }
        }).sort({position: 1})
    }
})

// get topic edit information -
router.route('/topic').get(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 2) {
        let id = req.query.id;
        Topics.find({_id: id}, (error, data) => {
            if (error) {
                return (error)
            } else {
                res.json(data)
            }
        }).limit(1)
    }
})

// update topic information -
router.route('/topic/update').post(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 2) {
        const {errors, isValid} = validateTopicEditInput(req.body);
        // Check validation
        if (!isValid) {
            console.log(errors);
            return res.status(400).json(errors);
        }
        let id = req.query.id;
        let videoUrl = req.body.video
        let videoUrl2 = videoUrl.replace("https://youtu.be/", "https://www.youtube.com/embed/");
        let videoUrl3 = videoUrl2.replace("https://www.youtube.com/watch?v=", "https://www.youtube.com/embed/");
        const videoCompiledUrl = videoUrl3.replace("https://vimeo.com/", "https://player.vimeo.com/video/");
        let topic = req.body.topic;
        let video = videoCompiledUrl;
        let position = req.body.position;
        Topics.updateOne({_id: id}, {topic: topic, video: video, position: position}, (error, data) => {
            if (error) {
                return (error)
            } else {
                res.json(data)
            }
        })
    }
})

// delete topic information -
router.route('/topic/delete').post(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 2) {
        let id = req.query.id;
        Topics.deleteOne({_id: id}, (error, data) => {
            if (error) {
                return (error)
            } else {
                res.json(data)
            }
        })

    }
})


// update course zoom
router.route('/zoom/new').post(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 2) {

        const {errors, isValid} = validateZoomInput(req.body);

        // Check validation
        if (!isValid) {
            console.log(errors);
            return res.status(400).json(errors);
        }

        let course = req.query.course;
        let zoom = req.body.link;
        let start = req.body.start;
        let end = req.body.end;

        console.log("start: " + start)
        console.log("end: " + end)

        Assign.find({instructor: req.id, course: course}).then(async assignData => {
            if (assignData[0]) {
                Courses.updateOne({_id: course}, {zoom: zoom, zoomStart: start, zoomEnd: end}).then(data => {
                    res.json(data)
                }).catch(error => {
                    console.log(error);
                    return res
                        .status(404)
                        .json({internalError: "Unexpected error occurred! Please try again."});
                })
            }
        }).catch(errAssign => {
            console.log(errAssign);
            res.status(401).json({internalError: "Unexpected error occurred! Please"})
        })
    }
})


// update course zoom
router.route('/zoom/delete').post(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 2) {
        let course = req.query.course;
        Assign.find({instructor: req.id, course: course}).then(async assignData => {
            if (assignData[0]) {
                Courses.updateOne({_id: course}, {zoom: "", zoomStart: "", zoomEnd: ""}).then(data => {
                    res.json(data)
                }).catch(error => {
                    console.log(error);
                    return res
                        .status(404)
                        .json({internalError: "Unexpected error occurred! Please try again."});
                })
            }
        }).catch(errAssign => {
            console.log(errAssign);
            res.status(401).json({internalError: "Unexpected error occurred! Please"})
        })
    }
})

// courses management
// course - disable
router.route('/course/disable').post(cors(corsOptions), auth.isAuthenticated, async (req, res) => {
    if (req.role == 2) {
        let id = req.body.id;
        Assign.find({instructor: req.id, course: id}).then(async assignData => {
            if (assignData[0]) {
                await Courses.updateOne({_id: id}, {status: 0}).then(data1 => {
                    res.status(200).json(data1);
                }).catch(err1 => {
                    console.log(err1);
                    return res
                        .status(404)
                        .json({internalError: "Unexpected error occurred! Please try again."});
                })
            }
        }).catch(errAssign => {
            console.log(errAssign);
            res.status(401).json({internalError: "Unexpected error occurred! Please"})
        })
    }
})

// course - enable
router.route('/course/enable').post(cors(corsOptions), auth.isAuthenticated, async (req, res) => {
    if (req.role == 2) {
        let id = req.body.id;
        Assign.find({instructor: req.id, course: id}).then(async assignData => {
            if (assignData[0]) {
                await Courses.updateOne({_id: id}, {status: 1}).then(data1 => {
                    res.status(200).json(data1);
                }).catch(err1 => {
                    console.log(err1);
                    return res
                        .status(404)
                        .json({internalError: "Unexpected error occurred! Please try again."});
                })
            }
        }).catch(errAssign => {
            console.log(errAssign);
            res.status(401).json({internalError: "Unexpected error occurred! Please"})
        })
    }
})

module.exports = router;


// admin/settings - change password
router.route('/settings/password').post(cors(corsOptions), auth.isAuthenticated, (req, res) => {
    if (req.role == 2) {

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


module.exports = router;