const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer');
// const app = express();

// let testAccount = nodemailer.createTestAccount();

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'Gmail',
    port: 587,
    secure: false,
    auth: {
        user: '4amsquadhelp@gmail.com',
        pass: 'psgmvstk'
    }
});

// define a route for sending emails
router.post('/', (req, res) => {
    // retrieve email data from request body
    let from_id = req.body.from;
    let to_id = req.body.to;
    let sub = req.body.subject;
    let msg = req.body.text;

    // setup email data with unicode symbols
    const mailOptions = {
        "from" : from_id,
        "to" : to_id,
        "subject" : sub,
        "text" : msg
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

// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });
module.exports = router