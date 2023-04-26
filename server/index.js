const express = require('express');
const app = express();
const port = 8000;
const bodyParser = require('body-parser');
var session = require('express-session');
const passport = require('passport');
const passportjwt = require('./config/passport-config');
const db = require('./config/mongoose-config');
const expressValidator = require('express-validator');
const Admin = require('./models/admin');



app.use(express.urlencoded({extended : true}));
app.use(session({
    name : 'examfire',
    secret : 'exam-fire',
    saveUninitialized : false,
    resave : false,
 
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/',require('./routes'));

let setdefault = async function(){
    let admin = await Admin.find({});
    if(admin[0] === undefined){
        try{
            admin = await Admin.create({
                username : "vivek",
                password : "12345"
            
            })
        }catch(err){
            console.log('errr creating defalutl admin');
        }
        
    }
    // console.log(admin);
}

setdefault();

app.listen(port, function(err){
    if(err){
        console.log(err);
    }
    
    console.log('server listening at port ', port);
})