import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import {Link, Redirect} from "react-router-dom";
import {TextField} from "@material-ui/core"
import axios from "axios";
import classnames from "classnames";
// mui
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

//axios.defaults.baseURL = process.env.APP_URL
const baseURL = require("../../config/keys").API_URL;

class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            name: "",
            fee: "",
            summary: "",
            successOpen: false,
            errorOpen: false,
            errors: {}
        };
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    componentDidMount = () => {
        this.setState({loading: true});

        if (this.props.auth.isAuthenticated) {
            //this.props.history.push("/instructor/courses");
        }

        this.setState({loading: false});

    }

    onChange = e => {
        this.setState({[e.target.id]: e.target.value});
    };

    onSubmit = e => {

        this.setState({loading: true});

        const newCourse = {
            name: this.state.name,
            fee: this.state.fee,
            summary: this.state.summary,
        };

        // axios
        axios.post(baseURL + `/api/instructor/courses`, newCourse, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((response) => {
            this.setState({loading: false});
            this.setState({errors: {}});
            this.setState({name: ""});
            this.setState({fee: ""});
            this.setState({summary: ""});
            this.setState({errorOpen: false})
            this.setState({successOpen: true})

            //window.location.href = "/instructor/courses";
        }).catch((err) => {
            this.setState({loading: false});
            const errors = err.response.data
            if (errors.internalError) {
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
                            Course added successfully!
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
                                        <h4>New Course</h4>
                                    </div>
                                </div>
                                <div className={"con-mid"} style={{width: "100%", margin: "30px 0 70px 0"}}>
                                    <div className={"form-box"}>
                                        <div className={"form-inner"}>
                                            <form noValidate onSubmit={this.onSubmit}>
                                                <div style={{marginBottom: "24px"}}>
                                                    <h4 style={{textAlign: "left", marginBottom: "24px"}}>Add new
                                                        course</h4>
                                                    <TextField
                                                        id="name"
                                                        onChange={this.onChange}
                                                        variant={"outlined"}
                                                        label={"Course Name"}
                                                        value={this.state.name}
                                                        error={errors.name}
                                                        type="text"
                                                        style={{width: "100%"}}
                                                        className={classnames("", {
                                                            invalid: errors.name
                                                        })}
                                                    />
                                                    <span className="red-text">
                                                        {errors.name}
                                                    </span>
                                                </div>
                                                <div style={{marginBottom: "24px"}}>
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
                                                    <span className="red-text">
                                                        {errors.fee}
                                                    </span>
                                                </div>
                                                <div style={{marginBottom: "24px"}}>
                                                    <TextField
                                                        id="summary"
                                                        label={"Course Summary (Max 1300)"}
                                                        variant={"outlined"}
                                                        multiline
                                                        rows={5}
                                                        error={errors.summary}
                                                        onChange={this.onChange}
                                                        value={this.state.summary}
                                                        style={{width: "100%"}}
                                                        className={classnames("", {invalid: errors.summary})}
                                                    />
                                                    <span className="red-text">
                                                        {errors.summary}
                                                    </span>
                                                </div>
                                                <div style={{marginBottom: "30px"}}>
                                                    <button
                                                        style={{
                                                            width: "100%",
                                                            height: "48px"
                                                        }}
                                                        type="submit"
                                                        className="btn btn-full-blue">
                                                        {this.state.loading === true ?
                                                            <CircularProgress style={{
                                                                color: "#ffffff",
                                                                padding: "10px",
                                                                marginTop: "-3px"
                                                            }}/> : "Add"
                                                        }
                                                    </button>
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
