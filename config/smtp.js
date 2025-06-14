const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "tccvemfacul@gmail.com",
        pass: process.env.EMAIL_PWD
    }
});

module.exports = transporter