const mongoose = require('mongoose')

const clubSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    roll_no : {
        type : [Number],
        default : []
    },
    meetings : {
        type : [Date],
        default : []
    },
    events : [mongoose.Schema.Types.Mixed]
})

module.exports = mongoose.model('Club', clubSchema)