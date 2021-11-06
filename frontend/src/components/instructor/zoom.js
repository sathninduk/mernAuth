import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import {Redirect} from "react-router-dom";
import {TextField, Typography} from "@material-ui/core"
import axios from "axios";
import classnames from "classnames";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Skeleton from "@mui/material/Skeleton";

//axios.defaults.baseURL = process.env.APP_URL
const baseURL = require("../../config/keys").API_URL;

let pathname = window.location.pathname;
let id = pathname.split('/').pop();

const curTime = new Date().toISOString();

console.log(curTime);

class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            link: "",
            zoomStart: "",
            zoomEnd: "",
            start: "",
            end: "",
            loading: false,
            process: false,
            delProcess: false,
            errors: {},
            lessonsAll: []
        };
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };


    componentDidMount = () => {
        this.setState({loading: true});

        axios.get(baseURL + `/api/instructor/course?id=` + id, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {

            this.setState({loading: false});

            const lessonsAll = res.data;
            this.setState({lessonsAll});

            const zoomStart = new Date(lessonsAll[0].zoomStart);
            const zoomEnd = new Date(lessonsAll[0].zoomEnd);

            document.getElementById("courseName").innerHTML = 'New zoom - ' + lessonsAll[0].name;
            document.getElementById("zoomStart").innerHTML = String(zoomStart);
            document.getElementById("zoomEnd").innerHTML = String(zoomEnd);

        }).catch((err) => {
            this.setState({loading: false}, () => {
            });
        });
    }

    onChange = e => {
        this.setState({[e.target.id]: e.target.value});
    };


    onSubmit = e => {
        this.setState({process: true});

        if (this.state.start > this.state.end) {
            return alert("invalid dates and times")
        } else if (new Date(this.state.start).getTime() < new Date().getTime()) {
            return alert("invalid starting date & time")
        } else if (new Date(this.state.end).getTime() < new Date().getTime()) {
            return alert("invalid ending date & time")
        } else {

            const newZoom = {
                link: this.state.link,
                start: this.state.start,
                end: this.state.end
            };

            // axios
            axios.post(baseURL + '/api/instructor/zoom/new?course=' + id, newZoom, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'x-access-token',
                    'x-access-token': localStorage.getItem("jwtToken")
                }
            }).then((response) => {
                this.setState({process: false});
                //alert("Zoom link updated successfully");
                window.location.reload();
                //this.setState({persons});
            }).catch((err) => {
                this.setState({process: false});
                let errors = err.response.data;
                this.setState({errors});
                //this.setState({loading: false}, () => {
                //});
            });


            // axios end

            e.preventDefault();
        }
    };


    delProcessBtn = e => {
        //this.setState({delProcess: true});

        // axios
        axios.post(baseURL + '/api/instructor/zoom/delete?course=' + id, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((response) => {
            this.setState({delProcess: false});
            //alert("Zoom link updated successfully");
            window.location.reload();
            //this.setState({persons});
        }).catch((err) => {
            this.setState({delProcess: false});
            let errors = err.response.data;
            this.setState({errors});
            //this.setState({loading: false}, () => {
            //});
        });


        // axios end

        e.preventDefault();
    };


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
                    {this.state.loading === true || this.state.process === true ?
                        <LinearProgress style={{zIndex: "1000000"}} /> : ""
                    }
                    <div className="container valign-wrapper">
                        <div className="row">
                            <div className="landing-copy col s12 center-align">

                                <div id={"head-topic"}>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <a href={"/instructor/courses"} className="btn icon-master-btn con-mid"
                                           style={{marginTop: "10px"}}>
                                            <i className="material-icons-outlined btn-icon">arrow_back</i>
                                        </a>
                                    </div>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <Typography variant="h4">
                                            {this.state.loading === true ?
                                                <Skeleton style={{width: "150px"}}/>
                                                :
                                                <h4 id={"courseName"}>
                                                </h4>
                                            }
                                        </Typography>

                                    </div>
                                </div>

                                {this.state.loading === true ?
                                    <div style={{width: "100%", height: "calc(100vh - 103px)"}} className={"con-mid"}>
                                        <CircularProgress/>
                                    </div>
                                    :
                                    <div className={"con-mid"} style={{width: "100%", margin: "30px 0 50px 0"}}>

                                        {curTime <= this.state.lessonsAll.map(zoom => zoom.zoomEnd) ?


                                            <div className={"form-box con-left"}
                                                 style={{backgroundColor: "#ffffff", zIndex: "1"}}>
                                                <div className={"form-inner"}>
                                                    {this.state.lessonsAll.map(zoom => zoom.zoomStart) <= curTime ?
                                                        <h4>Ongoing zoom</h4>
                                                        :
                                                        <h4>Upcoming zoom</h4>
                                                    }
                                                    <div className={"curZoom"}>
                                                        <p><b>Link:</b><br/><a
                                                            href={this.state.lessonsAll.map(zoom => zoom.zoom)}
                                                            target={"_blank"}>{this.state.lessonsAll.map(zoom => zoom.zoom)}</a>
                                                        </p>
                                                        <p><b>Start:</b><br/><span id={"zoomStart"}>
                                            </span></p>
                                                        <p><b>End:</b><br/><span id={"zoomEnd"}>
                                            </span></p>
                                                        <form noValidate onSubmit={this.delProcessBtn}>
                                                            <div style={{width: "100%", marginTop: "24px"}}
                                                                 className={"con-mid"}>
                                                                <button
                                                                    style={{
                                                                        width: "150px",
                                                                        height: "35px"
                                                                    }}
                                                                    type={"submit"}
                                                                    className="btn btn-full-red">
                                                                    {this.state.delProcess === true ?
                                                                        <CircularProgress style={{
                                                                            color: "#ffffff",
                                                                            padding: "10px",
                                                                            marginTop: "-4px"
                                                                        }}/> : "Delete"
                                                                    }
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>

                                            : ""
                                        }

                                        <div className={"form-box"} style={{
                                            borderTopRightRadius: "0px",
                                            borderTopLeftRadius: "0px",
                                            marginTop: "-10px",
                                        }}>
                                            <div className={"form-inner"}>
                                                <form noValidate onSubmit={this.onSubmit}>
                                                    <h4 className={"con-left"} style={{marginBottom: "24px"}}>Update
                                                        zoom
                                                        link</h4>
                                                    <div style={{marginBottom: "24px"}}>
                                                        <TextField
                                                            id="link"
                                                            label={"Zoom link"}
                                                            variant={"outlined"}
                                                            onChange={this.onChange}
                                                            value={this.state.link}
                                                            error={errors.link}
                                                            type="url"
                                                            style={{width: "100%"}}
                                                            className={classnames("", {
                                                                invalid: errors.link
                                                            })}
                                                        />
                                                        <span className="red-text">
                                                        {errors.link}
                                                     </span>
                                                    </div>
                                                    <div style={{marginBottom: "24px"}}>
                                                        <TextField
                                                            id="start"
                                                            label={"Start"}
                                                            variant={"outlined"}
                                                            focused
                                                            onChange={this.onChange}
                                                            value={this.state.start}
                                                            error={errors.start}
                                                            min={'2021-10-20, 11:47'}
                                                            type="datetime-local"
                                                            style={{width: "100%"}}
                                                            className={classnames("", {
                                                                invalid: errors.start
                                                            })}
                                                        />
                                                        <span className="red-text">
                                                        {errors.start}
                                                    </span>
                                                    </div>

                                                    <div style={{marginBottom: "24px"}}>
                                                        <TextField
                                                            id="end"
                                                            label={"End"}
                                                            variant={"outlined"}
                                                            focused
                                                            onChange={this.onChange}
                                                            value={this.state.end}
                                                            error={errors.end}
                                                            type="datetime-local"
                                                            style={{width: "100%"}}
                                                            className={classnames("", {
                                                                invalid: errors.end
                                                            })}
                                                        />
                                                        <span className="red-text">
                                                        {errors.end}
                                                    </span>
                                                    </div>

                                                    <div>
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
                                                                    marginTop: "-4px"
                                                                }}/> : "Update"
                                                            }
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>}
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
