const express = require('express');
const app = express();
const cors = require('cors')
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://VanshSukhija:BE**f*TuWR$-V5P@cluster0.ey521ob.mongodb.net/timetable?retryWrites=true&w=majority')

const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to Database'))

app.use(cors())
app.use(express.json())

app.use(express.static(__dirname));

app.get("/",(req,res)=>{
res.sendFile(__dirname+'./index.html')
})

const timetableRouter = require('./routes/timetable')
app.use('/timetable', timetableRouter)

const teacherRouter = require('./routes/teacher')
app.use('/teacherdb', teacherRouter)

const clubRouter = require('./routes/club')
app.use('/clubdb', clubRouter)

const studentRouter = require('./routes/student')
app.use('/studentdb', studentRouter)

// const otpRouter = require('./routes/otp')
// app.use('/otp', otpRouter)

// let mailTransporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: '4amsquadhelp@gmail.com',
//         pass: 'vxzcxxcltdwoyuyy'
//     }
// });
 
// let mailDetails = {
//     from: '4amsquadhelp@gmail.com',
//     to: 'tusharkaler450@gmail.com',
//     subject: 'Test mail',
//     text: 'Node.js testing mail for GeeksforGeeks'
// };
 
// mailTransporter.sendMail(mailDetails, function(err, data) {
//     if(err) {
//         console.log('Error Occurs');
//     } else {
//         console.log('Email sent successfully');
//     }
// });

app.listen(3000, () => console.log('Server Started'));