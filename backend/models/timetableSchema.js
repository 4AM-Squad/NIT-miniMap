const mongoose = require('mongoose')

const timetableSchema = new mongoose.Schema({
    subject : {
        type : String,
        required : true
    },
    type : {
        type : String,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    day : {
        type : String,
        required : true
    },
    start_time : {
        type : String,
        required : true
    },
    end_time : {
        type : String,
        required : true
    },
    teacher : {
        type : String,
        required : true
    },
    branch : {
        type : String,
        required : true
    },
    section : {
        type : String,
        required : true
    },
    subsection : {
        type : Number,
        required : true
    }
})

module.exports = mongoose.model('Timetable', timetableSchema)