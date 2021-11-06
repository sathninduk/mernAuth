//import React, { Component,  useState, useEffect } from "react";
import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import {Redirect} from "react-router-dom";
import {Typography} from "@material-ui/core"
import axios from "axios";
import classnames from "classnames";
// mui
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Skeleton from "@mui/material/Skeleton";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

//axios.defaults.baseURL = process.env.APP_URL
const baseURL = require("../../config/keys").API_URL;

let pathname = window.location.pathname;
let id = pathname.split('/').pop();

class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            //lesson: "",
            //course: id,
            //position: "",
            process: false,
            changes: false,
            //successOpen: false,
            errorOpen: false,
            skeleton: false,
            skeletonTwo: false,
            errors: {},
            instructor: [],
            assignable: [],
            courses: [],
            assigned: []
        };
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    componentDidMount = () => {
        this.setState({loading: true});
        this.setState({skeleton: true});
        this.setState({skeletonTwo: true});


        if (this.props.auth.isAuthenticated) {
            //this.props.history.push("/admin/courses");
        }

        axios.get(baseURL + `/api/admin/instructor?id=` + id, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            this.setState({loading: false});
            this.setState({skeleton: false});

            const instructor = res.data;
            this.setState({instructor});
        }).catch((err) => {
            this.setState({loading: false});
            //this.setState({successOpen: false})
            //this.setState({errorOpen: true})
            this.setState({skeleton: false});
        });


        axios.get(baseURL + `/api/admin/courses`, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            this.setState({loading: false});
            this.setState({skeleton: false});

            const courses = res.data;
            this.setState({courses});
        }).catch((err) => {
            this.setState({loading: false});
            //this.setState({successOpen: false})
            //this.setState({errorOpen: true})
            this.setState({skeleton: false});
        });


        axios.get(baseURL + `/api/admin/assigned?id=` + id, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            this.setState({loading: false});
            this.setState({skeletonTwo: false});

            const assigned = res.data;
            console.log(assigned);
            this.setState({assigned});
        }).catch((err) => {
            this.setState({loading: false});
            //this.setState({successOpen: false})
            //this.setState({errorOpen: true})
            this.setState({skeletonTwo: false});
        });


        axios.get(baseURL + `/api/admin/assignable?id=` + id, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            this.setState({loading: false});
            this.setState({skeleton: false});
            const assignable = res.data;
            console.log(assignable);
            this.setState({assignable});
        }).catch((err) => {
            this.setState({loading: false});
            //this.setState({successOpen: false})
            //this.setState({errorOpen: true})
            this.setState({skeleton: false});
        });


    }

    onChange = e => {
        this.setState({[e.target.id]: e.target.value});
    };


    onSubmit = e => {

        this.setState({loading: true});
        this.setState({process: true})

        const assignIns = {
            user: id,
            course: document.getElementById("course").value
        };

        // axios
        axios.post(baseURL + '/api/admin/assign/new', assignIns, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((response) => {
            //this.setState({persons});
            this.setState({errors: {}})
            this.setState({process: false})
            this.setState({loading: false})
            this.setState({errorOpen: false})
            window.location.reload();
            //this.setState({successOpen: true})
        }).catch((err) => {
            this.setState({loading: false})
            this.setState({process: false})
            const errors = err.response.data
            this.setState({errors});
            if (errors.internalError) {
                //this.setState({successOpen: false})
                this.setState({errorOpen: true})
            }
        });
        // axios end

        e.preventDefault();

        // this.props.registerUser(newCourse);
        // this.props.registerUser(newCourse, this.props.history);
    };

    revoke = id => {

        if (window.confirm('Are you sure you want to revoke access to this course?')) {

            this.setState({loading: true});

            document.getElementById("delProcess" + id).innerHTML = "Working"

            // axios
            axios.post(baseURL + '/api/admin/assign/delete', {id: id}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'x-access-token',
                    'x-access-token': localStorage.getItem("jwtToken")
                }
            }).then((response) => {
                //this.setState({persons});
                this.setState({errors: {}})
                document.getElementById("delProcess" + id).innerHTML = "Revoke"
                this.setState({loading: false})
                this.setState({errorOpen: false})
                window.location.reload();
                //this.setState({successOpen: true})
            }).catch((err) => {
                this.setState({loading: false})
                document.getElementById("delProcess" + id).innerHTML = "Revoke"
                const errors = err.response.data
                this.setState({errors});
                if (errors.internalError) {
                    //this.setState({successOpen: false})
                    this.setState({errorOpen: true})
                }
            });

        }
    };

    handleClose = () => {
        this.setState({successOpen: false})
    }


    render() {

        const {user} = this.props.auth;
        const {errors} = this.state;

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

                    {/*<Snackbar
                        open={this.state.successOpen}
                        autoHideDuration={6000}
                        onClose={this.handleClose}
                    >
                        <Alert
                            //onClose={handleClose}
                            severity="success"
                            sx={{width: '100%'}}
                        >
                            Course added successfully!
                        </Alert>
                    </Snackbar>*/}

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
                    <div className="container valign-wrapper">
                        <div className="row">
                            <div className="landing-copy col s12 center-align">

                                <div id={"head-topic"}>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <a href={"/admin/instructors"} className="btn icon-master-btn con-mid"
                                           style={{marginTop: "10px"}}>
                                            <i className="material-icons-outlined btn-icon">arrow_back</i>
                                        </a>
                                    </div>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <h4>New Lesson</h4>
                                    </div>
                                </div>

                                <div className={"con-mid"} style={{width: "100%", margin: "30px 0"}}>
                                    <div className={"form-box"}>
                                        <div className={"form-inner"}>

                                            <h4 style={{textAlign: "left"}}>Assign
                                                courses</h4>
                                            <div style={{marginBottom: "24px"}}>
                                                <Typography variant={"p"}>
                                                    {this.state.skeleton === true ?
                                                        <div>
                                                            <Skeleton style={{width: "150px"}}/>
                                                            <Skeleton style={{width: "150px"}}/>
                                                        </div>
                                                        :
                                                        this.state.instructor.map(instructor =>
                                                            <div>
                                                                <p style={{
                                                                    textAlign: "left",
                                                                    lineHeight: "20px",
                                                                    marginBottom: "0px"
                                                                }}><b>{instructor.name}</b>
                                                                </p>
                                                                <p style={{
                                                                    textAlign: "left",
                                                                    lineHeight: "20px",
                                                                    marginBottom: "0px"
                                                                }}>{instructor.email}</p>
                                                            </div>
                                                        )
                                                    }
                                                </Typography>
                                            </div>


                                            <form noValidate onSubmit={this.onSubmit}>
                                                <div className={"select-textField"}>
                                                    {this.state.skeletonTwo === true ?
                                                        ""
                                                        :
                                                        <span className={classnames("select-top", {
                                                            invalidLabel: errors.position
                                                        })}>Select course</span>
                                                    }
                                                    {this.state.skeletonTwo === true ?
                                                        <Skeleton style={{width: "100%", height: "53.63px"}}/>
                                                        :
                                                        <select id={"course"} className={classnames("", {
                                                            invalid: errors.course
                                                        })}>
                                                            <option selected value={""}>Select course</option>
                                                            {this.state.assignable.map(course =>
                                                                <option
                                                                    value={course._id}>{course.name}</option>
                                                            )}
                                                        </select>
                                                    }
                                                    <span className="red-text">
                                                        {errors.course}
                                                    </span>
                                                </div>
                                                <div style={{marginTop: "24px"}}>
                                                    {this.state.skeleton === true ?
                                                        <button
                                                            style={{
                                                                width: "150px",
                                                                height: "35px"
                                                            }}
                                                            type="submit"
                                                            disabled
                                                            className="btn btn-full-blue">
                                                            {this.state.process === true ?
                                                                <CircularProgress style={{
                                                                    color: "#ffffff",
                                                                    padding: "10px",
                                                                    marginTop: "-10px"
                                                                }}/> : "Add"
                                                            }
                                                        </button>
                                                        :
                                                        <button
                                                            style={{
                                                                width: "150px",
                                                                height: "35px"
                                                            }}
                                                            type="submit"
                                                            className="btn btn-full-blue">
                                                            {this.state.process === true ?
                                                                <CircularProgress style={{
                                                                    color: "#ffffff",
                                                                    padding: "10px",
                                                                    marginTop: "-10px"
                                                                }}/> : "Add"
                                                            }
                                                        </button>
                                                    }
                                                </div>
                                            </form>

                                            <hr style={{marginTop: "60px", marginBottom: "40px"}}/>
                                            {this.state.skeleton === true ?
                                                <div>
                                                    <Skeleton style={{width: "100%", height: "35px"}}/>
                                                    <Skeleton style={{width: "100%", height: "35px"}}/>
                                                </div>
                                                :
                                                <div>
                                                    {this.state.assigned.length === 0 ?
                                                        <p style={{width: "100%"}} className={"con-mid"}>
                                                                    <span className={"con-mid"}
                                                                          style={{
                                                                              border: "1px solid rgba(0,0,0,0.1)",
                                                                              padding: "5px 20px",
                                                                              borderRadius: "10px"
                                                                          }}
                                                                    >
                                                                        No courses assigned yet
                                                                    </span>
                                                        </p>
                                                        :
                                                        this.state.assigned.map(assigned =>
                                                            <p className={"assignedList"}>
                                                                {this.state.courses.map(course =>
                                                                    course._id === assigned.course ?
                                                                        <div>
                                                                            <span><b>{course.name} &nbsp;</b></span>
                                                                            <div style={{width: "100%"}}
                                                                                 className={"con-right"}>
                                                                                <button
                                                                                    style={{
                                                                                        width: "80px",
                                                                                        height: "35px"
                                                                                    }}
                                                                                    id={"delProcess" + assigned._id}
                                                                                    onClick={() => this.revoke(assigned._id)}
                                                                                    className={"btn btn-full-red"}>Revoke
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        : ""
                                                                )}
                                                            </p>
                                                        )}
                                                </div>
                                            }


                                        </div>
                                    </div>
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
