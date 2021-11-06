import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import {Link, Redirect} from "react-router-dom";
// mui
import Skeleton from '@mui/material/Skeleton';
import LinearProgress from '@mui/material/LinearProgress';

import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

//axios.defaults.baseURL = process.env.APP_URL
const baseURL = require("../../config/keys").API_URL;

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
        loading: "",
        blocsLoading: "",
        successOpen: false,
        courses: []
    }

    componentDidMount = () => {
        this.setState({loading: true});
        this.setState({blocsLoading: true});
        axios.get(baseURL + `/api/admin/courses`, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            const courses = res.data;
            courses.sort();
            this.setState({courses});
            this.setState({loading: false});
            this.setState({blocsLoading: false});
        }).catch((err) => {
            this.setState({loading: true});
            this.setState({blocsLoading: true});
        });

        if (msg === 'cdel') {
            this.setState({successOpen: true}, () => {
                window.onload = function () {
                    if (!window.location.hash) {
                        window.location = window.location + '#loaded';
                        window.location.reload();
                    }
                }
            });
        }

    }

    handleClose = () => {
        this.setState({successOpen: false});
    }


    disableUser = (e) => {
        this.setState({loading: true});
        let s1 = e.target.id;
        let id = s1.substring(2);

        console.log(s1)
        console.log(id)

        if (window.confirm('Are you sure you want to disable this course?')) {
            document.getElementById('d-' + id).innerHTML = "Working...";
            console.log("disable");
            /// delete payment
            axios.post(baseURL + `/api/admin/course/disable`, {id: id}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'x-access-token',
                    'x-access-token': localStorage.getItem("jwtToken")
                }
            }).then((response) => {
                console.log("disabled");
                document.getElementById('d-' + id).innerHTML = "Disable";
                document.getElementById('d-' + id).style.display = 'none';
                document.getElementById('e-' + id).style.display = 'inline-block';
                document.getElementById('active-' + id).style.display = 'none';
                document.getElementById('disabled-' + id).style.display = 'inline-block';
                this.setState({loading: false});
            }).catch((err) => {
                this.setState({loading: true});
                console.log(err);
                alert("An unexpected error occurred, Please reload the page and try again.");
            });
            // axios end
        } else {
            this.setState({loading: false});
            console.log("Disable aborted")
        }
    }


    enableUser = (e) => {

        this.setState({loading: true});

        let s1 = e.target.id;
        let id = s1.substring(2);

        console.log(id)

        if (window.confirm('Are you sure you want to enable this course?')) {
            document.getElementById('e-' + id).innerHTML = "Working...";
            console.log("enable");
            /// delete payment
            axios.post(baseURL + `/api/admin/course/enable`, {id: id}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'x-access-token',
                    'x-access-token': localStorage.getItem("jwtToken")
                }
            }).then((response) => {
                console.log("enabled");
                document.getElementById('e-' + id).innerHTML = "Enable";
                document.getElementById('e-' + id).style.display = 'none';
                document.getElementById('d-' + id).style.display = 'inline-block';
                document.getElementById('disabled-' + id).style.display = 'none';
                document.getElementById('active-' + id).style.display = 'inline-block';
                this.setState({loading: false});
            }).catch((err) => {
                console.log(err);
                this.setState({loading: true});
                alert("An unexpected error occurred, Please reload the page and try again.");
            });
            // axios end
        } else {
            this.setState({loading: false});
            console.log("Enable aborted")
        }
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
                        <Alert
                            //onClose={handleClose}
                            severity="info"
                            sx={{width: '100%'}}
                        >
                            Course deleted successfully
                        </Alert>
                    </Snackbar>

                    <div className="container valign-wrapper">
                        <div className="row">
                            <div className="landing-copy col s12 center-align">

                                <div id={"head-topic"}>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <Link to="/admin" className="btn icon-master-btn con-mid"
                                              style={{marginTop: "10px"}}>
                                            <i className="material-icons-outlined btn-icon">arrow_back</i>
                                        </Link>
                                    </div>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <h4>All courses</h4>
                                    </div>
                                </div>

                                <div className={"con-right"}>
                                    <Link to={"/admin/courses/new"} className={"btn btn-full-blue"}
                                          style={{
                                              marginRight: "var(--bs-gutter-x,.75rem)",
                                              marginLeft: "var(--bs-gutter-x,.75rem)"
                                          }}>+ Add new course</Link>
                                </div>

                                <div className={"container"} style={{margin: "30px 0"}}>

                                    {this.state.blocsLoading === true ?
                                        <div className={"row blocs"}>
                                            <div className={"col-sm-6"}>
                                                <Skeleton variant="rectangular"/>
                                            </div>
                                            <div className={"col-sm-6"}>
                                                <Skeleton variant="rectangular"/>
                                            </div>
                                            <div className={"col-sm-6"}>
                                                <Skeleton variant="rectangular"/>
                                            </div>
                                            <div className={"col-sm-6"}>
                                                <Skeleton variant="rectangular"/>
                                            </div>
                                        </div>
                                        :
                                        <div className={"row blocs"}>
                                            {this.state.courses.map(course =>
                                                <div className={"col-sm-6"}>
                                                    <div className={"block-body"}>
                                                        <div className={"inner-block-body"}>
                                                    <span style={{display: "inline-block"}}>
                                                        <b>{course.name}</b>
                                                    </span>

                                                            {course.status === 1 ?
                                                                <span>
                                                                <span id={"active-" + course._id}
                                                                      className={"badge badge-success course-status"}>Active</span>
                                                                <span id={"disabled-" + course._id}
                                                                      style={{display: 'none'}}
                                                                      className={"badge badge-danger course-status"}>Disabled</span>
                                                            </span>
                                                                :
                                                                <span>
                                                                <span id={"active-" + course._id}
                                                                      style={{display: 'none'}}
                                                                      className={"badge badge-success course-status"}>Active</span>
                                                                <span id={"disabled-" + course._id}
                                                                      className={"badge badge-danger course-status"}>Disabled</span>
                                                            </span>
                                                            }

                                                            <span style={{display: "inline-block"}}>
                                                            <a href={"/admin/courses/edit/" + course._id}
                                                               className={"btn icon-master-btn con-mid"}>
                                                                <i className="material-icons-outlined btn-icon"
                                                                   style={{padding: "7px"}}>edit</i>
                                                            </a>
                                                        </span>

                                                            <hr style={{
                                                                marginLeft: "-25px",
                                                                marginRight: "-25px",
                                                                marginTop: "20px",
                                                                marginBottom: "20px",
                                                                height: "2px",
                                                                //borderColor: "rgba(255, 255, 255, 0.3)"
                                                                backgroundColor: "#d0d3df"
                                                            }}/>
                                                            <div style={{
                                                                display: "inline-block",
                                                                width: "100%",
                                                                paddingBottom: "10px"
                                                            }} className={"con-right"}>

                                                                <a href={"/admin/zoom/" + course._id}
                                                                   className={"btn btn-full-blue"}
                                                                   style={{margin: "5px 0 5px 0", width: "100px"}}>Zoom
                                                                    link</a>

                                                                <a href={"/admin/lessons/" + course._id}
                                                                   className={"btn btn-full-dark"}
                                                                   style={{
                                                                       margin: "5px 0 5px 10px",
                                                                       width: "100px"
                                                                   }}>Lessons</a>

                                                                {course.status === 1 ?
                                                                    <span>
                                                                <button
                                                                    onClick={this.disableUser}
                                                                    id={"d-" + course._id}
                                                                    className={"btn btn-full-red"}
                                                                    style={{
                                                                        margin: "5px 0 5px 10px",
                                                                        display: "inline-block", width: "100px"
                                                                    }}>
                                                                    Disable
                                                                </button>
                                                                <button
                                                                    onClick={this.enableUser}
                                                                    id={"e-" + course._id}
                                                                    className={"btn btn-full-warn"}
                                                                    style={{
                                                                        margin: "5px 0 5px 10px",
                                                                        display: "none",
                                                                        width: "100px"
                                                                    }}>
                                                                    Enable
                                                                </button>
                                                             </span>
                                                                    :
                                                                    <span>
                                                                <button
                                                                    onClick={this.disableUser}
                                                                    id={"d-" + course._id}
                                                                    className={"btn btn-full-red"}
                                                                    style={{
                                                                        margin: "5px 0 5px 10px",
                                                                        display: "none",
                                                                        width: "100px"
                                                                    }}>
                                                                    Disable
                                                                </button>
                                                                <button
                                                                    onClick={this.enableUser}
                                                                    id={"e-" + course._id}
                                                                    className={"btn btn-full-warn"}
                                                                    style={{margin: "5px 0 5px 10px", width: "100px"}}>
                                                                    Enable
                                                                </button>
                                                             </span>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    }
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
