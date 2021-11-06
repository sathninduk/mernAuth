import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import {Redirect} from "react-router-dom";
import axios from "axios";
// mui
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

//axios.defaults.baseURL = process.env.APP_URL
const baseURL = require("../../config/keys").API_URL;

const pathname = window.location.pathname;
const course = pathname.split('/').pop();

// message
let url_string = window.location.href;
let url = new URL(url_string);
const msg = url.searchParams.get("m");

class Dashboard extends Component {

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    state = {
        lessons: [],
        lessonsCount: "",
        skeleton: false,
        successOpen: false,
        topics: [],
        courses: []
    }

    componentDidMount = () => {
        console.log(course)
        this.setState({loading: true});
        this.setState({skeleton: true});

        if (msg === 'suc') {
            //window.location.reload();
            this.setState({successOpen: true})
        }

        if (msg === 'ldel') {
            this.setState({successOpen: true}, () => {
                window.onload = function () {
                    if (!window.location.hash) {
                        window.location = window.location + '#loaded';
                        window.location.reload();
                    }
                }
            });
        }

        if (msg === 'tdel') {
            this.setState({successOpen: true})
        }

        axios.get(baseURL + `/api/admin/lessons/count?id=` + course, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            const lessonsCount = res.data;
            this.setState({lessonsCount});
        }).catch((err) => {
            this.setState({loading: false}, () => {
            });
        });

        // lessons count
        axios.get(baseURL + `/api/admin/lessons?id=` + course, {
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

        axios.get(baseURL + `/api/admin/course?id=` + course, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            const courses = res.data;
            this.setState({courses});
            //document.getElementById("courseNameSk").style.display = "none";
            document.getElementById("courseName").innerHTML = courses[0].name;
        }).catch((err) => {
            this.setState({loading: false}, () => {
            });
        });

        axios.get(baseURL + `/api/admin/topicsByCourse?id=` + course, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            const topics = res.data;
            console.log(topics);
            this.setState({topics});
            this.setState({loading: false});
            this.setState({skeleton: false});
        }).catch((err) => {
            this.setState({loading: false}, () => {
            });
        });
    }

    handleClose = () => {
        this.setState({successOpen: false});
    }


    render() {

        const {user} = this.props.auth;

        if (user.role === 3) {
            return <Redirect to="/all-courses"/>
        } else if (user.role === 2) {
            return <Redirect to="/instructor"/>
        } else {

            return (
                <div className={"mother"}>
                    {this.state.loading === true ?
                        <LinearProgress style={{zIndex: "1000000"}} /> : ""
                    }
                    <Snackbar
                        open={this.state.successOpen}
                        autoHideDuration={6000}
                        onClose={this.handleClose}
                    >
                        {msg === 'suc' ?
                            <Alert
                                //onClose={handleClose}
                                severity="success"
                                sx={{width: '100%'}}
                            >
                                Lesson added successfully
                            </Alert>
                            : msg === 'ldel' ?
                                <Alert
                                    //onClose={handleClose}
                                    severity="info"
                                    sx={{width: '100%'}}
                                >
                                    Lesson deleted successfully
                                </Alert>
                                : msg === 'tdel' ?
                                    <Alert
                                        //onClose={handleClose}
                                        severity="info"
                                        sx={{width: '100%'}}
                                    >
                                        Topic deleted successfully
                                    </Alert>
                                    : ""}
                    </Snackbar>
                    <div className="container valign-wrapper">
                        <div className="row">
                            <div className="landing-copy col s12 center-align">

                                <div id={"head-topic"}>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <a href="/admin/courses" className="btn icon-master-btn con-mid"
                                           style={{marginTop: "10px"}}>
                                            <i className="material-icons-outlined btn-icon">arrow_back</i>
                                        </a>
                                    </div>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <Typography variant={"h4"}>
                                            {/*this.state.skeleton === true ? <Skeleton id={"courseNameSk"} style={{width: "150px"}} /> : ""*/}
                                                <h4 id={"courseName"}>
                                                </h4>
                                        </Typography>
                                    </div>
                                </div>

                                <div className={"con-right"} style={{margin: "30px 0px", width: "100%"}}>
                                    <a href={"/admin/lessons/new/" + course} className={"btn btn-full-blue"}>
                                        {/*<span style={{fontSize: "14px", color: "#007FFF"}}>*/}
                                        {/*<b>+ New lesson</b>*/}
                                        + New lesson
                                        {/*</span>*/}
                                    </a>
                                </div>

                                {this.state.lessonsCount === 0 ?
                                    <p style={{width: "100%", paddingTop: "30px"}} className={"con-mid"}>
                                        <span className={"not-yet"}>No lessons yet</span>
                                    </p>
                                    :
                                    this.state.skeleton === true ?
                                        <div style={{width: "100%"}}>
                                            <Skeleton style={{width: "100%", height: "65px"}}/>
                                            <Skeleton style={{width: "100%", height: "65px"}}/>
                                            <Skeleton style={{width: "100%", height: "65px"}}/>
                                        </div>
                                        :
                                        <div className={"accordion-outer"}>
                                            <div className="accordion" id="accordionExample">
                                                <div className={"accordion-inner"}>
                                                    {this.state.lessons.map(lesson =>
                                                            <div className="accordion-item">
                                                                <p className="accordion-header" id={"heading" + lesson._id}>
                                                        <span className="accordion-button collapsed"
                                                              type="button" data-bs-toggle="collapse"
                                                              data-bs-target={"#collapse" + lesson._id}
                                                              aria-expanded="true"
                                                              aria-controls={"collapse" + lesson._id}>
                                                    {lesson.lesson}
                                                            <a href={"/admin/lessons/edit/" + lesson._id + "?c=" + lesson.course}
                                                               className={"btn icon-master-btn con-mid"}
                                                               style={{marginLeft: "10px"}}>
                                                        <i className="material-icons-outlined btn-icon"
                                                           style={{padding: "7px"}}>edit</i>
                                                        </a>
                                                        </span>
                                                                </p>

                                                                <div id={"collapse" + lesson._id}
                                                                     className="accordion-collapse collapse"
                                                                     aria-labelledby={"heading" + lesson._id}
                                                                     data-bs-parent="#accordionExample">
                                                                    <div className="accordion-body">
                                                                        {/*<a href={"/admin/lessons/edit/" + lesson._id}
                                                                className={"btn icon-master-btn con-mid"}
                                                                style={{width: "150px", fontSize: "14px"}}>
                                                                <span>Edit lesson</span>
                                                            </a>
                                                                <hr />
                                                                <ul>
                                                                <li style={{listStyle: "none"}}><u><b>Topics</b></u></li>
                                                                </ul>*/}
                                                                        <ol>
                                                                            {this.state.topics.map(topic =>
                                                                                lesson._id === topic.lesson ?
                                                                                    <li className={"accordion-li"}
                                                                                        style={{listStyle: "decimal-leading-zero"}}
                                                                                        key={topic._id}>
                                                                                    <span className={"accordion-a"}>
                                                                                        {topic.topic}
                                                                                    </span>

                                                                                        <div
                                                                                            style={{display: "inline-block"}}>
                                                                                            <a href={"/admin/topics/edit/" + topic._id}
                                                                                               style={{margin: "5px 10px"}}
                                                                                               className={"btn icon-master-btn con-mid"}>
                                                                                                <i className="material-icons-outlined btn-icon">
                                                                                                    edit
                                                                                                </i>
                                                                                            </a>
                                                                                        </div>
                                                                                        <div
                                                                                            style={{display: "inline-block"}}>
                                                                                            <a href={"/admin/topics/video/" + topic._id}
                                                                                               style={{margin: "5px 2px"}}
                                                                                               className={"btn icon-master-btn con-mid"}>
                                                                                                <i className="material-icons-outlined btn-icon">
                                                                                                    smart_display
                                                                                                </i>
                                                                                            </a>
                                                                                        </div>
                                                                                    </li> : ""
                                                                            )}
                                                                        </ol>
                                                                        <a href={"/admin/topics/new/" + lesson._id}
                                                                           className={"btn icon-master-btn con-mid"}
                                                                           style={{
                                                                               width: "150px",
                                                                               fontSize: "14px",
                                                                               marginBottom: "15px"
                                                                           }}><span>+ New topic</span></a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                }
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
