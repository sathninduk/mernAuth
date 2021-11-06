import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import {Redirect} from "react-router-dom";
import {TextField} from "@material-ui/core"
import axios from "axios";
import classnames from "classnames";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";

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
        tel: "",
        process: false,
        skeleton: false,
        loading: false,
        errorOpen: false,
        errors: {}
    }

    componentDidMount = () => {
        this.setState({loading: true});
        this.setState({skeleton: true});

        axios.get(baseURL + `/api/admin/user?id=` + id, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            this.setState({loading: false});
            this.setState({skeleton: false});
            const user = res.data;
            let nameIn = document.getElementById("name");
            let telIn = document.getElementById("tel");
            nameIn.value = user.name;
            telIn.value = user.tel;
            this.setState({name: user.name});
            this.setState({tel: user.tel});
        }).catch((err) => {
            this.setState({skeleton: false});
            this.setState({loading: false}, () => {
            });
        });
    }

    onChange = e => {
        this.setState({[e.target.id]: e.target.value});
    };


    onSubmit = e => {
        this.setState({errors: {}});
        this.setState({errorOpen: false});
        this.setState({process: true});

        const editUser = {
            id: id,
            name: this.state.name,
            tel: this.state.tel,
            successOpen: false
        };

        // axios
        axios.post(baseURL + `/api/admin/users/edit`, editUser, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            //const persons = res.data;
            //this.setState({persons});
            //window.location.href = "/admin/users";
            this.setState({process: false});
            this.setState({errors: {}});
            this.setState({successOpen: true});
        }).catch((err) => {
            this.setState({process: false});
            this.setState({errorOpen: false})
            this.setState({successOpen: false});
            let errors = err.response.data
            this.setState({errors})
            if (errors.internalError) {
                this.setState({successOpen: false})
                this.setState({errorOpen: true})
            }
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
                    {this.state.loading === true || this.state.skeleton || this.state.process === true ?
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
                            User updated successfully!
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
                                        <a href={"/admin/users"}
                                           className="btn icon-master-btn con-mid" style={{marginTop: "10px"}}>
                                            <i className="material-icons-outlined btn-icon">arrow_back</i>
                                        </a>
                                    </div>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        {/*<h4>Edit Lesson - {this.state.user.map(userInfo => userInfo[0]._id)}</h4>*/}
                                        <h4 style={{display: "inline-block"}}>Edit -&nbsp;
                                            {this.state.skeleton === true ?
                                                    <Skeleton style={{width: "150px", display: "inline-block"}}/>
                                                :
                                                this.state.name
                                            }
                                        </h4>
                                    </div>

                                </div>

                                <div className={"con-mid"} style={{width: "100%", margin: "30px 0"}}>
                                    <div className={"form-box"}>
                                        <div className={"form-inner"}>
                                            <form noValidate onSubmit={this.onSubmit}>
                                                <h4 style={{textAlign: "left", marginBottom: "24px"}}>Edit user</h4>
                                                <div style={{marginBottom: "24px"}}>
                                                    {this.state.skeleton === true ?
                                                        <Skeleton style={{width: "100%", height: "53.63px"}}/>
                                                        :
                                                        <TextField
                                                            id="name"
                                                            required
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

                                                    <span className={"red-text"}>{errors.name}</span>
                                                </div>
                                                <div>
                                                    {this.state.skeleton === true ?
                                                        <Skeleton style={{width: "100%", height: "53.63px"}}/>
                                                        :
                                                        <TextField
                                                            id="tel"
                                                            required
                                                            label="Contact Number"
                                                            variant="outlined"
                                                            style={{width: "100%"}}
                                                            onChange={this.onChange}
                                                            value={this.state.tel}
                                                            error={errors.tel}
                                                            type="text"
                                                            placeholder=""
                                                            className={classnames("", {
                                                                invalid: errors.tel
                                                            })}
                                                        />}

                                                    <span className="red-text">
                                                        {errors.tel}
                                                    </span>
                                                </div>
                                                <div>
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
