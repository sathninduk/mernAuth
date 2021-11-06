import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {loginUser} from "../../actions/authActions";
import {TextField} from "@material-ui/core"
import classnames from "classnames";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            loading: false,
            password: "",
            errors: {}
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Login page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            this.setState({loading: false});
            this.props.history.push("/dashboard");
        }

        if (nextProps.errors) {
            this.setState({loading: false});
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    onChange = e => {
        this.setState({[e.target.id]: e.target.value});
    };

    onSubmit = e => {
        this.setState({loading: true});
        e.preventDefault();

        const userData = {
            email: this.state.email,
            password: this.state.password
        };

        this.props.loginUser(userData);
    };

    render() {
        const {errors} = this.state;

        return (
            <div className={"mother"}>
                {this.state.loading === true ?
                    <LinearProgress style={{zIndex: "1000000"}} /> : ""
                }
                <div className="container">
                    <div style={{marginTop: "4rem"}} className="row">
                        <div className="col s8 offset-s2">

                            <div className={"login-card form-card con-mid"}>
                                <div className={"form-box"}>
                                    <div className={"form-inner"}>
                                        <div className="col s12">
                                            <h4 style={{color: "#000000"}}>
                                                <b>Sign in</b> below
                                            </h4>
                                            <p className="grey-text text-darken-1"
                                               style={{fontSize: "14px", padding: "10px 0 0 0"}}>
                                                Don't have an account? <a href="/register" style={{
                                                color: "#007FFF",
                                                textDecoration: "none"
                                            }}>Sign
                                                up</a>
                                            </p>
                                        </div>

                                        <form noValidate onSubmit={this.onSubmit}>
                                            <div className="input-field col s12" style={{marginBottom: "24px"}}>
                                                <TextField
                                                    id="email"
                                                    label="Email"
                                                    variant="filled"
                                                    type="email"
                                                    onChange={this.onChange}
                                                    value={this.state.email}
                                                    error={errors.email}
                                                    style={{width: "100%"}}
                                                    className={classnames("", {
                                                        invalid: errors.email || errors.emailnotfound
                                                    })}
                                                />
                                                <span className="red-text">{errors.email}{errors.emailnotfound}</span>
                                            </div>
                                            <div className="input-field col s12">
                                                <TextField
                                                    id="password"
                                                    label="Password"
                                                    variant="filled"
                                                    type="password"
                                                    onChange={this.onChange}
                                                    value={this.state.password}
                                                    error={errors.password}
                                                    style={{width: "100%"}}
                                                    className={classnames("", {
                                                        invalid: errors.password || errors.passwordincorrect
                                                    })}
                                                />
                                                <span
                                                    className="red-text">{errors.password}{errors.passwordincorrect}</span>
                                                <p className="grey-text text-darken-1">
                                                    <a className={"forgot-pw"} href="/forgot">Forgot Password?</a>
                                                </p>
                                            </div>
                                            <div className="col s12">
                                                <button
                                                    style={{
                                                        width: "100%",
                                                        marginTop: "1rem",
                                                        height: "48px"
                                                    }}
                                                    type="submit"
                                                    className="btn btn-full-blue"
                                                >
                                                    {this.state.loading === true ?
                                                        <CircularProgress style={{
                                                            color: "#ffffff",
                                                            padding: "10px",
                                                            marginTop: "-4px"
                                                        }}/> : "Sign in"
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

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    {loginUser}
)(Login);
