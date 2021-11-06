import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import {Redirect} from "react-router-dom";
import {TextField} from "@material-ui/core"
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
            errors: {},
            courses: {},
            lessons: []
        };
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    componentDidMount = () => {
        this.setState({loading: true});
        this.setState({skeleton: true});

        if (this.props.auth.isAuthenticated) {
            //this.props.history.push("/admin/courses");
        }

        axios.get(baseURL + `/api/admin/lessons?id=` + id, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            this.setState({loading: false});
            this.setState({skeleton: false});

            const lessons = res.data;
            this.setState({lessons});
        }).catch((err) => {
            this.setState({loading: false});
            //this.setState({successOpen: false})
            //this.setState({errorOpen: true})
            this.setState({skeleton: false});
        });

        axios.get(baseURL + `/api/admin/lessons/last?id=` + id, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {

            let lessonsLastRaw = parseInt(res.data[0].position);
            const lastLesson = lessonsLastRaw + 1;
            console.log(lastLesson)
            this.setState({lastLesson});

        }).catch((err) => {
            this.setState({loading: false});
            this.setState({skeleton: false});
            //this.setState({successOpen: false})
            //this.setState({errorOpen: true})
        });


    }

    onChange = e => {
        this.setState({[e.target.id]: e.target.value});
    };


    onSubmit = e => {

        this.setState({loading: true});
        this.setState({process: true})

        const newCourse = {
            //lesson: this.state.lesson,
            //course: this.state.course,
            //position: this.state.position
            lesson: document.getElementById("lesson").value,
            position: document.getElementById("position").value
        };

        // axios
        axios.post(baseURL + '/api/admin/lessons/new?id=' + id, newCourse, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((response) => {
            window.location.href = "/admin/lessons/" + id + "?m=suc";
            //this.setState({persons});
            this.setState({errors: {}})
            this.setState({process: false})
            this.setState({loading: false})
            this.setState({errorOpen: false})
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
                                        {this.state.skeleton === true ?
                                            <a href={"/admin/courses"} className="btn icon-master-btn con-mid"
                                               style={{marginTop: "10px"}}>
                                                <i className="material-icons-outlined btn-icon">sync</i>
                                            </a>
                                            :
                                            <a href={"/admin/lessons/" + id} className="btn icon-master-btn con-mid"
                                               style={{marginTop: "10px"}}>
                                                <i className="material-icons-outlined btn-icon">arrow_back</i>
                                            </a>
                                        }
                                    </div>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <h4>New Lesson</h4>
                                    </div>
                                </div>

                                <div className={"con-mid"} style={{width: "100%", margin: "30px 0"}}>
                                    <div className={"form-box"}>
                                        <div className={"form-inner"}>
                                            <form noValidate onSubmit={this.onSubmit}>
                                                <h4 style={{textAlign: "left", marginBottom: "24px"}}>Add new
                                                    lesson</h4>
                                                <div style={{marginBottom: "24px"}}>
                                                    {this.state.skeleton === true ?
                                                        <Skeleton style={{width: "100%", height: "53.63px"}}/>
                                                        :
                                                        <TextField
                                                            id="lesson"
                                                            label="Lesson Name"
                                                            variant="outlined"
                                                            style={{width: "100%"}}
                                                            //onChange={this.onChange}
                                                            //value={this.state.lesson}
                                                            error={errors.lesson}
                                                            type="text"
                                                            className={classnames("", {
                                                                invalid: errors.lesson
                                                            })}
                                                        />
                                                    }

                                                    <span
                                                        className="red-text">{errors.lesson}</span>
                                                </div>

                                                <div className={"select-textField"}>
                                                    {this.state.skeleton === true ?
                                                        ""
                                                        :
                                                        <span className={classnames("select-top", {
                                                            invalidLabel: errors.position
                                                        })}>Lesson Position</span>
                                                    }
                                                    {this.state.skeleton === true ?
                                                        <Skeleton style={{width: "100%", height: "53.63px"}}/>
                                                        :
                                                        <select id={"position"} error={errors.position}
                                                                className={classnames("", {
                                                                    invalid: errors.position
                                                                })}>
                                                            {!this.state.lastLesson ? "" :
                                                                <option selected="selected"
                                                                        value={parseInt(this.state.lastLesson)}>At
                                                                    the end
                                                                </option>}
                                                            <option value={1}>At the beginning</option>
                                                            {this.state.lessons.map(lesson =>
                                                                <option
                                                                    value={lesson.position + 1}>After {lesson.lesson}</option>
                                                            )}
                                                        </select>
                                                    }
                                                    <span className="red-text">
                                                        {errors.position}
                                                    </span>
                                                </div>

                                                {/*
                                            <div style={{marginBottom: "24px"}}>
                                                <TextField
                                                    select
                                                    required
                                                    id="position"
                                                    variant={"outlined"}
                                                    style={{width: "100%"}}
                                                    label="Lesson Position"
                                                    value={this.state.position}
                                                    onChange={this.onChange}
                                                    className={classnames("", {})}
                                                >

                                                    <MenuItem key={1} value={1}>
                                                        At the beginning
                                                    </MenuItem>
                                                    {this.state.lessons.map(lesson =>
                                                        <MenuItem key={lesson._id}
                                                                  value={parseInt(lesson.position + 1)}>
                                                            After {lesson.lesson}
                                                        </MenuItem>
                                                    )}
                                                </TextField>
                                                <span
                                                    className="red-text">

                                                </span>


                                            </div>
                                        */}


                                                <div style={{marginTop: "24px"}}>
                                                    {this.state.skeleton === true ?
                                                        <button
                                                            style={{
                                                                width: "100%",
                                                                height: "48px"
                                                            }}
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
                                                                width: "100%",
                                                                height: "48px"
                                                            }}
                                                            type="submit"
                                                            className="btn btn-full-blue">
                                                            {this.state.process === true ?
                                                                <CircularProgress style={{
                                                                    color: "#ffffff",
                                                                    padding: "10px",
                                                                    marginTop: "-4px"
                                                                }}/> : "Add"
                                                            }
                                                        </button>
                                                    }
                                                </div>

                                            </form>
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
