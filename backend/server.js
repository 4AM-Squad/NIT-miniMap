const express = require('express');
const app = express();
const cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

mongoose.set('strictQuery', true);
mongoose.connect(process.env.DATABASE_URL)

const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to Database'))

app.use(cors())
app.use(express.json())

app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname + './index.html')
})

app.get("/apiurl", (req, res) => {
    res.json({ apiURL: process.env.GOOGLE_MAPS_API_URL });
})

const timetableRouter = require('./routes/timetable')
app.use('/timetable', timetableRouter)

const teacherRouter = require('./routes/teacher')
app.use('/teacherdb', teacherRouter)

const clubRouter = require('./routes/club')
app.use('/clubdb', clubRouter)

const studentRouter = require('./routes/student')
app.use('/studentdb', studentRouter)

const otpRouter = require('./routes/otp')
app.use('/otp', otpRouter)

app.listen(3000, () => console.log('Server Started'));