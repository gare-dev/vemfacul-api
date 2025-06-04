const nodemailer = require("nodemailer")
// const hbs = require("nodemailer-express-handlebars")
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

// transporter.use("compile", hbs({
//     viewEngine: 'handlebars',
//     viewPath: './emailHtml/',
//     // extName: '.html',
// }));

module.exports = transporter