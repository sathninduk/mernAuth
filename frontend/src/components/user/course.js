import React, {Component} from "react";
//import PropTypes, {func} from "prop-types";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import {Redirect} from "react-router-dom";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import {CircularProgress, Typography} from "@material-ui/core";
import Skeleton from "@mui/material/Skeleton";

//axios.defaults.baseURL = process.env.APP_URL
const baseURL = require("../../config/keys").API_URL;

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// course
let pathname = window.location.pathname;
let course = pathname.split('/').pop();

const curTime = new Date().toISOString();

// topic
let url_string = window.location.href;
let url = new URL(url_string);
const topic = url.searchParams.get("t");

class Dashboard extends Component {

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    state = {
        thisLesson: "",
        errorOpen: false,
        loading: false,
        topicLoading: false,
        zoomStart: "",
        paymentStatus: [],
        courses: [],
        lessons: [],
        topics: [],
        topicValue: topic,
        topicId: [],
        firstTopic: [],
        displayTopic: [],
        errors: {}
    }


    componentDidMount = () => {
        this.setState({topicLoading: true});
        this.setState({loading: true});

        // axios
        // get course information
        axios.get(baseURL + `/api/u/m-course?course=` + course, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            const courses = res.data;
            this.setState({courses});

            let zoomStart1 = courses[0].zoomStart
            let zoomStart2 = new Date(zoomStart1)
            const zoomStart = String(zoomStart2)
            this.setState({zoomStart});

        }).catch((err) => {
            this.setState({loading: false}, () => {
            });
        });

        // get lesson information
        axios.get(baseURL + `/api/u/lessons?course=` + course, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            const lessons = res.data;
            this.setState({lessons});
        }).catch((err) => {
            this.setState({loading: false}, () => {
            });
        });

        // get lesson information
        axios.get(baseURL + `/api/u/topics/first?course=` + course, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            const firstTopic = res.data;
            this.setState({firstTopic});
        }).catch((err) => {
            this.setState({loading: false}, () => {
            });
        });

        // get topic information
        axios.get(baseURL + `/api/u/topics?course=` + course, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            this.setState({topicLoading: false});
            const topics = res.data;
            this.setState({topics});
            this.setState({loading: false});
        }).catch((err) => {
            this.setState({topicLoading: false});
            this.setState({loading: false}, () => {
            });
        });

        // get payment information and redirect
        axios.get(baseURL + `/api/u/payment-check?course=` + course, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            const paymentStatus = res.data;
            if (paymentStatus[0].status !== 1) {
                //window.location.href = "/course-payment/" + course;
            }
            this.setState({paymentStatus});
        }).catch((err) => {
            //window.location.href = "/dashboard";
            this.setState({loading: false}, () => {
            });
        });

        // get display topic information
        axios.get(baseURL + `/api/u/topic?course=` + course + `&topic=` + topic, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            this.setState({errorOpen: false});
            const displayTopic = res.data;
            console.log(displayTopic);
            const thisLesson = displayTopic[0].lesson;
            this.setState({thisLesson})
            this.setState({displayTopic});
            this.setState({loading: false});
        }).catch((err) => {
            //window.location.href = "/dashboard";
            this.setState({errorOpen: true});
            this.setState({loading: false}, () => {
            });
        });

        // axios end


    }

    /*newTopic = e => {
        function classesEditor() {
            let topicsCount = this.state.topics.length;
            let x = document.getElementsByClassName("topicsList");
            let i;
            for (i = 0; i <= topicsCount; i++) {
                x[i].style.fontWeight = "400";
            }
        }

        function spanIdEditor() {
            document.getElementById("span" + topic).style.fontWeight = "700";
        }

        classesEditor = async e => {
            await spanIdEditor();
        }
    }*/

    onSubmit = e => {
        const newPayment = {
            course: this.state.course,
            file: this.state.file
        };

        // axios
        axios.post(baseURL + `/api/u/payment`, newPayment, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((response) => {
            console.log("saved");
            window.location.href = "/course-payment-pending/" + course;
            //window.location.href = "/course-payment/" + course;
            //this.setState({persons});
        }).catch((err) => {
            console.log(err);
            //this.setState({loading: false}, () => {
            //});
        });
        // axios end

        e.preventDefault();

        // this.props.registerUser(newCourse);
        // this.props.registerUser(newCourse, this.props.history);
    };

    handleClose = () => {
        this.setState({successOpen: false})
    }

    render() {

        const {user} = this.props.auth;

        if (user.role === 1) {
            return <Redirect to="/admin"/>
        } else if (user.role === 2) {
            return <Redirect to="/instructor"/>
        } else {

            return (
                <div className={"mother"}>
                    {this.state.loading === true ?
                        <LinearProgress style={{zIndex: "1000000"}} /> : ""
                    }
                    {/* main tv */}
                    <Snackbar
                        open={this.state.errorOpen}
                        autoHideDuration={6000}
                        onClose={this.handleClose}
                    >
                        <Alert
                            //onClose={handleClose}
                            severity="error"
                            sx={{width: '100%'}}
                        >
                            Network error occurred!
                        </Alert>
                    </Snackbar>

                    {topic ?
                        <div className={"main-tv"} id={"thisTopic2"}>
                            <div style={{height: "100%"}} className={"con-mid"}>
                                {this.state.loading === true ?
                                    <CircularProgress/>
                                    :
                                    <iframe
                                        className={"tv-iframe"}
                                        src={this.state.displayTopic.map(thisTopic => thisTopic.video)}
                                        frameBorder={0}
                                        allow="autoplay; fullscreen; picture-in-picture"
                                        allowFullScreen
                                        title={this.state.displayTopic.map(thisTopic => thisTopic.topic)}/>
                                }
                            </div>
                        </div>

                        :
                        <div className={"main-tv"} id={"courseWelcome"}>
                            <div className={"con-mid"} style={{height: "100%", padding: "20px"}}>
                                <Typography variant={"h4"}>
                                    {this.state.loading === true ?
                                        <Skeleton style={{width: "280px"}}/>
                                        :
                                        this.state.courses.map(course =>
                                            <h4>
                                                {course.name}
                                            </h4>
                                        )
                                    }
                                </Typography>

                                {this.state.loading === true ?
                                    <Skeleton style={{width: "280px", height: "200px"}}/>
                                    :
                                    this.state.courses.map(course =>
                                        <p className={"courseSummary"}>
                                            {course.summary}
                                        </p>
                                    )
                                }

                                {this.state.loading === true ?
                                    <Skeleton style={{width: "150px", height: "35px"}}/>
                                    :
                                    <a href={"/course/" + course + "?t=" + this.state.firstTopic}
                                       className={"btn btn-full-blue"}>Start</a>
                                }
                            </div>
                        </div>
                    }
                    {/* side navigation */}
                    <div className={"side-nav split"}>

                        <div className={"player"}>

                            <div id={"thisTopic"}>
                                <Typography variant={"h4"}>
                                    {this.state.loading === true ?
                                        <Skeleton style={{width: "200px"}}/>
                                        :
                                        this.state.courses.map(course =>
                                            <h4>
                                                {course.name}
                                            </h4>
                                        )
                                    }
                                </Typography>

                                {this.state.loading === true ?
                                    <div className={"zoomLink"}>
                                        <div className={"zoom-box zoom-live con-right"}>
                                            <Skeleton style={{width: "150px", height: "35px"}}/>
                                        </div>
                                    </div>
                                    :
                                    this.state.courses.map(course =>
                                        <div className={"zoomLink"}>
                                            {curTime <= this.state.courses.map(zoom => zoom.zoomEnd) ?
                                                this.state.courses.map(zoom => zoom.zoomStart) <= curTime ?
                                                    <div className={"zoom-box zoom-live con-right"}>
                                                        <a
                                                            href={course.zoom}
                                                            rel="noopener noreferrer"
                                                            target="_blank"
                                                            className="btn btn-full-red con-mid"
                                                            title="Link">
                                                            Live Zoom
                                                        </a>
                                                    </div>
                                                    :
                                                    <div className={"zoom-box zoom-live con-right"}>
                                                        <a
                                                            href={course.zoom}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-full-warn con-mid"
                                                            title="Link">
                                                            Upcoming Zoom
                                                        </a>
                                                        <div style={{marginTop: "10px"}}>
                                                            <p style={{fontSize: "11px"}}>{this.state.zoomStart}</p>
                                                        </div>
                                                    </div>
                                                : ""
                                            }
                                        </div>
                                    )}


                                {topic ?
                                    this.state.displayTopic.map(thisTopic =>
                                        <p>
                                            {thisTopic.topic}
                                        </p>
                                    )
                                    : ""
                                }
                            </div>

                            {/*topic ?
                                <div style={{display: "inline-block", width: "100%", textAlign: "right"}}>

                                    <a href={"/dashboard"} title={"previous"} className={"btn icon-master-btn con-mid"}
                                       style={{display: "inline-block", padding: "6px 0 0 0"}}><i
                                        className="material-icons-outlined btn-icon"
                                        style={{textAlign: "center"}}>skip_previous</i></a>

                                    <a href={"/dashboard"} title={"next"} className={"btn icon-master-btn con-mid"}
                                       style={{display: "inline-block", padding: "6px 0 0 0", marginLeft: "10px"}}><i
                                        className="material-icons-outlined btn-icon" style={{textAlign: "center"}}>skip_next</i></a>

                                </div>
                                : ""
                            */}
                        </div>

                        <br/>


                        <div className="col s12">
                            <div>
                                {/* collapse */}
                                {this.state.topicLoading ?
                                    <Skeleton style={{width: "100%", height: "300px"}} />
                                    :
                                <div className="accordion" id="accordionExample">
                                    {this.state.lessons.map(lesson =>
                                        <div className="accordion-item">

                                            {this.state.thisLesson === lesson._id ?
                                                <p className="accordion-header" id={"heading" + lesson._id}>
                                                    <button className="accordion-button"
                                                            type="button" data-bs-toggle="collapse"
                                                            data-bs-target={"#collapse" + lesson._id}
                                                            aria-expanded="true"
                                                            aria-controls={"collapse" + lesson._id}>
                                                        <b>{lesson.lesson}</b>
                                                        <span
                                                            style={{
                                                                marginLeft: "5px",
                                                                color: "#46505A",
                                                                fontSize: "10px"
                                                            }}>▶</span>
                                                    </button>
                                                </p>
                                                :
                                                <p className="accordion-header" id={"heading" + lesson._id}>
                                                    <button className="accordion-button collapsed"
                                                            type="button" data-bs-toggle="collapse"
                                                            data-bs-target={"#collapse" + lesson._id}
                                                            aria-expanded="true"
                                                            aria-controls={"collapse" + lesson._id}>
                                                        {lesson.lesson}
                                                    </button>
                                                </p>
                                            }

                                            {this.state.thisLesson === lesson._id ?

                                                <div id={"collapse" + lesson._id}
                                                     className="accordion-collapse collapse show"
                                                     aria-labelledby={"heading" + lesson._id}
                                                     data-bs-parent="#accordionExample">
                                                    <div className="accordion-body">
                                                        <ul>
                                                            {this.state.topics.map(topic =>
                                                                lesson._id === topic.lesson ?
                                                                    <li className={"accordion-li"} key={topic._id}>
                                                                        {this.state.topicValue === topic._id ?
                                                                            <a
                                                                                className={"accordion-a"}
                                                                                style={{textDecoration: "none"}}
                                                                                href={"/course/" + course + "?t=" + topic._id}>
                                                                                <span
                                                                                    id={"span" + topic._id}
                                                                                    className={"topicsList"}
                                                                                    style={{
                                                                                        fontWeight: "700",
                                                                                        color: "#007FFF"
                                                                                    }}
                                                                                >
                                                                                    {topic.topic}
                                                                                </span>
                                                                                <span
                                                                                    style={{
                                                                                        marginLeft: "5px",
                                                                                        color: "#007FFF",
                                                                                        fontSize: "10px"
                                                                                    }}>▶</span>
                                                                            </a>
                                                                            :
                                                                            <a
                                                                                className={"accordion-a"}
                                                                                style={{textDecoration: "none"}}
                                                                                href={"/course/" + course + "?t=" + topic._id}>
                                                                                {topic.topic}
                                                                            </a>
                                                                        }
                                                                    </li>
                                                                    : ""
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>

                                                :

                                                <div id={"collapse" + lesson._id}
                                                     className="accordion-collapse collapse"
                                                     aria-labelledby={"heading" + lesson._id}
                                                     data-bs-parent="#accordionExample">
                                                    <div className="accordion-body">
                                                        <ul>
                                                            {this.state.topics.map(topic =>
                                                                lesson._id === topic.lesson ?
                                                                    <li className={"accordion-li"} key={topic._id}>
                                                                        <a
                                                                            className={"accordion-a"}
                                                                            style={{textDecoration: "none"}}
                                                                            href={"/course/" + course + "?t=" + topic._id}>
                                                                            {topic.topic}
                                                                        </a>
                                                                    </li>
                                                                    :
                                                                    ""
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    )}
                                </div>
                                }
                                {/* collapse */}

                                <div style={{width: "100%", margin: "20px 0"}}>
                                    <p style={{fontSize: "12px"}}>Powered by <a href={"https://www.coduza.com"}
                                                                                style={{textDecoration: "none"}}
                                                                                target={"_blank"} rel="noopener noreferrer">CODUZA</a>
                                    </p>
                                </div>

                            </div>


                        </div>

                    </div>
                </div>
            );
        }
    }
}

Dashboard.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    {logoutUser}
)(Dashboard);
