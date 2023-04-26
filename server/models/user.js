const mongoose = require('mongoose');
const {Schema} = mongoose;

const userschema = new Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : 'string',
        required : true,
        unique : true
    },
    usertype : {
        type : String,
        enum :['Teacher' , 'Student'],
        default : 'Student',
        required : true
    },
    password :{
        type : String , 
        required : true
    },
    blockStatus : {
        type : Boolean,          // class 
        default : false
    },
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : 'admins'
    }    
},{
    timestamps : true
});

const User = mongoose.model('user' , userschema);
module.exports = User;

