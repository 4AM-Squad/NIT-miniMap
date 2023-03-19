const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    branch : {
        type : String,
        required : true
    },
    subsection : {
        type : Number,
        required : true
    },
    roll_no : {
        type : Number,
        required : true
    },
    domain_id : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('Student', studentSchema)