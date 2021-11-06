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

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    state = {
        topic: "",
        video: "",
        position: "",
        delProcess: false,
        process: false,
        changes: false,
        successOpen: false,
        errorOpen: false,
        skeleton: false,
        errors: {},
        getTopic: []
    }

    componentDidMount = () => {
        this.setState({loading: true});
        this.setState({skeleton: true});

        axios.get(baseURL + `/api/admin/topic?id=` + id, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {

            this.setState({loading: false});
            this.setState({skeleton: false});

            const getTopic = res.data;

            console.log(getTopic[0]._id);

            if (getTopic[0]._id) {
                this.setState({getTopic});

                let topic = document.getElementById("topic");
                let video = document.getElementById("video");
                let position = document.getElementById("position");

                topic.value = getTopic[0].topic;
                video.value = getTopic[0].video;
                position.value = getTopic[0].position;

                this.setState({topic: getTopic[0].topic});
                this.setState({video: getTopic[0].video});
                this.setState({position: getTopic[0].position});
            } else {
                //window.location.href = "/admin/courses";
            }

        }).catch((err) => {
            this.setState({loading: false});
            //this.setState({successOpen: false})
            this.setState({errorOpen: true})
            this.setState({skeleton: false});
        });
    }

    onChange = e => {
        this.setState({changes: true});
        this.setState({[e.target.id]: e.target.value});
    };

    delCourse = e => {

        this.setState({loading: true});
        this.setState({delProcess: true})

        if (window.confirm('Are you sure you want to delete the topic "' + this.state.getTopic.map(course => course.topic) + '"?')) {
            console.log("del");
            // axios
            axios.post(baseURL + `/api/admin/topic/delete?id=` + id, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'x-access-token',
                    'x-access-token': localStorage.getItem("jwtToken")
                }
            }).then((res) => {
                //const persons = res.data;
                //this.setState({persons});
                this.setState({loading: false});
                this.setState({delProcess: false});
                window.location.href = "/admin/lessons/" + this.state.getTopic.map(course => course.course) + "?m=tdel";
            }).catch((err) => {
                this.setState({loading: false});
                this.setState({delProcess: false})
                const errors = err.response.data
                if (errors.internalError) {
                    this.setState({errorOpen: true})
                }
                console.log(errors);
                this.setState({errors});
            });
            // axios end

        } else {
            this.setState({loading: false});
            this.setState({delProcess: false})
            console.log("Deletion aborted")
        }

        e.preventDefault();
    }

    onSubmit = e => {

        this.setState({changes: false});
        this.setState({loading: true});
        this.setState({process: true})

        const newCourse = {
            topic: this.state.topic,
            video: this.state.video,
            position: this.state.position,
        };

        // axios
        axios.post(baseURL + `/api/admin/topic/update?id=` + id, newCourse, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            this.setState({changes: false});
            this.setState({errors: {}})
            this.setState({process: false})
            this.setState({loading: false})
            this.setState({errorOpen: false})
            this.setState({successOpen: true})
        }).catch((err) => {
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
                            Topic updated successfully!
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
                                        <a href={"/admin/lessons/" + this.state.getTopic.map(topicInfo => topicInfo.course)}
                                           className="btn icon-master-btn con-mid"
                                           style={{marginTop: "10px"}}>
                                            <i className="material-icons-outlined btn-icon">arrow_back</i>
                                        </a>
                                    </div>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <Typography variant="h4">
                                            {this.state.skeleton === true ?
                                                <h4 style={{display: "inline-block"}}>Edit Topic
                                                    -&nbsp;
                                                <Skeleton style={{width: "150px", display: "inline-block"}}/></h4>
                                                :
                                                <h4>Edit Topic
                                                    -&nbsp;{this.state.getTopic.map(topicInfo => topicInfo.topic)}</h4>
                                            }
                                        </Typography>
                                    </div>
                                    <div style={{display: "inline-block", float: "right"}}>
                                        {this.state.skeleton === true ?
                                            <button
                                                style={{
                                                    width: "150px",
                                                    height: "35px",
                                                    margin: "1rem 0 2rem 3px"
                                                }}
                                                disabled
                                                className="btn btn-full-red">
                                                {this.state.delProcess === true ?
                                                    <CircularProgress style={{
                                                        color: "#ffffff",
                                                        padding: "10px",
                                                        marginTop: "-10px"
                                                    }}/> : "Delete"
                                                }
                                            </button>
                                            :
                                            <button
                                                style={{
                                                    width: "150px",
                                                    height: "35px",
                                                    margin: "1rem 0 2rem 3px"
                                                }}
                                                onClick={this.delCourse}
                                                className="btn btn-full-red">
                                                {this.state.delProcess === true ?
                                                    <CircularProgress style={{
                                                        color: "#ffffff",
                                                        padding: "10px",
                                                        marginTop: "-10px"
                                                    }}/> : "Delete"
                                                }
                                            </button>
                                        }
                                    </div>
                                </div>

                                <div className={"con-mid"} style={{width: "100%", margin: "30px 0"}}>
                                    <div className={"form-box"}>
                                        <div className={"form-inner"}>
                                            <form noValidate onSubmit={this.onSubmit}>
                                                <h4 style={{textAlign: "left", marginBottom: "24px"}}>Edit Topic</h4>
                                                <div style={{marginBottom: "24px"}}>
                                                    {this.state.skeleton === true ?
                                                        <Skeleton style={{width: "100%", height: "53.36px"}}/>
                                                        :
                                                        <TextField
                                                            id={"topic"}
                                                            label={"Topic Name"}
                                                            variant={"outlined"}
                                                            onChange={this.onChange}
                                                            value={this.state.topic}
                                                            error={errors.topic}
                                                            type="text"
                                                            style={{width: "100%"}}
                                                            className={classnames("", {
                                                                invalid: errors.topic
                                                            })}
                                                        />
                                                    }
                                                    <span className="red-text">
                                                        {errors.topic}
                                                    </span>
                                                </div>
                                                <div style={{marginBottom: "24px"}}>
                                                    {this.state.skeleton === true ?
                                                        <Skeleton style={{width: "100%", height: "53.36px"}}/>
                                                        :
                                                        <TextField
                                                            id={"video"}
                                                            label={"Video URL"}
                                                            variant={"outlined"}
                                                            onChange={this.onChange}
                                                            value={this.state.video}
                                                            error={errors.video}
                                                            type="text"
                                                            style={{width: "100%"}}
                                                            className={classnames("", {
                                                                invalid: errors.video
                                                            })}
                                                        />
                                                    }
                                                    <span className="red-text">
                                                        {errors.video}
                                                    </span>
                                                </div>
                                                <div style={{marginBottom: "24px", display: "none"}}>
                                                    <TextField
                                                        id={"position"}
                                                        label={"Position"}
                                                        variant={"outlined"}
                                                        onChange={this.onChange}
                                                        value={this.state.position}
                                                        error={errors.position}
                                                        type="number"
                                                        style={{width: "100%"}}
                                                        className={classnames("", {
                                                            invalid: errors.position
                                                        })}
                                                    />
                                                    <span className="red-text">
                                                        {errors.position}
                                                    </span>
                                                </div>
                                                <div className="col s12">
                                                    {this.state.changes === true ?
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
                                                        :
                                                        <button
                                                            style={{
                                                                width: "150px",
                                                                height: "35px"
                                                            }}
                                                            disabled
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
