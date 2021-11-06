import axios from "axios";
//axios.defaults.baseURL = process.env.APP_URL
axios.defaults.baseURL = require("../config/keys").API_URL;

const setAuthToken = token => {
  if (token) {
    // Apply authorization token to every request if logged in
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
