import nodemailer from "nodemailer"
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!)

// const transporter = nodemailer.createTransport({
//     service: "Gmail",
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//         user: "tccvemfacul@gmail.com",
//         pass: process.env.EMAIL_PWD
//     }
// });

export default resend