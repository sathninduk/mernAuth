import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import {Link, Redirect} from "react-router-dom";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import {CircularProgress, Snackbar} from "@material-ui/core";
import MuiAlert from "@mui/material/Alert";
import MaterialTable from "mui-datatables";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

//axios.defaults.baseURL = process.env.APP_URL
const baseURL = require("../../config/keys").API_URL;

class Dashboard extends Component {

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    state = {
        errorOpen: false,
        delProcess: false,
        disProcess: false,
        eProcess: false,
        loading: false,
        skeleton: false,
        payments: [],
        courses: []
    }

    componentDidMount = () => {
        this.setState({skeleton: true});
        this.setState({loading: true});

        axios.get(baseURL + `/api/admin/approved-payments`, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            this.setState({errorOpen: false});
            this.setState({loading: false});
            this.setState({skeleton: false});

            const payments = res.data;
            this.setState({payments});
        }).catch((err) => {
            this.setState({errorOpen: true});
            this.setState({loading: false});
            this.setState({skeleton: false});
        });

        axios.get(baseURL + `/api/admin/courses`, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            const courses = res.data;
            this.setState({courses});
        }).catch((err) => {
            this.setState({loading: false}, () => {
            });
        });

    }


    disapprovePayment = (e) => {
        let s1 = e.target.id;
        let id = s1.substring(2);

        this.setState({loading: true});
        this.setState({eProcess: true});

        console.log(id)

        if (window.confirm('Are you sure you want to disapprove this payment?')) {
            console.log("Disapprove");
            /// delete payment
            axios.post(baseURL + `/api/admin/disapprove-payment`, {id: id}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'x-access-token',
                    'x-access-token': localStorage.getItem("jwtToken")
                }
            }).then((response) => {
                console.log("Disapproved");
                this.setState({errorOpen: false});
                this.setState({loading: false});
                this.setState({eProcess: false});
                //document.getElementById('main' + id).style.display = 'none';
                window.location.reload();
            }).catch((err) => {
                this.setState({errorOpen: true});
                this.setState({loading: false});
                this.setState({eProcess: false});
                console.log(err);
            });
            // axios end

        } else {
            console.log("Disapprove aborted");
            this.setState({loading: false});
            this.setState({eProcess: false});

        }
        //id.preventDefault();
    }


    render() {

        const {user} = this.props.auth;

        if (user.role === 3) {
            return <Redirect to="/all-courses"/>
        } else if (user.role === 2) {
            return <Redirect to="/instructor"/>
        } else {

            const columns = [
                {
                    name: "course",
                    label: "Course",
                    options: {
                        filter: true,
                        sort: true,
                    },
                },
                {
                    name: "name",
                    label: "Name",
                    options: {
                        filter: true,
                        sort: true,
                    },
                },
                {
                    name: "tel",
                    label: "Tel",
                    options: {
                        filter: true,
                        sort: false,
                    },
                },
                {
                    name: "email",
                    label: "Email",
                    options: {
                        filter: true,
                        sort: true,
                    },
                },
                {
                    name: "actions",
                    label: "Actions",
                    options: {
                        filter: false,
                        sort: false,
                    },
                },
            ];

            const data = [];
            this.state.payments.map(payment =>
                payment.status === 1 ?
                data.push({
                    course: this.state.courses.map(course =>
                        course._id === payment.course ? course.name : ""
                    ),
                    name: payment.user,
                    tel: payment.tel,
                    email: payment.email,
                    actions: <div><a href={"/admin/users/payments/view/" + payment._id} target={"_blank"}
                                     className={"btn pay-btn btn-full-blue"}>View</a>
                        <button id={'a-' + payment._id} onClick={this.disapprovePayment}
                                className={"btn pay-btn btn-full-red"}>Disapprove
                        </button>
                        <a href={'tel:' + payment.tel}
                           className={"btn pay-btn btn-full-dark"}>Voice call</a>
                        <a href={'mailto:' + payment.email} target={"_blank"}
                           className={"btn pay-btn btn-full-dark"}>Email</a>
                    </div>
                }) : ""
            )

            return (
                <div className={"mother"}>
                    {this.state.loading === true ?
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
                            Network error occurred!
                        </Alert>
                    </Snackbar>
                    <div className="container valign-wrapper">
                        <div className="row">
                            <div className="landing-copy col s12 center-align">


                                <div id={"head-topic"}>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <Link to="/admin/users/payments" className="btn icon-master-btn con-mid"
                                              style={{marginTop: "10px"}}>
                                            <i className="material-icons-outlined btn-icon">arrow_back</i>
                                        </Link>
                                    </div>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <h4>Approved Payments</h4>
                                    </div>
                                </div>

                                {this.state.skeleton === true ?
                                    <div className={"form-box"}
                                         style={{width: "100%", marginTop: "50px", height: "400px"}}>
                                        <div className={"form-inner"} style={{padding: "10px", height: "100%"}}>
                                            <div style={{width: "100%", height: "100%"}} className={"con-mid"}>
                                                <CircularProgress/>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className={"form-box"} style={{width: "100%", marginTop: "50px"}}>
                                        <div className={"form-inner"} style={{padding: "10px"}}>
                                            <MaterialTable
                                                title="Users"
                                                data={data}
                                                columns={columns}
                                                options={{
                                                    search: true,
                                                    paging: false,
                                                    filtering: true,
                                                    exportButton: true,
                                                    selectableRows: false,
                                                }}
                                            />
                                        </div>
                                    </div>
                                }
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
