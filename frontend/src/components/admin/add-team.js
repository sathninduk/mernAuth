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
            title: "",
            body: "",
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
            //this.props.history.push("/admin/courses");
        }

        this.setState({loading: false});

    }

    onChange = e => {
        this.setState({[e.target.id]: e.target.value});
    };

    onSubmit = e => {

        let newPast = new FormData();
        newPast.append('name', this.state.name)
        newPast.append('title', this.state.title)
        newPast.append('body', this.state.body)
        newPast.append('slip', document.getElementById("slip").files[0])

        this.setState({loading: true});
        this.setState({process: true});


        // axios
        axios.post(baseURL + `/api/admin/team`, newPast, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-access-token': localStorage.getItem("jwtToken"),
            }
        }).then((response) => {
            this.setState({loading: false});
            this.setState({errors: {}});
            this.setState({name: ""});
            this.setState({title: ""});
            this.setState({body: ""});
            document.getElementById("slip").value = ""
            this.setState({process: false});
            this.setState({errorOpen: false})
            this.setState({successOpen: true})

            //window.location.href = "/admin/courses";
        }).catch((err) => {
            this.setState({loading: false});
            this.setState({process: false});
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
                            Record added successfully!
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
                                        <Link to="/admin/homepage" className="btn icon-master-btn con-mid"
                                              style={{marginTop: "10px"}}>
                                            <i className="material-icons-outlined btn-icon">arrow_back</i>
                                        </Link>
                                    </div>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <h4>Add new student voice</h4>
                                    </div>
                                </div>
                                <div className={"con-mid"} style={{width: "100%", margin: "30px 0 70px 0"}}>
                                    <div className={"form-box"}>
                                        <div className={"form-inner"}>
                                            <div className="col s12" style={{marginBottom: "24px"}}>
                                                <h4 style={{textAlign: "left"}}>
                                                    New student voice
                                                </h4>
                                            </div>
                                            <form onSubmit={this.onSubmit}>
                                                <div style={{marginBottom: "24px"}}>
                                                    <TextField
                                                        onChange={this.onChange}
                                                        value={this.state.name}
                                                        variant={"outlined"}
                                                        autoComplete="new-name"
                                                        label={"Name"}
                                                        error={errors.name}
                                                        id="name"
                                                        type="text"
                                                        style={{width: "100%"}}
                                                        className={classnames("", {
                                                            invalid: errors.name
                                                        })}
                                                    />
                                                    <span className="red-text">{errors.name}</span>
                                                </div>
                                                <div style={{marginBottom: "24px"}}>
                                                    <TextField
                                                        onChange={this.onChange}
                                                        value={this.state.title}
                                                        error={errors.title}
                                                        id="title"
                                                        variant={"outlined"}
                                                        autoComplete="new-title"
                                                        label={"Title"}
                                                        style={{width: "100%"}}
                                                        type="text"
                                                        className={classnames("", {
                                                            invalid: errors.title
                                                        })}
                                                    />
                                                    <span className="red-text">{errors.title}</span>
                                                </div>
                                                <div style={{marginBottom: "24px"}}>
                                                    <TextField
                                                        onChange={this.onChange}
                                                        value={this.state.body}
                                                        error={errors.body}
                                                        id="body"
                                                        multiline
                                                        rows={5}
                                                        variant={"outlined"}
                                                        autoComplete="new-title"
                                                        label={"Body"}
                                                        style={{width: "100%"}}
                                                        type="text"
                                                        className={classnames("", {
                                                            invalid: errors.body
                                                        })}
                                                    />
                                                    <span className="red-text">{errors.body}</span>
                                                </div>
                                                <div style={{marginBottom: "24px"}}>
                                                    <div style={{marginBottom: "24px"}}>
                                                        <ul>
                                                            <li style={{textAlign: "left"}}>Only <b>PNG</b> files are allowed</li>
                                                            <li style={{textAlign: "left"}}>The maximum file size is <b>5MB</b></li>
                                                            <li style={{textAlign: "left"}}>File dimensions should be <b>(200x200)px</b></li>
                                                        </ul>
                                                    </div>
                                                    <input accept="image/PNG"
                                                           id={"slip"}
                                                           style={{width: "280px"}}
                                                           className="custom-file-input"
                                                           name={"slip"}
                                                           required
                                                           type="file"/>
                                                    <span className="red-text">{errors.file}</span>
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
