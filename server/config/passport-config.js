const passport = require('passport');
const JwtStrategy  = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Admin = require('../models/admin');
const User = require('../models/user');
var opts = {
    jwtFromRequest : (req)=>{
        let token = null;
        
        if (req && req.cookies) {
        token = req.cookies.jwt;
        }
    return token;
    },
    secretOrKey : 'examyfire'
}



passport.use('admin-token',new JwtStrategy(opts, async function(jwt_payload,done){
    try{
        var admin = await Admin.findById(jwt_payload);
        console.log(admin);
        if(admin){
            return done(null, admin,{
                success : true,
                message : 'success'
            });
        }
        else{
             return done(null, false,{
                success : false,
                message : "failed to authourize"
             });
        }
    }catch(err){
        console.log('server error using passport jwt' , err);
        return done(err, false,{
            success : false,
            message : 'server error'
        });
    }

}));

passport.use('user-token',new JwtStrategy(opts, async function(jwt_payload,done){
    try{
        
        var user = await User.findById(jwt_payload);
       
        console.log(user);
        if(user){
            return done(null, user,{
                success : true,
                message : 'success'
            });
        }
        else{
             return done(null, false,{
                success : false,
                message : "failed to authourize"
             });
        }
    }catch(err){
        console.log('server error using passport jwt' , err);
        return done(err, false,{
            success : false,
            message : 'server error'
        });
    }

}));


module.exports = passport;

