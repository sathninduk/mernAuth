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
        name: "",
        title: "",
        body: "",
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

        axios.get(baseURL + `/api/admin/team/info?id=` + id, {
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
                let title = document.getElementById("title");
                let body = document.getElementById("body");

                name.value = courses[0].name;
                title.value = courses[0].title;
                body.value = courses[0].body;

                this.setState({name: courses[0].name});
                this.setState({title: courses[0].title});
                this.setState({body: courses[0].body});

            } else {
                window.location.href = "/admin/names/" + this.state.courses.map(course => course.course);
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


    onSubmit = e => {

        this.setState({changes: false});
        this.setState({loading: true});
        this.setState({process: true})

        const newCourse = {
            id: id,
            name: this.state.name,
            title: this.state.title,
            body: this.state.body
        };

        // axios
        axios.post(baseURL + `/api/admin/team/edit`, newCourse, {
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
            //window.location.href = "/admin/names/" + this.state.courses.map(course => course.course);
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
                            severity="success"
                            sx={{width: '100%'}}
                        >
                            name updated successfully!
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
                                        <a href={"/admin/homepage"}
                                           className="btn icon-master-btn con-mid" style={{marginTop: "10px"}}>
                                            <i className="material-icons-outlined btn-icon">arrow_back</i>
                                        </a>
                                    </div>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <Typography variant="h4">
                                            <h4>Edit team member - &nbsp;
                                                {this.state.skeleton === true ?
                                                    <Skeleton style={{display: "inline-block", width: "100px"}}/>
                                                    :
                                                    this.state.courses.map(course => course.name)
                                                }
                                            </h4>
                                        </Typography>
                                    </div>
                                </div>

                                <div className={"con-mid"} style={{width: "100%", margin: "30px 0"}}>
                                    <div className={"form-box"}>
                                        <div className={"form-inner"}>
                                            <form noValidate onSubmit={this.onSubmit}>
                                                <h4 style={{textAlign: "left", marginBottom: "24px"}}>Edit team member</h4>
                                                <div style={{marginBottom: "24px"}}>
                                                    {this.state.skeleton === true ?
                                                        <Skeleton style={{width: "100%", height: "53.63px"}}/>
                                                        :
                                                        <TextField
                                                            id="name"
                                                            label="Name"
                                                            variant="outlined"
                                                            style={{width: "100%"}}
                                                            onChange={this.onChange}
                                                            value={this.state.name}
                                                            error={errors.name}
                                                            type="text"
                                                            placeholder=""
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
                                                        <Skeleton style={{width: "100%", height: "53.63px"}}/>
                                                        :
                                                        <TextField
                                                            id="title"
                                                            label="Title"
                                                            variant="outlined"
                                                            style={{width: "100%"}}
                                                            onChange={this.onChange}
                                                            value={this.state.title}
                                                            error={errors.title}
                                                            type="text"
                                                            placeholder=""
                                                            className={classnames("", {
                                                                invalid: errors.title
                                                            })}
                                                        />}
                                                    <span className="red-text">
                                                        {errors.title}
                                                    </span>
                                                </div>
                                                <div style={{marginBottom: "24px"}}>
                                                    {this.state.skeleton === true ?
                                                        <Skeleton style={{width: "100%", height: "53.63px"}}/>
                                                        :
                                                        <TextField
                                                            id="body"
                                                            label="Body"
                                                            variant="outlined"
                                                            multiline
                                                            rows={5}
                                                            style={{width: "100%"}}
                                                            onChange={this.onChange}
                                                            value={this.state.body}
                                                            error={errors.body}
                                                            type="text"
                                                            placeholder=""
                                                            className={classnames("", {
                                                                invalid: errors.body
                                                            })}
                                                        />}
                                                    <span className="red-text">
                                                        {errors.body}
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
