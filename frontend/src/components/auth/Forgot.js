import React, {Component} from "react";
import {connect} from "react-redux";
import {forgotPassword} from "../../actions/authActions";
import classnames from "classnames";
import {TextField} from "@material-ui/core";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            isLoading: false,
            errors: {},
            success: {}
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
            this.setState({isLoading: false});
            this.props.history.push("/dashboard");
        }

        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
            this.setState({isLoading: false});
            //document.getElementById("submitBtn").innerHTML = "Submit";
        }

        // this.setState({requestSent: "Password recovery link sent, Please check your email"})

    }


    onChange = e => {
        this.setState({[e.target.id]: e.target.value});
        //this.setState({ isLoading: false });
        document.getElementById("submitBtn").innerHTML = "Submit";
    };

    onSubmit = e => {
        this.setState({isLoading: true});
        document.getElementById("submitBtn").innerHTML = "Loading...";
        e.preventDefault();

        const userData = {
            email: this.state.email
        };

        this.props.forgotPassword(userData);
    };


    render() {
        const {errors} = this.state;
        //const {success} = this.state;

        if (errors.requestSent) {
            //document.getElementById("email").value = "";
            //setTimeout(function(){
            //window.location.href = '/login';
            document.getElementById("submitBtn").innerHTML = "Resend";
            //}, 1000);
        }

        // this.setState({requestSent: "Password recovery link sent, Please check your email"})
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
                                        <div className="col s12" style={{paddingLeft: "11.250px"}}>
                                            <h4>
                                                <b>Forgot</b> password
                                            </h4>
                                            <p className="grey-text text-darken-1">
                                                <a href="/login" style={{color: "#007FFF"}}>Back to login</a>
                                            </p>
                                        </div>
                                        <form noValidate onSubmit={this.onSubmit} style={{marginTop: "24px"}}>
                                            <div className="input-field col s12">
                                                <TextField
                                                    onChange={this.onChange}
                                                    variant={"filled"}
                                                    value={this.state.email}
                                                    error={errors.email}
                                                    label={"Email"}
                                                    id="email"
                                                    type="email"
                                                    style={{width: "100%"}}
                                                    className={classnames("", {
                                                        invalid: errors.email || errors.emailnotfound || errors.errorsendingemail
                                                    })}
                                                />
                                                <span className="red-text">
                                              {errors.email ||
                                              errors.emailnotfound ||
                                              errors.errorsendingemail}
                                            </span>
                                                <span className={"green-text"}>
                                              {errors.requestSent}
                                            </span>
                                            </div>
                                            <div style={{marginTop: "24px"}}>
                                                <button
                                                    style={{
                                                        width: "100%",
                                                        height: "48px"
                                                    }}
                                                    type="submit"
                                                    id={"submitBtn"}
                                                    className="btn btn-full-blue"
                                                >
                                                    {this.state.isLoading === true ?
                                                        <CircularProgress style={{
                                                            color: "#ffffff",
                                                            padding: "10px",
                                                            marginTop: "-4px"
                                                        }}/> : "Submit"
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

/*Login.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};*/

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors,
    success: state.success
});

export default connect(
    mapStateToProps,
    {forgotPassword}
)(Login);
