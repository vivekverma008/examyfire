var mongoose = require("mongoose");

var testregistrationschema = new mongoose.Schema({
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user'
  },
  test : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'contests'
  }
},{
  timestamps:{}
})
const ContestRegistration =  mongoose.model('contestRegistration',testregistrationschema);
module.exports = ContestRegistration;
