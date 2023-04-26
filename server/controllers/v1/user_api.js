const mongoose = require('mongoose');
const moment = require('moment');
const Admin = require('../../models/admin');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const Problem = require('../../models/problem');
const Contest = require('../../models/contest');
const Job = require('../../models/job');
const Codeapis = require('../../controllers/v1/code_api');
const { validationResult , body , query}  = require('express-validator');
const path = require('path')
const fs = require('fs');
const IORedis = require('ioredis');
const {exec, execSync , spawnSync} = require("child_process");
const codedir = "/home/vivek/Desktop/codefire";

let dirprob = path.join(codedir , "codes");
console.log(dirprob);
const outputfilepath = path.join(dirprob,"output.txt");


const passport = require('passport');
const {Queue , Worker , QueueEvents} = require('bullmq') ;
const ContestRegistration = require('../../models/contestRegistration');

const connections = {
    host : "127.0.0.1",
    port : 6379
}

const submitQueue = new Queue('submitqueue' , connections);

const myWorker = new Worker("submitqueue",
    async({data})=>{
        console.log('myqueue');
        
        const jobId =  data.id;
        // console.log(data);
        const job = await Job.findById(jobId);
        // console.log(job);
        if(!job){
            throw Error(`cannot find job with id ${jobId}`);
        }
        let problem = await Problem.findById(data.problemId);
        const testcases = problem.testcases;
        job["startedAt"] = new Date();
        let checkcompile = await Codeapis.checkcompile(job.filepath);
        console.log(checkcompile)


        try{
            
            job["verdict"] = "ac";

            for(let tc of testcases){
                if(checkcompile == false)break;
                const start = moment(new Date());
                console.log(tc);
                await Codeapis.generateInOutTxt(tc.input , tc.output,problem.title);
                fs.writeFileSync(outputfilepath,"");
                
                try{
                    let issame = await Codeapis.executecpp(job.filepath);
                    const end =  moment(new Date());
                    const exectime = end.diff(start,"seconds",true);
                    if(exectime > problem.timelimit){
                        job["verdict"] = "tle";
                        break;
                    }
                    if(issame)continue;
                    else{
                        console.log('wa')
                        job["verdict"] = "wa";
                        job["status"] = "success";
                        job["output"] = `first failed testcase ${tc.input}`;
                        break;
                    }
                    
                    
                }catch(err){
                    console.log(err);
                    job["status"] = "error";        
                }
                
                
                
            }                

        }catch(err){
            job["status"] = "error";
            console.log(err)
            throw Error(`internal erver err ${err}`);
        }
        
        if(checkcompile === false){
            job["verdict"] = "compile err";
        }
        job["completedAt"] = new Date();
        job["status"] = "success";
        await job.save();
        console.log(job);
        if(job["verdict"] == "ac"){
            
            const whosolved = new Set(problem.solvedby);
            whosolved.add(job.userId);
            // console.log(data.userId);
            // console.log(whosolved);
            
            problem.solvedby = [...whosolved];
            // console.log(problem.solvedby);
            await problem.save();
        }
        if(job["status"] = "success"){
            fs.unlink(job.filepath,(err)=>{
                if(err)throw err;
                console.log(`deleted the file`);
            })

        }
    },{autorun:true , connections} 
);

myWorker.on("failed",(job,error)=>{
    console.log(error,job.id);
})
myWorker.on("error" , (err)=>{
    console.log("error in queue");
    console.log(err);
})

module.exports.createSession = async function(req,res,next){
    
    try{
        let user = await User.findOne({email : req.body.email});
        console.log(user);
        if(!user || req.body.password != user.password){
            return res.status(400).json({
                message : 'Invalid username or password'
            })
        }
        return res.json({
            message : 'signIn successfull , here is your token',
            data : {
                token : jwt.sign(user.toJSON(),'examyfire',{expiresIn : '1d'})
            } 
        })
    
        

    }catch(err){
        console.log('***********',err);
        return res.status(500).json({
            message : 'internal sereer err'
        })
    }
    
}  
module.exports.createProblem = async(req,res)=>{
    console.log(req.body);
    if(req.user.usertype != 'Teacher'){
        return res.status(400).json({
            message : 'not authorized'
        });
    }

    try{

        await body('title').isLength({min: 3}).run(req);
        await body('testcases').isArray({min : 2}).run(req);
        
        let bdy = await req.body;
        bdy.createdBy = await req.user;
        
        let prob = await Problem.findOne({title : req.body.title});
        if(prob){
            return res.status(200).json({
                message : 'problems exists already need to change the slug'
            });
        }
        prob = await Problem.create(bdy)
        return res.status(200).json({
            message : 'created problem',
            data : prob.title
        });

    }catch(err){
        return res.status(440).json({
            message : 'internal server err',
            error : err
        })
    }

}
module.exports.signup = async function(req,res){
    let user = await User.findOne({email : req.body.email});
    if(user){
        
        //  res.json({
        //     message : 'user exists with this email'
        // });
        return res.redirect('/usersignin');
    }
    user = User.create(req.body);
    return res.status(200).json({
        message : 'user created'

    })
}

module.exports.submit = async function(req,res){

    let {code , language="cpp" , problemId,contestid  } = req.body;
    if(code == undefined || !code){
        return res.status(400).json({
            message : "code field cannot be empty"
        })
    }

    let userid = req.user.id;
    let contest = await Contest.findById(contestid);
    let valid = false;
    let problem = await Problem.findById(problemId);
    if(problem.status == true)valid = true;
    if(contest){
        for(prob of contest.questions){
            if(prob == problemId){
                let registered = await ContestRegistration.find({user : req.user.id, test : contest.id});
                if(registered)
                    valid = true;
                break;
            }
        }
        
    }
    if(!valid){
        return res.json({
            message : 'problem is not available'
        })
    }
    let job;
    try{
        let filepath = Codeapis.generateFile(language , code);
        console.log();
        filepath = (await filepath).toString()
        job = await Job.create({
            language : language,
            filepath : filepath,
            submittedAt : new Date,
            problemId : problemId,
            userId : req.user.id,
            verdict : "ac",
            output : "",
            startedAt : new Date,
            completedAt : new Date,

            

        });
        console.log(job);

        await submitQueue.add('submission',{
            id : job.id,
            problemId,
            userid
        }
            

        );
        
        return res.status(200).json({
            message : "success " , 
            data : job.id
        })

    }catch(err){
        return res.status(500).json({
            message : "internal serer err",
            error : err
        })
    }
}











