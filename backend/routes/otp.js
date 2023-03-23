const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer');

let mailTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: '4amsquadhelp@gmail.com',
        pass: 'vxzcxxcltdwoyuyy'
    }
});

router.post('/', (req, res) => {
    let to_id = req.body.to;
    let pass = req.body.otp;
    let sub = "OTP verification";
    
    // let msg = `Your One Time Password for NIT-miniMap is: ${pass}`;

    let mailDetails = {
        from: '4amsquadhelp@gmail.com',
        to: to_id,
        subject: sub,
        // text: msg,
        html: `<p>Your One Time Password for NIT-miniMap is: <b>${pass}</b></p>`
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            res.status(500).json({ message: err.message })
        } else {
            res.status(200).json({ message: `OTP sent to mail ${to_id} successfully`, data: data })
        }
    });
});

module.exports = router