import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.DEFAULT_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export default async function sendEmail(
    tartgetEmail: string,
    subject: string,
    text: string
) {
    try {
        const mailOptions = {
            from: process.env.DEFAULT_EMAIL,
            to: tartgetEmail,
            subject: subject,
            text: text,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
    } catch (error) {
        console.log(error);
    }
}
