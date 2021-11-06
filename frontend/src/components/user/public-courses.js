import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import {Redirect} from "react-router-dom";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import Skeleton from "@mui/material/Skeleton";

//axios.defaults.baseURL = process.env.APP_URL
const baseURL = require("../../config/keys").API_URL;

class PublicCourses extends Component {

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    state = {
        loading: false,
        courses: []
    }

    componentDidMount = () => {
        this.setState({loading: true});
        axios.get(baseURL + `/api/u/pub-courses`, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            const courses = res.data;
            courses.sort();
            this.setState({courses});
            this.setState({loading: false});
        }).catch((err) => {
            this.setState({loading: false}, () => {
            });
        });
    }


    render() {

        const {user} = this.props.auth;

        if (user.role === 1) {
            return <Redirect to="/admin"/>
        } else if (user.role === 2) {
            return <Redirect to="/instructor"/>
        } else {

            return (
                <div className={"mother"}>
                    {this.state.loading === true ?
                        <LinearProgress style={{zIndex: "1000000"}} /> : ""
                    }
                    <div className="container valign-wrapper">
                        <div className="row">
                            <div className="landing-copy col s12 center-align">
                                <div id={"head-topic"}>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <a href="/" className="btn icon-master-btn con-mid"
                                           style={{marginTop: "10px"}}>
                                            <i className="material-icons-outlined btn-icon">arrow_back</i>
                                        </a>
                                    </div>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <h4>All courses</h4>
                                    </div>
                                </div>

                                <div
                                    style={{minHeight: "calc(100vh - 179px)", marginTop: "20px", marginBottom: "50px"}}>


                                    {this.state.loading ?
                                        <div className={"row blocs"}>
                                            <div className={"col-sm-4"}>
                                                <div style={{width: "100%"}}>
                                                    <Skeleton style={{width: "100%", height: "225px"}}/>
                                                </div>
                                            </div>
                                            <div className={"col-sm-4"}>
                                                <div style={{width: "100%"}}>
                                                    <Skeleton style={{width: "100%", height: "225px"}}/>
                                                </div>
                                            </div>
                                            <div className={"col-sm-4"}>
                                                <div style={{width: "100%"}}>
                                                    <Skeleton style={{width: "100%", height: "225px"}}/>
                                                </div>
                                            </div>
                                            <div className={"col-sm-4"}>
                                                <div style={{width: "100%"}}>
                                                    <Skeleton style={{width: "100%", height: "225px"}}/>
                                                </div>
                                            </div>
                                            <div className={"col-sm-4"}>
                                                <div style={{width: "100%"}}>
                                                    <Skeleton style={{width: "100%", height: "225px"}}/>
                                                </div>
                                            </div>
                                            <div className={"col-sm-4"}>
                                                <div style={{width: "100%"}}>
                                                    <Skeleton style={{width: "100%", height: "225px"}}/>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className={"row blocs"}>
                                            {this.state.courses.map(course =>
                                                <div id={course._id} className={"col-sm-4"}>
                                                    <div className={"form-box"} style={{width: "100%"}}>
                                                        <div className={"form-inner"}>
                                                            <h4 style={{fontSize: "18px"}}>{course.name}</h4>
                                                            {course.fee === 0 ?
                                                                <p>Course
                                                                    Fee: <span className={"badge badge-success"}>Free</span>
                                                                </p>
                                                                :
                                                                <p>Course
                                                                    Fee: <b>LKR {course.fee.toString().split(".")[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.00</b>
                                                                </p>
                                                            }
                                                            <hr className={"adminDashHr"}/>
                                                            <div style={{width: "100%"}} className={"con-right"}>
                                                                <a href={"/course-payment/" + course._id}
                                                                   className={"btn btn-full-blue"}
                                                                   style={{
                                                                       width: "150px",
                                                                       maxWidth: "100%"
                                                                   }}>Proceed</a>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>}

                                    {/*
                                    <div className={"con-mid"} style={{width: "100%", margin: "50px 0"}}>
                                        <p>
                                            Powered by <a target={"_blank"} href={"https://www.coduza.com/"}>CODUZA</a>
                                        </p>
                                    </div>
                                    */}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

PublicCourses.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    {logoutUser}
)(PublicCourses);
