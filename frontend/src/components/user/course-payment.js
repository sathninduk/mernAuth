import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import {Redirect} from "react-router-dom";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";
import {CircularProgress, Typography} from "@material-ui/core";
import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from "@mui/material/Snackbar";

import MuiAlert from "@mui/material/Alert";
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
        paymentStatus: [],
        skeleton: false,
        courseFee: "",
        loading: false,
        errorOpen: false,
        courses: [],
        process: false,
        errors: {}
    }

    componentDidMount = () => {
        this.setState({skeleton: true});
        this.setState({loading: true});

        axios.get(baseURL + `/api/u/course?course=` + course, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            this.setState({skeleton: false});
            const courses = res.data;
            this.setState({courses});
            console.log(courses[0].fee);
            const courseFee = courses[0].fee;
            this.setState({courseFee});
        }).catch((err) => {
            this.setState({skeleton: false}, () => {
            });
        });

        axios.get(baseURL + `/api/u/payment-check?course=` + course, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            this.setState({loading: false});
            const paymentStatus = res.data;
            console.log(paymentStatus);
            this.setState({paymentStatus});
        }).catch((err) => {
            this.setState({loading: false}, () => {
            });
        });
    }

    onSubmit = e => {
        this.setState({process: true});
        let newPayment = new FormData();
        newPayment.append('course', course)
        newPayment.append('slip', document.getElementById("slip").files[0])
        // axios
        axios.post(baseURL + `/api/u/payment`, newPayment, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-access-token': localStorage.getItem("jwtToken"),
            }
        }).then((response) => {
            console.log("saved");
            this.setState({errorOpen: false})
            this.setState({process: false});
            window.location.href = "/course-payment-pending/" + course;
        }).catch((err) => {
            console.log(err);
            this.setState({process: false});
            const errors = err.response.data;
            console.log(errors);
            this.setState({errors}, () => {
            });
            //if (errors.internalError) {
                this.setState({errorOpen: true})
            //}
        });
        // axios end
        e.preventDefault();
    };

    handleClose = () => {
        this.setState({errorOpen: false})
    }

    render() {

        const {user} = this.props.auth;
        const {errors} = this.state;

        if (user.role === 1) {
            return <Redirect to="/admin"/>
        } else if (user.role === 2) {
            return <Redirect to="/instructor"/>
        } else {

            let paymentStatus = this.state.paymentStatus.map(status => status.status);
            if (paymentStatus[0] === 0) {
                // payment waiting for the approval
                return <Redirect to={"/course-payment-pending/" + course}/>
            } else if (paymentStatus[0] === 1) {
                // payment pass
                return <Redirect to={"/course/" + course + "?t="}/>
            } else if (this.state.courseFee === 0) {
                return <Redirect to={"/course/" + course + "?t="}/>
            } else {
                // no payment yet

                return (
                    <div className={"mother"}>
                        {this.state.loading === true ?
                            <div id={"cover"} style={{
                                width: "100vw",
                                zIndex: "10000000000000000000000000",
                                height: "100vh",
                                position: "fixed",
                                margin: "0px",
                                padding: "0px",
                                backgroundColor: "#ffffff"
                            }} className={"con-mid"}>
                                <CircularProgress/>
                            </div>
                            :
                            ""}

                        {this.state.skeleton === true || this.state.process === true ?
                            <LinearProgress style={{zIndex: "1000000"}} /> : ""
                        }

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
                                The file size should be less than 5MB
                            </Alert>
                        </Snackbar>

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
                                            <h4>Payment</h4>
                                        </div>
                                    </div>

                                    <div className={"con-mid"} style={{width: "100%", margin: "30px 0"}}>
                                        <div className={"form-box"}>
                                            <div className={"form-inner"}>
                                                <div className="col s12">
                                                    <div style={{marginBottom: "24px"}}>

                                                        <Typography variant={"h4"}>
                                                            {this.state.skeleton === true ?
                                                                <Skeleton style={{width: "100%"}}/>
                                                                :
                                                                <h4>{this.state.courses.map(course => course.name)}</h4>
                                                            }
                                                        </Typography>


                                                        <Typography variant={"p"}>
                                                            {this.state.skeleton === true ?
                                                                <Skeleton style={{width: "100%"}}/>
                                                                :
                                                                <p style={{
                                                                    textAlign: "justify",
                                                                    fontSize: "14px",
                                                                    padding: "10px 0 0 0"
                                                                }}>{this.state.courses.map(course => course.summary)}
                                                                </p>
                                                            }
                                                        </Typography>


                                                        <Typography variant={"p"}>
                                                            {this.state.skeleton === true ?
                                                                <Skeleton style={{width: "100%"}}/>
                                                                :
                                                                <p style={{
                                                                    textAlign: "justify",
                                                                    fontSize: "14px",
                                                                    padding: "10px 0 0 0"
                                                                }}>Course
                                                                    Fee: <b>{this.state.courses.map(course => "LKR " +
                                                                        course.fee.toString().split(".")[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                                        + ".00")}</b>
                                                                </p>
                                                            }
                                                        </Typography>


                                                        <p style={{
                                                            textAlign: "justify",
                                                            fontSize: "14px",
                                                            padding: "0 0 10px 0"
                                                        }}>Please upload an image of your valid
                                                            <b> bank deposit slip</b> from below. (Only <b>JPEG, JPG and
                                                                PNG</b> files are allowed.)</p>
                                                    </div>
                                                    <form onSubmit={this.onSubmit} method={"POST"}
                                                          encType={"multipart/form-data"}>
                                                        <div className="col s12">
                                                            <div style={{marginBottom: "24px"}}>
                                                                <input accept="image/JPG, image/PNG, image/JPEG"
                                                                       id={"slip"}
                                                                       style={{width: "280px"}}
                                                                       className="custom-file-input"
                                                                       name={"slip"}
                                                                       required
                                                                       type="file"/>
                                                            </div>
                                                            <div style={{width: "100%"}} className={"con-mid"}>
                                                            <span className={"red-text"} style={{
                                                                marginBottom: "24px",
                                                                textAlign: "center"
                                                            }}>{errors.file}</span>
                                                            </div>
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
                    </div>
                );
            }
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