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
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

//axios.defaults.baseURL = process.env.APP_URL
const baseURL = require("../../config/keys").API_URL;

let pathname = window.location.pathname;
let id = pathname.split('/').pop();

class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            //topic: "",
            lesson: id,
            //video: "",
            //position: "",
            topicLast: "",
            process: false,
            disable: false,
            successOpen: false,
            errorOpen: false,
            skeleton: false,
            errors: {},
            topics: [],
            lessonsAll: []
        };
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };


    componentDidMount = () => {
        this.setState({loading: true});
        this.setState({skeleton: true});

        // topic
        let url_string = window.location.href;
        let url = new URL(url_string);
        const m = url.searchParams.get("m");

        if (m === 'success') {
            this.setState({successOpen: true});
        }

        if (this.props.auth.isAuthenticated) {
            //this.props.history.push("/admin/courses");
        }

        axios.get(baseURL + `/api/admin/lesson?id=` + id, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            this.setState({loading: false});
            this.setState({skeleton: false});
            document.getElementById("courseName").innerHTML = 'New Topic - Lesson: ' + res.data[0].lesson;
            const lessonsAll = res.data;
            this.setState({lessonsAll});
        }).catch((err) => {
            this.setState({loading: false});
            //this.setState({successOpen: false})
            this.setState({errorOpen: true})
            this.setState({skeleton: false});
        });

        // topics
        axios.get(baseURL + `/api/admin/topics?id=` + id, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            //this.setState({loading: false});
            //this.setState({skeleton: false});
            const topics = res.data;
            this.setState({topics});
        }).catch((err) => {
            this.setState({loading: false});
            //this.setState({successOpen: false})
            this.setState({errorOpen: true})
            this.setState({skeleton: false});
        });

        // last topic
        axios.get(baseURL + `/api/admin/topics/last?id=` + id, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            this.setState({loading: false});
            this.setState({skeleton: false});
            let topicLastRaw = parseInt(res.data[0].position);
            const topicLast = topicLastRaw + 1;
            console.log(topicLast)
            this.setState({topicLast});
        }).catch((err) => {
            this.setState({loading: false});
            //this.setState({successOpen: false})
            //this.setState({errorOpen: true})
            this.setState({skeleton: false});
        });

    }

    onChange = e => {
        this.setState({[e.target.id]: e.target.value});
    };

    onSubmit = e => {
        this.setState({disable: true});
        this.setState({process: true})
        this.setState({loading: true});

        const newTopic = {
            topic: document.getElementById("topic").value,
            video: document.getElementById("video").value,
            position: document.getElementById("position").value
        };

        // axios
        axios.post(baseURL + '/api/admin/topics/new?id=' + id, newTopic, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((response) => {
            this.setState({disable: false});
            this.setState({errors: {}})
            this.setState({process: false})
            this.setState({loading: false})
            this.setState({errorOpen: false})
            //window.location.reload();
            window.location = '/admin/topics/new/' + id + "?m=success"
            //this.setState({successOpen: true})

        }).catch((err) => {
            this.setState({disable: false});
            this.setState({loading: false})
            this.setState({process: false})
            const errors = err.response.data
            if (errors.internalError) {
                this.setState({errorOpen: true})
            }
            console.log(errors);
            this.setState({errors});
        });
        // axios end

        e.preventDefault();

        // this.props.registerUser(newCourse);
        // this.props.registerUser(newCourse, this.props.history);
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
                            Topic added successfully!
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
                                        {this.state.skeleton === true ?
                                            <a href={"/admin/courses"}
                                               className="btn icon-master-btn con-mid"
                                               style={{marginTop: "10px"}}>
                                                <i className="material-icons-outlined btn-icon">
                                                    sync
                                                </i>
                                            </a>
                                            :
                                            <a href={"/admin/lessons/" + this.state.lessonsAll.map(lessonInfo => lessonInfo.course)}
                                               className="btn icon-master-btn con-mid"
                                               style={{marginTop: "10px"}}>
                                                <i className="material-icons-outlined btn-icon">
                                                    arrow_back
                                                </i>
                                            </a>
                                        }
                                    </div>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <Typography variant="h4">
                                            {this.state.skeleton === true ?
                                                <Skeleton style={{width: "150px"}}/>
                                                :
                                                <h4 id={"courseName"}>
                                                </h4>
                                            }
                                        </Typography>
                                    </div>
                                </div>

                                <div className={"con-mid"} style={{width: "100%", margin: "30px 0"}}>
                                    <div className={"form-box"}>
                                        <div className={"form-inner"}>
                                            <form noValidate onSubmit={this.onSubmit}>
                                                <div style={{marginBottom: "24px"}}>
                                                    <h4 style={{textAlign: "left", marginBottom: "24px"}}>Add new
                                                        topic</h4>
                                                    <TextField
                                                        id="topic"
                                                        label={"Topic Name"}
                                                        variant={"outlined"}
                                                        //onChange={this.onChange}
                                                        //value={this.state.topic}
                                                        error={errors.topic}
                                                        type="text"
                                                        style={{width: "100%"}}
                                                        className={classnames("", {
                                                            invalid: errors.topic
                                                        })}
                                                    />
                                                    <span className="red-text">
                                                    {errors.topic}
                                                </span>
                                                </div>
                                                <div style={{marginBottom: "24px"}}>
                                                    <TextField
                                                        id="video"
                                                        label={"Video URL"}
                                                        variant={"outlined"}
                                                        //onChange={this.onChange}
                                                        //value={this.state.video}
                                                        error={errors.video}
                                                        type="text"
                                                        style={{width: "100%"}}
                                                        className={classnames("", {
                                                            invalid: errors.video
                                                        })}
                                                    />
                                                    <span className="red-text">
                                                    {errors.video}
                                                </span>
                                                </div>
                                                <div style={{marginBottom: "24px"}}>
                                                    {this.state.skeleton === true || this.state.loading === true ?
                                                        <div className={"select-textField"}>
                                                    <span className={classnames("select-top", {
                                                        invalidLabel: errors.position
                                                    })}>Lesson Position</span>
                                                            <br />
                                                            <Skeleton style={{
                                                                width: "100%",
                                                                height: "53.63px",
                                                                paddingTop: "20px"
                                                            }}/>
                                                            <span className="red-text">
                                                    {errors.position}
                                                </span>
                                                        </div>
                                                        :
                                                        <div className={"select-textField"}>
                                                    <span className={classnames("select-top", {
                                                        invalidLabel: errors.position
                                                    })}>Lesson Position</span>
                                                            <select id={"position"} className={classnames("", {
                                                                invalid: errors.position
                                                            })}>
                                                                {!this.state.topicLast ? "" :
                                                                    <option selected="selected"
                                                                            value={parseInt(this.state.topicLast)}>At
                                                                        the end
                                                                    </option>}
                                                                <option value={1}>At the beginning</option>
                                                                {this.state.topics.map(topic =>
                                                                    <option
                                                                        value={topic.position + 1}>After {topic.topic}</option>
                                                                )}
                                                            </select>
                                                            <span className="red-text">
                                                    {errors.position}
                                                </span>
                                                        </div>
                                                    }

                                                </div>


                                                <div>

                                                    {this.state.disable === true || this.state.skeleton === true ?
                                                        <button
                                                            style={{
                                                                width: "100%",
                                                                height: "48px"
                                                            }}
                                                            disabled
                                                            className="btn btn-full-blue">
                                                            {this.state.process === true ?
                                                                <CircularProgress style={{
                                                                    color: "#ffffff",
                                                                    padding: "10px",
                                                                    marginTop: "-3px"
                                                                }}/> : "Add"
                                                            }
                                                        </button>
                                                        :
                                                        <button
                                                            style={{
                                                                width: "100%",
                                                                height: "48px"
                                                            }}
                                                            type="submit"
                                                            className="btn btn-full-blue">
                                                            {this.state.process === true ?
                                                                <CircularProgress style={{
                                                                    color: "#ffffff",
                                                                    padding: "10px",
                                                                    marginTop: "-3px"
                                                                }}/> : "Add"
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
