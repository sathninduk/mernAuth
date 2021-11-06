import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {instructorAdminRegisterUser} from "../../actions/authActions";
import classnames from "classnames";
import {TextField} from "@material-ui/core";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";

class Register extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            tel: "",
            email: "",
            password: "",
            password2: "",
            process: false,
            errors: {}
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({process: false})
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    onChange = e => {
        this.setState({[e.target.id]: e.target.value});
    };

    onSubmit = e => {
        this.setState({process: true})
        e.preventDefault();

        const newUser = {
            name: this.state.name,
            tel: this.state.tel,
            email: this.state.email,
            role_req: 2,
            password: this.state.password,
            password2: this.state.password2
        };

        this.props.instructorAdminRegisterUser(newUser, this.props.history)
    };

    render() {
        const {errors} = this.state;

        return (
            <div className={"mother"}>
                {this.state.process === true ?
                    <LinearProgress style={{zIndex: "1000000"}} /> : ""
                }
                <div className="container valign-wrapper">
                    <div className="container">
                        <div className="row">
                            <div className="col s8 offset-s2">

                                <div id={"head-topic"} style={{marginTop: "64px"}}>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <Link to="/admin/instructors" className="btn icon-master-btn con-mid"
                                              style={{marginTop: "10px"}}>
                                            <i className="material-icons-outlined btn-icon">arrow_back</i>
                                        </Link>
                                    </div>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <h4>Register instructors</h4>
                                    </div>
                                </div>

                                <div className={"login-card form-card con-mid"} style={{minHeight: "inherit"}}>
                                    <div className={"form-box"} style={{marginBottom: "50px"}}>
                                        <div className={"form-inner"}>
                                            <div className="col s12" style={{marginBottom: "24px"}}>
                                                <h4>
                                                    Add New Instructor
                                                </h4>
                                            </div>
                                            <form noValidate onSubmit={this.onSubmit}>
                                                <div style={{marginBottom: "24px"}}>
                                                    <TextField
                                                        onChange={this.onChange}
                                                        autoComplete="new-name"
                                                        variant={"outlined"}
                                                        label={"Name"}
                                                        style={{width: "100%"}}
                                                        value={this.state.name}
                                                        error={errors.name}
                                                        id="name"
                                                        type="text"
                                                        className={classnames("", {
                                                            invalid: errors.name
                                                        })}
                                                    />
                                                    <span className="red-text">{errors.name}</span>
                                                </div>
                                                <div style={{marginBottom: "24px"}}>
                                                    <TextField
                                                        onChange={this.onChange}
                                                        autoComplete="new-tel"
                                                        variant={"outlined"}
                                                        label={"Contact Number"}
                                                        style={{width: "100%"}}
                                                        value={this.state.tel}
                                                        error={errors.tel}
                                                        id="tel"
                                                        type="text"
                                                        className={classnames("", {
                                                            invalid: errors.tel
                                                        })}
                                                    />
                                                    <span className="red-text">{errors.tel}</span>
                                                </div>
                                                <div style={{marginBottom: "24px"}}>
                                                    <TextField
                                                        onChange={this.onChange}
                                                        autoComplete="new-email"
                                                        variant={"outlined"}
                                                        label={"Email"}
                                                        style={{width: "100%"}}
                                                        value={this.state.email}
                                                        error={errors.email}
                                                        id="email"
                                                        type="email"
                                                        className={classnames("", {
                                                            invalid: errors.email
                                                        })}
                                                    />
                                                    <span className="red-text">{errors.email}</span>
                                                </div>
                                                <div style={{marginBottom: "24px"}}>
                                                    <TextField
                                                        onChange={this.onChange}
                                                        autoComplete="new-password"
                                                        variant={"outlined"}
                                                        label={"Password"}
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
                                                        autoComplete="new-password2"
                                                        variant={"outlined"}
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
                                                    <span className="red-text">{errors.password2}</span>
                                                </div>
                                                <div className="col s12">
                                                    <button
                                                        style={{
                                                            width: "100%",
                                                            height: "48px"
                                                        }}
                                                        type="submit"
                                                        className="btn btn-full-blue"
                                                    >
                                                        {this.state.process === true ?
                                                            <CircularProgress style={{
                                                                color: "#ffffff",
                                                                padding: "10px",
                                                                marginTop: "-5px"
                                                            }}/> : "Register"
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
            </div>
        );
    }
}

Register.propTypes = {
    instructorAdminRegisterUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    {instructorAdminRegisterUser}
)(withRouter(Register));
