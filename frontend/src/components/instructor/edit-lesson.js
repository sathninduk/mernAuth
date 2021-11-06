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
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

//axios.defaults.baseURL = process.env.APP_URL
const baseURL = require("../../config/keys").API_URL;

let pathname = window.location.pathname;
let id = pathname.split('/').pop();

//let url_string = window.location.href;
//let url = new URL(url_string);
//const courseId = url.searchParams.get("c");

class Dashboard extends Component {

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    state = {
        lesson: "",
        position: "",
        delProcess: false,
        process: false,
        changes: false,
        successOpen: false,
        errorOpen: false,
        skeleton: false,
        courses: [],
        errors: {}
    }

    componentDidMount = () => {
        this.setState({loading: true});
        this.setState({skeleton: true});

        axios.get(baseURL + `/api/instructor/lesson?id=` + id, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {

            this.setState({loading: false});
            this.setState({skeleton: false});

            const courses = res.data;

            if (courses[0]._id) {
                this.setState({courses});

                let lesson = document.getElementById("lesson");
                let position = document.getElementById("position");

                lesson.value = courses[0].lesson;
                position.value = courses[0].position;

                this.setState({lesson: courses[0].lesson});
                this.setState({position: courses[0].position});
            } else {
                window.location.href = "/instructor/lessons/" + this.state.courses.map(course => course.course);
            }

        }).catch((err) => {
            this.setState({loading: false});
            this.setState({successOpen: false})
            this.setState({errorOpen: true})
            this.setState({skeleton: false});
        });
    }

    onChange = e => {
        this.setState({changes: true});
        this.setState({[e.target.id]: e.target.value});
    };


    delCourse = e => {

        this.setState({loading: true});
        this.setState({delProcess: true})

        if (window.confirm('Are you sure you want to delete the lesson "' + this.state.courses.map(course => course.lesson) + '"?')) {
            // They clicked Yes
            console.log("del");
            // axios
            axios.post(baseURL + `/api/instructor/lesson/delete?id=` + id, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'x-access-token',
                    'x-access-token': localStorage.getItem("jwtToken")
                }
            }).then((res) => {
                //const persons = res.data;
                //this.setState({persons});
                this.setState({loading: false});
                this.setState({delProcess: false});
                //window.location.href = "/instructor/lessons/" + this.state.courses.map(course => course.course);
            }).catch((err) => {
                this.setState({loading: false});
                this.setState({delProcess: false})
                const errors = err.response.data
                if (errors.internalError) {
                    this.setState({errorOpen: true})
                }
                console.log(errors);
                this.setState({errors});
            });
            window.location.href = "/instructor/lessons/" + this.state.courses.map(course => course.course) + "?m=ldel";
            // axios end
        } else {
            this.setState({loading: false});
            this.setState({delProcess: false})
            console.log("Deletion aborted");
        }
        e.preventDefault();
    }

    onSubmit = e => {

        this.setState({changes: false});
        this.setState({loading: true});
        this.setState({process: true})

        const newCourse = {
            lesson: this.state.lesson,
            position: this.state.position,
        };

        // axios
        axios.post(baseURL + `/api/instructor/lesson/update?id=` + id, newCourse, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            this.setState({errors: {}})
            this.setState({changes: false});
            this.setState({process: false})
            this.setState({loading: false})
            this.setState({errorOpen: false})
            this.setState({successOpen: true})
            //window.location.href = "/instructor/lessons/" + this.state.courses.map(course => course.course);
        }).catch((err) => {
            this.setState({loading: false})
            this.setState({process: false})
            const errors = err.response.data
            if (errors.internalError) {
                this.setState({successOpen: false})
                this.setState({errorOpen: true})
            }
            console.log(errors);
            this.setState({errors});
        });
        // axios end

        e.preventDefault();

    };

    handleClose = () => {
        this.setState({successOpen: false})
    }

    render() {

        const {user} = this.props.auth;
        const {errors} = this.state;

        if (user.role === 3) {
            return <Redirect to="/all-courses"/>
        } else if (user.role === 1) {
            return <Redirect to="/admin"/>
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
                            severity="success"
                            sx={{width: '100%'}}
                        >
                            Lesson updated successfully!
                        </Alert>
                    </Snackbar>

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
                                            <a href={"/instructor/courses"}
                                               className="btn icon-master-btn con-mid" style={{marginTop: "10px"}}>
                                                <i className="material-icons-outlined btn-icon">sync</i>
                                            </a>
                                            :
                                            <a href={"/instructor/lessons/" + this.state.courses.map(course => course.course)}
                                               className="btn icon-master-btn con-mid" style={{marginTop: "10px"}}>
                                                <i className="material-icons-outlined btn-icon">arrow_back</i>
                                            </a>
                                        }

                                    </div>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <Typography variant="h4">
                                            <h4>Edit Lesson - &nbsp;
                                                {this.state.skeleton === true ?
                                                    <Skeleton style={{display: "inline-block", width: "100px"}}/>
                                                    :
                                                    this.state.courses.map(course => course.lesson)
                                                }
                                            </h4>
                                        </Typography>
                                    </div>
                                    <div style={{display: "inline-block", float: "right"}}>

                                        {this.state.skeleton === true ?
                                            <button
                                                style={{
                                                    width: "150px",
                                                    height: "35px",
                                                    margin: "1rem 0 2rem 3px"
                                                }}
                                                disabled
                                                className="btn btn-full-red">
                                                {this.state.delProcess === true ?
                                                    <CircularProgress style={{
                                                        color: "#ffffff",
                                                        padding: "10px",
                                                        marginTop: "-10px"
                                                    }}/> : "Delete"
                                                }
                                            </button>
                                            :
                                            <button
                                                style={{
                                                    width: "150px",
                                                    height: "35px",
                                                    margin: "1rem 0 2rem 3px"
                                                }}
                                                onClick={this.delCourse}
                                                className="btn btn-full-red">
                                                {this.state.delProcess === true ?
                                                    <CircularProgress style={{
                                                        color: "#ffffff",
                                                        padding: "10px",
                                                        marginTop: "-10px"
                                                    }}/> : "Delete"
                                                }
                                            </button>
                                        }

                                    </div>
                                </div>

                                <div className={"con-mid"} style={{width: "100%", margin: "30px 0"}}>
                                    <div className={"form-box"}>
                                        <div className={"form-inner"}>
                                            <form noValidate onSubmit={this.onSubmit}>
                                                <h4 style={{textAlign: "left", marginBottom: "24px"}}>Edit Lesson</h4>
                                                <div style={{marginBottom: "24px"}}>
                                                    {this.state.skeleton === true ?
                                                        <Skeleton style={{width: "100%", height: "53.63px"}} />
                                                        :
                                                        <TextField
                                                            id="lesson"
                                                            label="Lesson Name"
                                                            variant="outlined"
                                                            style={{width: "100%"}}
                                                            onChange={this.onChange}
                                                            value={this.state.lesson}
                                                            error={errors.lesson}
                                                            type="text"
                                                            placeholder=""
                                                            className={classnames("", {
                                                                invalid: errors.lesson
                                                            })}
                                                        />
                                                    }
                                                    <span className="red-text">
                                                        {errors.lesson}
                                                    </span>
                                                </div>
                                                <div>
                                                    <TextField
                                                        id="position"
                                                        label="Lesson position"
                                                        variant="outlined"
                                                        style={{width: "100%", display: "none"}}
                                                        onChange={this.onChange}
                                                        value={this.state.position}
                                                        error={errors.position}
                                                        type="number"
                                                        placeholder=""
                                                        className={classnames("", {
                                                            invalid: errors.position
                                                        })}
                                                    />
                                                    <span className="red-text">
                                                        {errors.position}
                                                    </span>
                                                </div>
                                                <div>
                                                    {this.state.changes === true ?
                                                        <button
                                                            style={{
                                                                width: "150px",
                                                                height: "35px",
                                                                marginTop: "1rem"
                                                            }}
                                                            type="submit"
                                                            className="btn btn-full-blue">
                                                            {this.state.process === true ?
                                                                <CircularProgress style={{
                                                                    color: "#ffffff",
                                                                    padding: "10px",
                                                                    marginTop: "-10px"
                                                                }}/> : "Update"
                                                            }
                                                        </button>
                                                        :
                                                        <button
                                                            style={{
                                                                width: "150px",
                                                                height: "35px",
                                                                marginTop: "1rem"
                                                            }}
                                                            disabled
                                                            className="btn btn-full-blue">
                                                            {this.state.process === true ?
                                                                <CircularProgress style={{
                                                                    color: "#ffffff",
                                                                    padding: "10px",
                                                                    marginTop: "-10px"
                                                                }}/> : "Update"
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
