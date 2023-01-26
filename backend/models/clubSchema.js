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
        type : [mongoose.Schema.Types.Mixed],
        default : []
    },
    meetings : {
        type : [mongoose.Schema.Types.Mixed],
        default : []
    },
    events : {
        type : [mongoose.Schema.Types.Mixed],
        default : []
    }
})

module.exports = mongoose.model('Club', clubSchema)