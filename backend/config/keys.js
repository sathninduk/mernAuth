module.exports = {
    // Database
    mongoURI: "mongodb+srv://public-rfcs:publicPassword@cluster0.ou7ym.mongodb.net/mernAuth?retryWrites=true&w=majority",

    // JWT Secret
    secretOrKey: "secret123",

    // App URL
    APP_URL: "", // default is empty

    // CORS Policies
    CORS_URL: "*",

    // Password recovery email
    PW_URL: "http://localhost:3000/",
    MAIL_HOST: "smtp.gmail.com",
    MAIL_PORT: 587,
    MAIL_SECURE: false,
    MAIL_TLS: true,
    MAIL_ACC: "email@gmail.com",
    MAIL_PW: "password",
};