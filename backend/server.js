const express = require('express');
const app = express();
const cors = require('cors')
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://VanshSukhija:BE**f*TuWR$-V5P@cluster0.ey521ob.mongodb.net/timetable?retryWrites=true&w=majority')

const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to Database'))

app.use(cors())
app.use(express.json())

const timetableRouter = require('./routes/timetable')
app.use('/timetable', timetableRouter)

const teacherRouter = require('./routes/teacher')
app.use('/teacherdb', teacherRouter)

const clubRouter = require('./routes/club')
app.use('/clubdb', clubRouter)

const studentRouter = require('./routes/student')
app.use('/studentdb', studentRouter)

app.listen(3000, () => console.log('Server Started'));