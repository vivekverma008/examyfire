const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/examfire');
const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error : '));
db.once('open',function(){
    console.log('connected to db :>');
})

module.exports = db;
