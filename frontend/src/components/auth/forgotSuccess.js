import React, {Component} from "react";
import {connect} from "react-redux";
import {forgotPassword} from "../../actions/authActions";
import LinearProgress from "@mui/material/LinearProgress";

class Login extends Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        // If logged in and user navigates to Login page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }
    }

    render() {

        // this.setState({requestSent: "Password recovery link sent, Please check your email"})
        return (
            <div className={"mother"}>
                {this.state.isLoading === true ?
                    <LinearProgress style={{zIndex: "1000000"}}/> : ""
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
                                            <p>
                                                A password reset link was sent to your email. Click the link to create a new password.
                                            </p>
                                            <br />
                                            <p style={{width: "100%"}} className={"con-right"}>
                                                <a href={"/forgot"} className={"btn btn-full-blue"}
                                                   style={{width: "150px", height: "38px"}}>Resend link</a>
                                            </p>
                                        </div>
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
