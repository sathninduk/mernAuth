import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import {Link, Redirect} from "react-router-dom";
import {TextField} from "@material-ui/core"
import axios from "axios";
import classnames from "classnames";
// mui
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


//axios.defaults.baseURL = process.env.APP_URL
const baseURL = require("../../config/keys").API_URL;

let pathname = window.location.pathname;
let id = pathname.split('/').pop();

class Dashboard extends Component {

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    state = {
        name: "",
        fee: "",
        summary: "",
        lessonsCount: "",
        delProcess: false,
        process: false,
        changes: false,
        successOpen: false,
        errorOpen: false,
        skeleton: false,
        errors: {},
        courses: []
    }

    componentDidMount = () => {
        this.setState({loading: true});
        this.setState({skeleton: true});

        axios.get(baseURL + `/api/instructor/course?id=` + id, {
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

                let name = document.getElementById("name");
                let fee = document.getElementById("fee");
                let summary = document.getElementById("summary");

                name.value = courses[0].name;
                fee.value = courses[0].fee;
                summary.value = courses[0].summary;

                this.setState({name: courses[0].name});
                this.setState({fee: courses[0].fee});
                this.setState({summary: courses[0].summary});
            } else {
                window.location.href = "/instructor/courses";
            }

        }).catch((err) => {
            this.setState({loading: false});
            this.setState({successOpen: false})
            this.setState({errorOpen: true})
            this.setState({skeleton: false});
        });


        axios.get(baseURL + `/api/instructor/lessons/count?id=` + id, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            const lessonsCount = parseInt(res.data);
            console.log(lessonsCount);
            this.setState({lessonsCount});

        }).catch((err) => {
            this.setState({loading: false});
            this.setState({skeleton: false});
            this.setState({successOpen: false})
            this.setState({errorOpen: true})
        });

    }

    delCourse = e => {

        this.setState({loading: true});
        this.setState({delProcess: true})

        if (window.confirm('Are you sure you want to delete the course "' + this.state.courses.map(course => course.name) + '"?')) {
            console.log("del");
            // axios
            axios.post(baseURL + `/api/instructor/course/delete?id=` + id, {
                course: this.state.courses.map(course => course.name)
            }, {
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
                window.location.href = "/instructor/courses?m=cdel";
            }).catch((err) => {
                this.setState({loading: false});
                this.setState({delProcess: false})
                console.log(err);
                //this.setState({loading: false}, () => {
                //});
            });
            // axios end
            e.preventDefault();

        } else {
            this.setState({loading: false});
            this.setState({delProcess: false})
            console.log("Deletion aborted")
        }

    }

    onBlockDelete = e => {
        alert("Please delete all lessons in this course first");
    }

    onSubmit = e => {
        this.setState({changes: false});
        this.setState({loading: true});
        this.setState({process: true})

        const newCourse = {
            name: this.state.name,
            fee: this.state.fee,
            summary: this.state.summary,
        };

        // axios
        axios.post(baseURL + `/api/instructor/course/update?id=` + id, newCourse, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            //const persons = res.data;
            //this.setState({persons});
            //window.location.href = "/instructor/courses";
            this.setState({changes: false});
            this.setState({errors: {}})
            this.setState({process: false})
            this.setState({loading: false})
            this.setState({errorOpen: false})
            this.setState({successOpen: true})
        }).catch((err) => {
            this.setState({loading: false})
            this.setState({process: false})
            let errors = err.response.data
            this.setState({errors})
            if (errors.internalError) {
                this.setState({successOpen: false})
                this.setState({errorOpen: true})
            }
            //this.setState({loading: false}, () => {
            //});
        });
        // axios end

        e.preventDefault();

    };

    onChange = e => {
        this.setState({changes: true});
        this.setState({fee: document.getElementById("fee").value});
        this.setState({[e.target.id]: e.target.value});
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
                            Course updated successfully!
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
                                        <Link to="/instructor/courses" className="btn icon-master-btn con-mid"
                                              style={{marginTop: "10px"}}>
                                            <i className="material-icons-outlined btn-icon">arrow_back</i>
                                        </Link>
                                    </div>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <Typography variant="h4">
                                            {this.state.skeleton === true ?
                                                <Skeleton style={{width: "200px"}}/>
                                                :
                                                <h4>{this.state.courses.map(course => course.name)}</h4>
                                            }
                                        </Typography>
                                    </div>
                                    <div style={{display: "inline-block", float: "right"}}>

                                        {this.state.lessonsCount === 0 ?
                                            <button
                                                style={{
                                                    width: "150px",
                                                    height: "35px",
                                                    margin: "1rem 0 2rem 3px"
                                                }}
                                                onClick={this.delCourse}
                                                className="btn btn-full-red">
                                                Delete
                                            </button>
                                            :
                                            <div onClick={this.onBlockDelete}>
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
                                            </div>
                                        }
                                    </div>
                                </div>

                                <div className={"con-mid"} style={{width: "100%", margin: "30px 0"}}>
                                    <div className={"form-box"}>
                                        <div className={"form-inner"}>
                                            <form noValidate onSubmit={this.onSubmit}>
                                                <div style={{marginBottom: "24px"}}>
                                                    <h4 style={{textAlign: "left", marginBottom: "24px"}}>Edit
                                                        course</h4>
                                                    {this.state.skeleton === true ?
                                                        <Skeleton style={{
                                                            width: "100%",
                                                            height: "90px",
                                                            marginTop: "-20px"
                                                        }}/>
                                                        :
                                                        <TextField
                                                            id="name"
                                                            variant={"outlined"}
                                                            label={"Course Name"}
                                                            onChange={this.onChange}
                                                            value={this.state.name}
                                                            error={errors.name}
                                                            type="text"
                                                            placeholder=""
                                                            style={{width: "100%"}}
                                                            className={classnames("", {
                                                                invalid: errors.name
                                                            })}
                                                        />
                                                    }
                                                    <span className="red-text">
                                                        {errors.name}
                                                    </span>
                                                </div>
                                                <div style={{marginBottom: "24px"}}>
                                                    {this.state.skeleton === true ?
                                                        <Skeleton style={{
                                                            width: "100%",
                                                            height: "90px",
                                                            marginTop: "-37px"
                                                        }}/>
                                                        :
                                                        <TextField
                                                            id="fee"
                                                            onChange={this.onChange}
                                                            variant={"outlined"}
                                                            label={"Course Fee (LKR)"}
                                                            value={this.state.fee}
                                                            error={errors.fee}
                                                            type="number"
                                                            style={{width: "100%"}}
                                                            className={classnames("", {
                                                                invalid: errors.fee
                                                            })}
                                                        />
                                                    }
                                                    <span className="red-text">
                                                        {errors.fee}
                                                    </span>
                                                </div>


                                                {this.state.skeleton === true ?
                                                    <div style={{marginBottom: "-4px"}}>
                                                        <Skeleton style={{
                                                            width: "100%",
                                                            height: "190px",
                                                            marginTop: "-56px"
                                                        }}/>
                                                    </div>
                                                    :
                                                    <div style={{marginBottom: "24px"}}>
                                                        <TextField
                                                            id="summary"
                                                            variant={"outlined"}
                                                            label={"Course Summary"}
                                                            multiline
                                                            rows={5}
                                                            type={"text"}
                                                            onChange={this.onChange}
                                                            value={this.state.summary}
                                                            placeholder=""
                                                            error={errors.summary}
                                                            style={{width: "100%"}}
                                                            className={classnames("", {invalid: errors.summary})}
                                                        />
                                                        <span className="red-text">
                                                        {errors.summary}
                                                    </span>
                                                    </div>
                                                }
                                                <div>
                                                    {this.state.changes === true ?
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
                                                                }}/> : "Update"
                                                            }
                                                        </button>
                                                        :
                                                        <button
                                                            style={{
                                                                width: "150px",
                                                                height: "35px"
                                                            }}
                                                            disabled
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
            )
                ;
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
