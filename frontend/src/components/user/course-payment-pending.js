import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import {Redirect} from "react-router-dom";
import axios from "axios";
import {CircularProgress, Typography} from "@material-ui/core";
import Skeleton from "@mui/material/Skeleton";
import LinearProgress from "@mui/material/LinearProgress";

//axios.defaults.baseURL = process.env.APP_URL
const baseURL = require("../../config/keys").API_URL;

let pathname = window.location.pathname;
let course = pathname.split('/').pop();

class Dashboard extends Component {

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    state = {
        courses: [],
        skeleton: false,
        process: false,
        paymentStatus: []
    }

    componentDidMount = () => {
        // get course information
        this.setState({skeleton: true});
        axios.get(baseURL + `/api/u/course?course=` + course, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            const courses = res.data;
            //console.log(courses);
            this.setState({skeleton: false});
            this.setState({courses});
        }).catch((err) => {
            this.setState({skeleton: false});
            this.setState({loading: false}, () => {
            });
        });

        // check payment
        axios.get(baseURL + `/api/u/payment-check?course=` + course, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            const paymentStatus = res.data;
            //console.log(paymentStatus);
            this.setState({paymentStatus});
        }).catch((err) => {
            this.setState({loading: false}, () => {
            });
        });

    }

    reload = e => {
        window.location.reload();
    }

    onSubmitDel = e => {

        if (window.confirm('Are you sure you want to cancel the payment information?')) {
            console.log("del");

            this.setState({process: true});

            // delete payment
            axios.post(baseURL + `/api/u/delete-payment`, {course: course, image: this.state.paymentStatus[0]}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'x-access-token',
                    'x-access-token': localStorage.getItem("jwtToken")
                }
            }).then((response) => {
                console.log("deleted");
                this.setState({process: false});
                window.location.href = "/course-payment/" + course;
                //this.setState({persons});
            }).catch((err) => {
                this.setState({process: false});
                console.log(err);
                //this.setState({loading: false}, () => {
                //});
            });
            // axios end


        } else {
            console.log("Cancellation aborted")
        }

        e.preventDefault();

        // this.props.registerUser(newCourse);
        // this.props.registerUser(newCourse, this.props.history);
    };


    render() {

        const {user} = this.props.auth;

        if (user.role === 1) {
            return <Redirect to="/admin"/>
        } else if (user.role === 2) {
            return <Redirect to="/instructor"/>
        } else {

            let paymentStatus = this.state.paymentStatus.map(status => status.status);
            if (paymentStatus[0] === 1) {
                // payment pass
                return <Redirect to={"/course/" + course + "?t="}/>
            }

            return (
                <div className={"mother"}>
                    {this.state.skeleton === true || this.state.process === true ?
                        <LinearProgress style={{zIndex: "1000000"}} /> : ""
                    }
                    <div className="container valign-wrapper">
                        <div className="row">
                            <div className="landing-copy col s12 center-align">


                                <div id={"head-topic"}>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <a href={"/all-courses"}
                                           className="btn icon-master-btn con-mid" style={{marginTop: "10px"}}>
                                            <i className="material-icons-outlined btn-icon">arrow_back</i>
                                        </a>
                                    </div>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <h4>Pending Payment</h4>
                                    </div>
                                </div>


                                <div className={"con-mid"} style={{width: "100%", margin: "30px 0"}}>
                                    <div className={"form-box"}>
                                        <div className={"form-inner"}>
                                            <div style={{marginBottom: "24px"}}>

                                                <Typography variant={"h4"}>
                                                    {this.state.skeleton === true ?
                                                        <Skeleton style={{width: "100%"}}/>
                                                        :
                                                        this.state.courses.map(course =>
                                                            <h4 key={course.name}>{course.name}</h4>)
                                                    }
                                                </Typography>

                                                <p>Payment pending...</p>
                                            </div>
                                            <div style={{marginBottom: "24px"}}>
                                                <button
                                                    style={{
                                                        width: "150px",
                                                    }}
                                                    onClick={this.reload}
                                                    className="btn btn-full-blue"
                                                >
                                                    Check now
                                                </button>
                                            </div>
                                            <div style={{marginBottom: "24px"}}>
                                                <button
                                                    style={{
                                                        width: "150px",
                                                        height: "35px"
                                                    }}
                                                    onClick={this.onSubmitDel}
                                                    className="btn btn-full-red"
                                                >
                                                    {this.state.process === true ?
                                                        <CircularProgress style={{
                                                            color: "#ffffff",
                                                            padding: "10px",
                                                            marginTop: "-10px"
                                                        }}/> : "Cancel payment"
                                                    }
                                                </button>
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
