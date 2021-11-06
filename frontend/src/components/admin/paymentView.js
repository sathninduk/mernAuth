import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import {Redirect} from "react-router-dom";
import axios from "axios";
import {CircularProgress} from "@material-ui/core";

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
        loading: false,
        payments: [],
        courses: []
    }

    componentDidMount = () => {
        this.setState({loading: true});

        axios.get(baseURL + `/api/admin/payment?id=` + id, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            const payments = res.data;
            this.setState({payments});
            this.setState({loading: false});
        }).catch((err) => {
            this.setState({loading: false}, () => {
            });
        });

        axios.get(baseURL + `/api/admin/payment/view?id=` + this.state.payments.map(payment => payment.file), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        }).then((res) => {
            const courses = res.data[0];
            this.setState({courses});
        }).catch((err) => {
            this.setState({loading: false}, () => {
            });
        });

    }

    closeWindow = () => {
        window.close();
    }


    render() {

        const {user} = this.props.auth;

        if (user.role === 3) {
            return <Redirect to="/all-courses"/>
        } else if (user.role === 2) {
            return <Redirect to="/instructor"/>
        } else {

            return (
                <div>
                    <div className={"paymentView-controls con-left"} style={{marginTop: "10px"}}>
                        <span className={"close-btn"} onClick={this.closeWindow}>
                            <i className="material-icons-outlined btn-icon"
                               style={{padding: "7px", backgroundColor: "rgba(0,0,0,0)!important"}}>highlight_off</i>
                        </span>
                    </div>
                    <div className={"paymentView con-mid"}>
                        {this.state.loading === true ?
                            <div style={{width: "100%", height: "calc(100% - 58px)"}} className={"con-mid"}>
                                <CircularProgress style={{color: "#ffffff"}} />
                            </div>
                            :
                            <img alt={"Payment Slip"} style={{margin: "20px"}}
                                 src={baseURL + "/public/" + this.state.payments.map(payment => payment.file)}/>
                        }
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
