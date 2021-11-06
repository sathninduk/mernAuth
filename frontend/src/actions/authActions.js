import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {GET_ERRORS, SET_CURRENT_USER} from "./types";
//import {success} from "concurrently/src/defaults";

//axios.defaults.baseURL = process.env.APP_URL
const baseURL = require("../config/keys").API_URL;

// Register User
export const registerUser = (userData, history) => dispatch => {
    axios
        .post(baseURL + '/api/users/register', userData)
        .then(res => history.push("/login"))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

export const adminRegisterUser = (userData, history) => dispatch => {
    axios
        .post(baseURL + '/api/admin/register', userData, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        })
        .then(res => history.push("/admin/super-admins"))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

export const instructorAdminRegisterUser = (userData, history) => dispatch => {
    axios
        .post(baseURL + '/api/admin/register', userData, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': localStorage.getItem("jwtToken")
            }
        })
        .then(res => history.push("/admin/instructors"))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};


// Reset User Password
export const resetPassword = (resetData, history) => dispatch => {
    axios
        .post(baseURL + '/api/users/reset-password', resetData)
        .then(res => history.push("/login"))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Login - get user token
export const loginUser = userData => dispatch => {
    axios
        .post(baseURL + '/api/users/login', userData)
        .then(res => {
            // Set token to localStorage
            const {token} = res.data;
            localStorage.setItem("jwtToken", token);
            // Set token to Auth header
            setAuthToken(token);
            // Decode token to get user data
            const decoded = jwt_decode(token);
            // Set current user
            dispatch(setCurrentUser(decoded));
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Login - get user token
export const forgotPassword = userData => dispatch => {
    axios
        .post(baseURL + '/api/users/forgot', userData)
        /*.then(res => {
            const requestSent = res.data.requestSent;
            console.log(requestSent);
            // dispatch(forgotLinkSent(requestSentData));
        })*/
        .then(res => window.location.href ="/forgot-success")
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Set logged in user
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};


// User loading
/*export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
};*/

// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from local storage
    localStorage.removeItem("jwtToken");
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to empty object {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
};
