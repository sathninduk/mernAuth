import React, {Component} from "react";
import {Redirect, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {resetPassword} from "../../actions/authActions";
import classnames from "classnames";
import axios from "axios";
import PropTypes from "prop-types";
import {TextField} from "@material-ui/core";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";

//axios.defaults.baseURL = process.env.APP_URL
const baseURL = require("../../config/keys").API_URL;


class Reset extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: false,
            password: "",
            password2: "",
            msg: "",
            errors: {}
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Login page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
            //this.setState({isLoading: true});
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }

        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
            this.setState({isLoading: false});
        }
    }

    onChange = e => {
        this.setState({[e.target.id]: e.target.value});
        this.setState({isLoading: false});
    };
    onSubmit;


    render() {
        const {errors} = this.state;
        const param = new URLSearchParams(this.props.location.search).get("id");

        if (!param) {
            return <Redirect to="/login"/>
        } else {

            this.onSubmit = e => {
                e.preventDefault();
                this.setState({isLoading: true});

                const resetData = {
                    tokenId: param,
                    password: this.state.password,
                    password2: this.state.password2
                };

                this.props.resetPassword(resetData, this.props.history);
            };

            axios.get(baseURL + '/api/users/forgot-change-password', {params: {id: param}})
                .then(function (res) {
                    const tokenStatus = res.data.msg;
                    console.log(tokenStatus);
                    if (tokenStatus === 1) {
                        document.getElementById("tokenCheck").style.display = "none";
                        document.getElementById("token1").style.display = "block";
                        document.getElementById("token2").style.display = "none";
                        document.getElementById("topic").style.display = "none";
                        document.getElementById("mainForm").style.display = "none";
                    } else if (tokenStatus === 2) {
                        document.getElementById("tokenCheck").style.display = "none";
                        document.getElementById("token1").style.display = "none";
                        document.getElementById("token2").style.display = "block";
                        document.getElementById("topic").style.display = "none";
                        document.getElementById("mainForm").style.display = "none";
                    } else if (tokenStatus === 200) {
                        document.getElementById("tokenCheck").style.display = "none";
                        document.getElementById("token1").style.display = "none";
                        document.getElementById("token2").style.display = "none";
                        document.getElementById("topic").style.display = "block";
                        document.getElementById("mainForm").style.display = "block";
                    } else {
                        window.location.replace("/login");
                    }
                })
                .catch(err =>
                    console.log(err)
                );

            return (
                <div className={"mother"}>
                    {this.state.isLoading === true ?
                        <LinearProgress style={{zIndex: "1000000"}} /> : ""
                    }
                    <div className="container">
                        <div className="row">
                            <div className="col s8 offset-s2">

                                <div className={"login-card form-card con-mid"}>
                                    <div className={"form-box"} style={{marginTop: "50px", marginBottom: "50px"}}>
                                        <div className={"form-inner"}>
                                            <div className="col s12" id={"topic"} style={{marginBottom: "24px",}}>
                                                <h4>
                                                    <b>Recover</b> password
                                                </h4>
                                            </div>
                                            <div className="col s12" id={"tokenCheck"}>
                                                <p>Checking...</p>
                                            </div>
                                            <div className="col s12" style={{display: "none"}}
                                                 id={"token1"}>
                                                <h4><b>Sorry!</b></h4>
                                                <h4>Your recovery link has been expired</h4>
                                                <div className="col s12 con-mid"
                                                     style={{width: "100%", marginTop: "24px"}}>
                                                    <a
                                                        style={{
                                                            width: "150px",
                                                            height: "35px"
                                                        }}
                                                        href={"/forgot"}
                                                        className="btn btn-full-blue"
                                                    >
                                                        Try again
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="col s12" style={{display: "none"}}
                                                 id={"token2"}>
                                                <h4><b>Sorry!</b> Your account has been deleted</h4>
                                            </div>
                                            <form noValidate onSubmit={this.onSubmit} id={"mainForm"}
                                                  style={{display: "none"}}>
                                                <div style={{marginBottom: "24px"}}>
                                                    <TextField
                                                        onChange={this.onChange}
                                                        variant={"filled"}
                                                        label={"New Password"}
                                                        style={{width: "100%"}}
                                                        value={this.state.password}
                                                        error={errors.password}
                                                        id="password"
                                                        type="password"
                                                        className={classnames("", {
                                                            invalid: errors.password
                                                        })}
                                                    />
                                                    <span className="red-text">{errors.password}</span>
                                                </div>
                                                <div style={{marginBottom: "24px"}}>
                                                    <TextField
                                                        onChange={this.onChange}
                                                        variant={"filled"}
                                                        label={"Confirm Password"}
                                                        style={{width: "100%"}}
                                                        value={this.state.password2}
                                                        error={errors.password2}
                                                        id="password2"
                                                        type="password"
                                                        className={classnames("", {
                                                            invalid: errors.password2
                                                        })}
                                                    />
                                                    <span className="red-text">{
                                                        errors.password2 ||
                                                        errors.invalidtoken ||
                                                        errors.accountDelete ||
                                                        errors.AdminPassword ||
                                                        errors.passwordMissMatch ||
                                                        errors.expiredLink
                                                    }</span>
                                                </div>
                                                <div className="col s12">
                                                    <button
                                                        id={"resetBtn"}
                                                        style={{
                                                            width: "100%",
                                                            height: "48px"
                                                        }}
                                                        type="submit"
                                                        className="btn btn-full-blue"
                                                    >
                                                        {this.state.isLoading === true ?
                                                            <CircularProgress style={{
                                                                color: "#ffffff",
                                                                padding: "10px",
                                                                marginTop: "-4px"
                                                            }}/> : "Reset"
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

Reset.propTypes = {
    resetPassword: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    {resetPassword}
)(withRouter(Reset));
