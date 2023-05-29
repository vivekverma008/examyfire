const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;
const bodyParser = require('body-parser');
var session = require('express-session');
const passport = require('passport');
const passportjwt = require('./config/passport-config');
const db = require('./config/mongoose-config');
const expressValidator = require('express-validator');
const Admin = require('./models/admin');
const cookieParser = require('cookie-parser');
const middleware = require('./config/middleware');

const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    name : 'examfire',
    secret : 'exam-fire',
    saveUninitialized : false,
    resave : false,
 
}));
app.use(middleware.printcookie);

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