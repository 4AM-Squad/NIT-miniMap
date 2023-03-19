const express = require('express')
// const router = express.Router()
const nodemailer = require('nodemailer');
const app = express();

let testAccount = nodemailer.createTestAccount();

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: testAccount.user,
        pass: testAccount.pass
    }
});

// define a route for sending emails
app.post('/otp', (req, res) => {
    // retrieve email data from request body
    const { from, to, subject, text } = req.body;

    // setup email data with unicode symbols
    const mailOptions = {
        from,
        to,
        subject,
        text
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});