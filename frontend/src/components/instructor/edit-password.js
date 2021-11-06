import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import {Redirect} from "react-router-dom";
import {TextField} from "@material-ui/core"
import axios from "axios";
import classnames from "classnames";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


//axios.defaults.baseURL = process.env.APP_URL
const baseURL = require("../../config/keys").API_URL;


class Dashboard extends Component {

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    state = {
        curPassword: "",
        password: "",
        confirmPassword: "",
        process: false,
        successOpen: false,
        errorOpen: false,
        loading: false,
        courses: [],
        errors: {}
    }

    componentDidMount = () => {

    }

    onChange = e => {
        this.setState({[e.target.id]: e.target.value});
    };

    onSubmit = e => {
        this.setState({loading: true});
        this.setState({process: true})
        const editUser = {
            curPassword: this.state.curPassword,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword
        };

        //if (!this.state.curPassword || !this.state.password || this.state.confirmPassword) {
        //alert("Please fill all fields");
        // } else {

        // axios
        axios.post(baseURL + `/api/instructor/settings/password`, editUser, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            //const persons = res.data;
            //this.setState({persons});
            this.setState({errors: {}});
            this.setState({loading: false});
            this.setState({process: false});
            this.setState({errorOpen: false})
            this.setState({successOpen: true})
            this.setState({curPassword: ""});
            this.setState({password: ""});
            this.setState({confirmPassword: ""});

            //window.location.href = "/login";
        }).catch((err) => {
            this.setState({loading: false});
            this.setState({process: false});
            const errors = err.response.data
            console.log(errors);
            this.setState({errors});
            if (errors.internalError) {
                this.setState({successOpen: false})
                this.setState({errorOpen: true})
            }
        });
        // axios end

        e.preventDefault();
        // }
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
                            Password updated successfully!
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
                                        <a href="/instructor" className="btn icon-master-btn con-mid"
                                           style={{marginTop: "10px"}}>
                                            <i className="material-icons-outlined btn-icon">arrow_back</i>
                                        </a>
                                    </div>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>

                                    </div>
                                    <div style={{display: "inline-block", float: "right"}}>

                                    </div>
                                </div>

                                <div className={"con-mid"} style={{width: "100%", margin: "30px 0"}}>
                                    <div className={"form-box"}>
                                        <div className={"form-inner"}>
                                            <form noValidate onSubmit={this.onSubmit}>
                                                <div style={{marginBottom: "19px"}}>
                                                    <h4 style={{textAlign: "left", marginBottom: "24px"}}>Change
                                                        password</h4>
                                                    <TextField
                                                        id="curPassword"
                                                        variant={"outlined"}
                                                        label={"Current Password"}
                                                        type={"password"}
                                                        onChange={this.onChange}
                                                        value={this.state.curPassword}
                                                        autoComplete='off'
                                                        style={{width: "100%"}}
                                                        error={errors.curPassword}
                                                        className={classnames("", {
                                                            invalid: errors.curPassword
                                                        })}
                                                    />
                                                    <span className="red-text">
                                        {errors.curPassword}
                                    </span>
                                                </div>
                                                <div style={{marginBottom: "19px"}}>
                                                    <TextField
                                                        id="password"
                                                        variant={"outlined"}
                                                        label={"New Password"}
                                                        type={"password"}
                                                        onChange={this.onChange}
                                                        value={this.state.password}
                                                        autoComplete='off'
                                                        style={{width: "100%"}}
                                                        error={errors.password}
                                                        className={classnames("", {
                                                            invalid: errors.password
                                                        })}
                                                    />
                                                    <span className="red-text">
                                        {errors.password}
                                    </span>
                                                </div>
                                                <div style={{marginBottom: "19px"}}>

                                                    <TextField
                                                        id="confirmPassword"
                                                        variant={"outlined"}
                                                        label={"Confirm New Password"}
                                                        type={"password"}
                                                        onChange={this.onChange}
                                                        value={this.state.confirmPassword}
                                                        autoComplete='off'
                                                        style={{width: "100%"}}
                                                        error={errors.confirmPassword}
                                                        className={classnames("", {
                                                            invalid: errors.confirmPassword
                                                        })}
                                                    />
                                                    <span className="red-text">
                                        {errors.confirmPassword}
                                    </span>
                                                </div>
                                                <div>
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
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});


export default connect(
    mapStateToProps,
    {logoutUser}
)(Dashboard);
