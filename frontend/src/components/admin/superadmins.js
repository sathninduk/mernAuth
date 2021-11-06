import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import MuiAlert from "@mui/material/Alert";
import {CircularProgress, Snackbar} from "@material-ui/core";
import MaterialTable from "mui-datatables";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

//axios.defaults.baseURL = process.env.APP_URL
const baseURL = require("../../config/keys").API_URL;

// message
let url_string = window.location.href;
let url = new URL(url_string);
const msg = url.searchParams.get("m");

class Dashboard extends Component {

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    state = {
        delProcess: false,
        disProcess: false,
        eProcess: false,
        loading: false,
        errorOpen: false,
        skeleton: false,
        persons: []
    }

    componentDidMount = () => {
        this.setState({loading: true});
        this.setState({skeleton: true});
        if (msg === 'suc') {
            //window.location.reload();
            this.setState({successOpen: true})
        }
        axios.get(baseURL + `/api/admin/super-admins`, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            this.setState({errorOpen: false});
            const persons = res.data;
            this.setState({persons});
            this.setState({skeleton: false});
            this.setState({loading: false});
        }).catch((err) => {
            this.setState({errorOpen: true});
            this.setState({skeleton: false});
            this.setState({loading: false});
        });
    }

    delUser = (e) => {
        let s1 = e.target.id;
        let id = s1.substring(2);
        this.setState({loading: true});
        this.setState({delProcess: true});

        console.log(id)

        if (window.confirm('Are you sure you want to remove this user permanently?')) {

            if (window.confirm('Second Confirmation: Are you sure you want to remove this user permanently?')) {

                console.log("delete");
                /// delete payment
                axios.post(baseURL + `/api/admin/users/delete`, {id: id}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Headers': 'x-access-token',
                        'x-access-token': localStorage.getItem("jwtToken")
                    }
                }).then((response) => {
                    this.setState({errorOpen: false});
                    this.setState({loading: false});
                    this.setState({delProcess: false});
                    //document.getElementById('main' + id).style.display = 'none';
                    window.location.reload();
                }).catch((err) => {
                    this.setState({errorOpen: true});
                    console.log(err);
                    this.setState({loading: false});
                    this.setState({delProcess: false});
                    //this.setState({loading: false}, () => {
                    //});
                });
                // axios end

            } else {
                this.setState({loading: false});
                this.setState({delProcess: false});
                console.log("Deletion aborted")
            }
        } else {
            this.setState({loading: false});
            this.setState({delProcess: false});
            console.log("Deletion aborted")
        }
        //id.preventDefault();
    }

    disableUser = (e) => {
        this.setState({loading: true});
        this.setState({disProcess: true});

        let s1 = e.target.id;
        let id = s1.substring(2);

        console.log(id)

        if (window.confirm('Are you sure you want to disable this user?')) {
            console.log("disable");
            /// delete payment
            axios.post(baseURL + `/api/admin/users/disable`, {id: id}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'x-access-token',
                    'x-access-token': localStorage.getItem("jwtToken")
                }
            }).then((response) => {
                this.setState({errorOpen: false});
                console.log("disabled");
                document.getElementById('d-' + id).style.display = 'none';
                document.getElementById('e-' + id).style.display = 'inline-block';

                document.getElementById('ab-' + id).style.display = 'none';
                document.getElementById('db-' + id).style.display = 'inline-block';

                this.setState({loading: false});
                this.setState({disProcess: false});
            }).catch((err) => {
                this.setState({errorOpen: true});
                console.log(err);
                this.setState({loading: false});
                this.setState({disProcess: false});
                //this.setState({loading: false}, () => {
                //});
            });
            // axios end
        } else {
            this.setState({loading: false});
            this.setState({disProcess: false});
            console.log("Disable aborted")
        }
        //id.preventDefault();
    }


    enableUser = (e) => {
        this.setState({loading: true});
        this.setState({eProcess: true});

        let s1 = e.target.id;
        let id = s1.substring(2);

        console.log(id)

        if (window.confirm('Are you sure you want to enable this user?')) {
            console.log("enable");
            /// delete payment
            axios.post(baseURL + `/api/admin/users/enable`, {id: id}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'x-access-token',
                    'x-access-token': localStorage.getItem("jwtToken")
                }
            }).then((response) => {
                this.setState({errorOpen: false});
                console.log("enabled");
                document.getElementById('e-' + id).style.display = 'none';
                document.getElementById('d-' + id).style.display = 'inline-block';

                document.getElementById('db-' + id).style.display = 'none';
                document.getElementById('ab-' + id).style.display = 'inline-block';

                this.setState({errorOpen: false});
                this.setState({loading: false});
                this.setState({eProcess: false});
            }).catch((err) => {
                this.setState({errorOpen: true});
                console.log(err);
                this.setState({loading: true});
                this.setState({eProcess: true});
                //this.setState({loading: false}, () => {
                //});
            });
            // axios end
        } else {
            this.setState({loading: true});
            this.setState({eProcess: true});
            console.log("Enable aborted")
        }
        //id.preventDefault();
    }

    handleClose = () => {
        this.setState({errorOpen: false});
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
            this.state.persons.map(person =>
                data.push({
                    name: person.status === 1 ?
                        <div>
                            <span id={"ab-" + person._id}>{person.name}&nbsp;<span className={"badge badge-success"}>Active</span></span>
                            <span id={"db-" + person._id} style={{display: 'none'}}>{person.name}&nbsp;<span className={"badge badge-danger"}>Disabled</span></span>
                        </div>
                        :
                        <div>
                            <span id={"db-" + person._id}>{person.name}&nbsp;<span className={"badge badge-danger"}>Disabled</span></span>
                            <span id={"ab-" + person._id} style={{display: 'none'}}>{person.name}&nbsp;<span className={"badge badge-success"}>Active</span></span>
                        </div>,
                    email: person.email,
                    tel: person.tel,
                    actions: <div className={"muiDt"}>
                        <a href={"/admin/users/edit/" + person._id}
                           className={"btn btn-full-blue btn-tbl-action"}>Edit
                        </a>
                        {person.status === 1 ?
                            <div style={{display: "inline-block"}}>
                                <button className={"btn btn-full-warn btn-tbl-action"}
                                        id={'d-' + person._id}
                                        style={{display: 'inline-block'}}
                                        onClick={this.disableUser}>Disable
                                </button>
                                <button className={"btn btn-full-blue btn-tbl-action"}
                                        id={'e-' + person._id} style={{display: 'none'}}
                                        onClick={this.enableUser}>Enable
                                </button>
                            </div>
                            :
                            <div style={{display: "inline-block"}}>
                                <button className={"btn btn-full-blue btn-tbl-action"}
                                        id={'e-' + person._id}
                                        style={{display: 'inline-block'}}
                                        onClick={this.enableUser}>Enable
                                </button>
                                <button className={"btn btn-full-warn btn-tbl-action"}
                                        id={'d-' + person._id} style={{display: 'none'}}
                                        onClick={this.disableUser}>Disable
                                </button>
                            </div>
                        }
                        <button className={"btn btn-full-red btn-tbl-action"}
                                id={'r-' + person._id}
                                onClick={this.delUser}>Remove
                        </button>
                    </div>
                })
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
                                        <Link to="/admin" className="btn icon-master-btn con-mid"
                                              style={{marginTop: "10px"}}>
                                            <i className="material-icons-outlined btn-icon">arrow_back</i>
                                        </Link>
                                    </div>
                                    <div style={{display: "inline-block", marginRight: "10px"}}>
                                        <h4>Super Admins</h4>
                                    </div>
                                </div>

                                <div style={{width: "100%"}} className={"con-right"}>
                                    <a href={"/admin/super-admins/new"} style={{width: "150px"}}
                                       className={"btn btn-full-blue"}>+ New admin</a>
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
