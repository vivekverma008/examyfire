const mongoose = require('mongoose');
const Admin = require('../../models/admin');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const { validationResult , body , query}  = require('express-validator');
const passport = require('passport');


module.exports.createAdmin = async function(req,res){
    
    try{
        let there = await Admin.findOne({username : req.body.username});
        if(there){
            return res.status(424).json({
                message : 'admin already exists'
            })
        }
        obj = 
        await Admin.create({username : req.body.username , password : req.body.password});
        return res.status(200).json({
            message : 'admin created'
        })
    }catch(err){
        console.log(err);
        console.log(req.body);
        return res.status(500).json({
            data : req.body,
            message : 'error creating '
        })
    }
}

    
module.exports.admininfo = async function(req,res){
    if(req.isAuthenticated()){
        return res.status(200).json({
            message : 'admin is logged in ',
            data : req.user
        })
    }
    return res.status(422).json({
        message : 'not authenticated'
    })
}
module.exports.createSession = async function(req,res,next){
    
    try{
        let admin = await Admin.findOne({username : req.body.username});
        console.log(admin);
        if(!admin || req.body.password != admin.password){
            return res.status(400).json({
                message : 'Invalid username or password'
            })
        }
        return res.json({
            message : 'signIn successfull , here is your token',
            data : {
                token : jwt.sign(admin.toJSON(),'examyfire',{expiresIn : '1d'})
            } 
        })
    
        

    }catch(err){
        console.log('***********',err);
        return res.status(500).json({
            message : 'internal sereer err'
        })
    }
    
}  

module.exports.createTeacher = async function (req,res , next){
    try{
        console.log(req.user);
        if(!req.user){
            return res.status(422).json({
                message : 'not allowed'
            })
        }
        console.log(req.body.email);
        let teacher = await  User.findOne({email : req.body.email});
        if(teacher){
            return res.status(200).json({
                message : 'user already exists'
            });
        }
        // req.check('password','Invalid Email Address').isLength({min : 6 , max : 20});
        
        await body('email').isEmail().run(req);
        await body('password').isLength({min: 6}).run(req);
        const errors =  validationResult(req);

        
        
        if (!errors.isEmpty()){
            return res.status(400).json({
                message : 'invalid inpute]s',
                errors : errors.array()
            })
        }
        


        let teacherData = req.body;
        teacherData.createdBy = req.user._id;
        teacherData.usertype = 'Teacher';
  
        
        let tchr = await User.create(teacherData);
  
        return res.status(200).json({
            message : 'Teacher created'
        });
    }catch(err){
        console.log('error creating teacher',err);
        return res.status(500).json({
            error : err,
            message : 'internal srver error'
        });
    }
}
    

module.exports.blockUser = async function (req,res){
    try{
        let bid = req.params.id;
        let user = await User.findById(bid);
        if(!user){
            return res.status(400).json({
                message : 'bad req'
            });
        }
        user.blockStatus = true;
        user.save();
        return res.status(200).json({
            success : true,
            message : "blocked user"
        })
    }catch(err){
        return res.status(500).json({
            message : "internal server error"
        })
    }
}




    