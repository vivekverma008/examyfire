const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminschema = new Schema({
    username : {
        type : 'string',
        required : true
    },
    password : {
        type : 'string',
        required : true
    }
},{
        timestamps: true
})

const Admin = mongoose.model('admin',adminschema);

module.exports = Admin;