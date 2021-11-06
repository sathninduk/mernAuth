import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import axios from "axios";
import {Link} from "react-router-dom";

//axios.defaults.baseURL = process.env.APP_URL
const baseURL = require("../../config/keys").API_URL;

let pathname = window.location.pathname;
let id = pathname.split('/').pop();

class Navbar extends Component {

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    componentDidMount = () => {

        if (id === ''
            || id === 'login'
            || id === 'register'
            || id === 'all-courses'
            || id === 'forgot'
            || id === 'forgot-change-password') {
        } else {
            axios.get(baseURL + `/api/admin/security/check-point`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'x-access-token',
                    'x-access-token': localStorage.getItem("jwtToken")
                }
            }).then((res) => {
                if (res.data.length === 1) {
                } else {
                    this.props.logoutUser();
                }
            }).catch((err) => {
            });
        }

    }

    render() {

        const {user} = this.props.auth;

        return (
            <div className={"nav-master-div"} style={{position: 'absolute'}}>
                <nav className="navbar navbar-expand-lg navbar-light">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="/">
                            <img src={"/img/nav-logo.png"} className="navlogo" alt={"mernAuth Logo"}/>
                        </a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"/>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <a className="nav-link" href="/">mernAuth</a>
                                </li>
                                <div className={"navDash"}>
                                    {user.role === 1 ?
                                        <li className="nav-item">
                                            <div className={"text-master-btn con-mid"}>
                                                <a className="nav-link btn-text" href="/admin">Admin</a>
                                            </div>
                                        </li>
                                        : user.role === 2 ?
                                            <li className="nav-item">
                                                <div className={"text-master-btn con-mid"}>
                                                    <a className="nav-link btn-text"
                                                       href="/instructor">Admin Role 2</a>
                                                </div>
                                            </li>
                                            : user.role === 3 ?
                                                <li className="nav-item">
                                                    <div className={"text-master-btn con-mid"}>
                                                        <Link className="nav-link btn-text"
                                                           to="/all-courses">Items</Link>
                                                    </div>
                                                </li>
                                                :
                                                <li className="nav-item">
                                                    <div className={"text-master-btn con-mid"}>
                                                        <Link className="nav-link btn-text"
                                                           to="/all-courses">Items</Link>
                                                    </div>
                                                </li>
                                    }
                                </div>
                            </ul>


                            {user.name ?

                                <form className="d-flex">
                                    <a
                                        href={"/all-courses"}
                                        style={{width: '100%'}}
                                        className="btn text-master-btn con-mid"
                                        title="Sign in">
                                        <span className="btn-text"><b>{user.email}</b></span>
                                    </a>
                                    {user.role === 1 ?
                                        <a
                                            href={"/admin/settings/password"}
                                            className="btn icon-master-btn con-mid"
                                            style={{marginLeft: "10px"}}
                                            title="Log out">
                                            <i className="material-icons-outlined btn-icon">settings</i>
                                        </a>
                                        :
                                        user.role === 2 ?
                                            <a
                                                href={"/instructor/settings/password"}
                                                className="btn icon-master-btn con-mid"
                                                style={{marginLeft: "10px"}}
                                                title="Log out">
                                                <i className="material-icons-outlined btn-icon">settings</i>
                                            </a>
                                            :
                                            <a
                                                href={"/user/settings/password"}
                                                className="btn icon-master-btn con-mid"
                                                style={{marginLeft: "10px"}}
                                                title="Log out">
                                                <i className="material-icons-outlined btn-icon">settings</i>
                                            </a>
                                    }

                                    <button
                                        onClick={this.onLogoutClick}
                                        className="btn icon-master-btn con-mid"
                                        style={{marginLeft: "10px"}}
                                        title="Log out">
                                        <i className="material-icons-outlined btn-icon">logout</i>
                                    </button>
                                </form>

                                :

                                <form className="d-flex">
                                    <a
                                        href={"/login"}
                                        className="btn text-master-btn con-mid"
                                        title="Sign in">
                                        <span className="btn-text"><b>Sign in</b></span>
                                    </a>

                                    <a
                                        href={"/register"}
                                        className="btn text-master-btn con-mid"
                                        title="Sign up"
                                        style={{marginLeft: "10px"}}>
                                        <span className="btn-text"><b>Sign up</b></span>
                                    </a>
                                </form>

                            }


                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    {logoutUser}
)(Navbar);


//export default Navbar;
