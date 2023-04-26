const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const problemschema = new Schema({
    title : {
        type : String , 
        required : true,
        unique : true
    },
    statement : {
        type : String , 
        required : true,
    },
    status : {
        type : Boolean, 
        default : false
    },
    solvedby : [{
        type  : Schema.Types.ObjectId   ,
        ref : 'user'
    }],
    constraint : {
        type : String
    },
    timelimit : {
        type : Number , 
        default : 3.0
    },
    memorylimit : {
        type : Number,
        default : 256.0
    },
    testcases : [{
        input : {
            type : String,
            required : true
        },
        output : {
            type : String , 
            required : true,
        },
        sample : {
            type : Boolean,
            default : false,
        },
        explanation : {
            type : String
        },
        
    }],
    createdBy : {
        required : true,
        type : Schema.Types.ObjectId,
        ref : 'user'
    }


},
{
    timestamps : true
});

const Problem = mongoose.model('problems' , problemschema);
module.exports = Problem;