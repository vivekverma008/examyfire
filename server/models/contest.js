var mongoose = require('mongoose');

let contestschema = new mongoose.Schema({
    slug : {
        type : "string",
        required : true,
        unique : true
    },
    questions : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "problems"
    }],
    startTime : {
        type : Date
    },
    endTime : {
        type : Date,
        required : true
    },
    duration : {
        type : Number,
        required : true
    },
    regStartTime : {
        type : Date ,
        required : true
    },
    regEndTime : {
        type : Date,
        required : true
    },
    status : {
        type : String,
        enum : ['CREATED','REGISTRATION_STARTED','REGISTRATION_COMPLETE','TEST_STARTED','TEST_COMPLETE','RESULT_DECLARED','CANCELLED'],
        default : 'CREATED'
    },
    createdBy :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : true
    }
},{
    timestamps : {}
});

const Contest  = mongoose.model("contests",contestschema);
module.exports = Contest;