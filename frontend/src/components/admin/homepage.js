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

        axios.get(baseURL + `/api/admin/past`, {
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

        axios.get(baseURL + `/api/admin/team`, {
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

    delPast = (e) => {
        let s1 = e.target.id;
        let id = s1.substring(2);

        this.setState({loading: true});
        this.setState({delProcess: true});

        console.log(id)

        if (window.confirm('Are you sure you want to remove this item?')) {
            console.log("del");
            /// delete payment
            axios.post(baseURL + `/api/admin/past/delete`, {id: id}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'x-access-token',
                    'x-access-token': localStorage.getItem("jwtToken")
                }
            }).then((response) => {
                console.log("deleted");
                this.setState({errorOpen: false});
                this.setState({loading: false});
                this.setState({delProcess: false});
                window.location.reload();
            }).catch((err) => {
                this.setState({errorOpen: true});
                this.setState({loading: false});
                this.setState({delProcess: false});
                console.log(err);
            });
            // axios end

        } else {
            console.log("Deletion aborted")
            this.setState({loading: false});
            this.setState({delProcess: false});
        }
        //id.preventDefault();
    }



    delTeam = (e) => {
        let s1 = e.target.id;
        let id = s1.substring(2);

        this.setState({loading: true});
        this.setState({delProcess: true});

        console.log(id)

        if (window.confirm('Are you sure you want to remove this item?')) {
            console.log("del");
            /// delete payment
            axios.post(baseURL + `/api/admin/team/delete`, {id: id}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'x-access-token',
                    'x-access-token': localStorage.getItem("jwtToken")
                }
            }).then((response) => {
                console.log("deleted");
                this.setState({errorOpen: false});
                this.setState({loading: false});
                this.setState({delProcess: false});
                window.location.reload();
            }).catch((err) => {
                this.setState({errorOpen: true});
                this.setState({loading: false});
                this.setState({delProcess: false});
                console.log(err);
            });
            // axios end

        } else {
            console.log("Deletion aborted")
            this.setState({loading: false});
            this.setState({delProcess: false});
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
                    name: "name",
                    label: "Name",
                    options: {
                        filter: true,
                        sort: true,
                    },
                },
                {
                    name: "title",
                    label: "Title",
                    options: {
                        filter: true,
                        sort: false,
                    },
                },
                {
                    name: "body",
                    label: "Body",
                    options: {
                        filter: true
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

            const columns2 = [
                {
                    name: "name",
                    label: "Name",
                    options: {
                        filter: true,
                        sort: true,
                    },
                },
                {
                    name: "title",
                    label: "Title",
                    options: {
                        filter: true,
                        sort: false,
                    },
                },
                {
                    name: "body",
                    label: "Body",
                    options: {
                        filter: true,
                        sort: false,
                    },
                },
                {
                    name: "img",
                    label: "Image",
                    options: {
                        filter: true
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
                    data.push({
                        name: payment.name,
                        title: payment.title,
                        body: payment.body,
                        actions: <div>
                            <a href={'/admin/past/edit/' + payment._id} className={"btn pay-btn btn-full-blue"}>Edit</a>
                            <button id={'r-' + payment._id} onClick={this.delPast}
                                    className={"btn pay-btn btn-full-red"}>Remove
                            </button>
                        </div>
                    })
            )

            const data2 = [];

            this.state.courses.map(payment =>
                    data2.push({
                        name: payment.name,
                        title: payment.title,
                        body: payment.body,
                        img: <img alt={"Profile"} src={baseURL + "/public/team/" + payment.file} style={{width: "80px", height: "80px"}} />,
                        actions: <div>
                            <a href={'/admin/team/edit/' + payment._id} className={"btn pay-btn btn-full-blue"}>Edit</a>
                            <button id={'r-' + payment._id} onClick={this.delTeam}
                                    className={"btn pay-btn btn-full-red"}>Remove
                            </button>
                        </div>
                    }))

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
                                        <Link to="/admin" className="btn icon-master-btn con-mid"
                                              style={{marginTop: "10px"}}>
                                            <i className="material-icons-outlined btn-icon">arrow_back</i>
                                        </Link>
                                    </div>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <h4>Homepage</h4>
                                    </div>
                                </div>

                                <div style={{marginBottom: "100px"}}>
                                    <div style={{width: "100%", margin: "50px 0"}} className={"row"}>
                                        <div className={"con-left col"}>
                                            <h4>Student Voice</h4>
                                        </div>
                                        <div className={"con-right col"}>
                                            <a href={"/admin/past/new"}
                                               className={"btn btn-full-blue"}>+ Add New</a>
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
                                                    title="Past Students"
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


                                <div style={{marginBottom: "100px"}}>
                                    <div style={{width: "100%", margin: "50px 0"}} className={"row"}>
                                        <div className={"con-left col"}>
                                            <h4>Team Members</h4>
                                        </div>
                                        <div className={"con-right col"}>
                                            <a href={"/admin/team/new"}
                                               className={"btn btn-full-blue"}>+ Add New</a>
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
                                                    title="Team Members"
                                                    data={data2}
                                                    columns={columns2}
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
