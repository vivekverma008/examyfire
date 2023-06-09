const ContestRegistration = require('../../models/contestRegistration');
const Contest = require('../../models/contest');
const Problem = require('../../models/problem');
const {body,validationResult } = require('express-validator');
 
let getTestStatus = (test)=>{
    if(test.status === 'CANCELLED')
    return test.status;
  let status = 'CREATED'
  let now = new Date();
  if(Date.parse(test.resultTime) < now) {
    status = 'RESULT_DECLARED';
  } else if(Date.parse(test.endTime) < now) {
    status = 'TEST_COMPLETE';
  } else if(Date.parse(test.startTime) < now) {
    status = 'TEST_STARTED';
  } else if(Date.parse(test.regEndTime) < now) {
    status = 'REGISTRATION_COMPLETE'
  } else if(Date.parse(test.regStartTime) < now) {
    status = 'REGISTRATION_STARTED';
  }


  return status;
}




module.exports.createContest = async(req,res)=>{
    let creator = req.user || null;
    if(creator == null || req.user.usertype != 'Teacher'){
        return res.status(401).json({
            success : false,
            message : "unauthorized"
        });
    }
    try{
        
        body('list').isArray({min  :1});
        body('regStartTime').isDate();
        body('regEndTime').isDate();
        body('startTime').isDate();
        body('endTime').isDate();
        body('slug').isLength({min: 1});
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
    
        let valid = true;
        req.body.duration = req.body.endTime - req.body.startTime;
        if((req.body.regStartTime) >= (req.body.regEndTime))valid = false;
        if(req.body.duration < 1)valid = false;
        if((req.body.startTime) >= (req.body.endTime))valid = false;
        let newls = await Promise.all(req.body.list.map(async(que)=>{
            let pr=   await(Problem.findOne({title : que}));
            pr.status = false;
            await pr.save();
            return pr.id;
        }));
        console.log('my list');
        console.log(newls);
        
        let tempdata = await Contest.create({
            slug : req.body.title,
            questions : newls,
            startTime : (req.body.startTime),
            endTime : (req.body.endTime),
            duration  : (req.body.duration),
            regStartTime : (req.body.regStartTime),
            regEndTime : (req.body.regEndTime),
            createdBy : creator.id
        });
         return res.json({
            message : "ok created contest",
            // data : tempdata
        })

    }catch(err){
        console.log(err);
        return res.json({
            message : 'err creating contst '
        });
    }
    
}
let updateStatus = async(contest, correctStatus)=>{
    if(correctStatus !== contest.status){
        
        try{
            let updated = await Contest.findByIdAndUpdate(contest._id,{status : correctStatus});
        }catch(err){
            console.log(err);
        }
    }
}

module.exports.getAllTest = async function(req,res){
    let creator = req.user || null;
    if(creator == null){
        res.status(401).json({
            success : false,
            message : "permission not granted"
        })
    }

    try{
        let result = await Contest.find({}).sort({startTime : -1});
        for(x in result){
            let correctStatus = getTestStatus(result[x]);
            if(correctStatus !== result[x].status){

                await updateStatus(result[x],correctStatus);
                result[x].status = correctStatus;
            }
        }
        res.json({
            success : true,
            testlist : await Promise.all(result.map(v=>({
                _id: v._id, title : v.title,status : v.status
            })))
        })

    }catch(err){
        console.log(err);
        res.json({
            success : false,
            testlist : []
        })
    }

}


module.exports.testRegistration = async(req,res)=>{
    body('contestid','test id cannot be empty').notEmpty();
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } 
    let contest = await Contest.findById(req.body.contestid);
    let correctStatus = getTestStatus(contest);
    if(correctStatus != contest.status){
        updateStatus(contest,correctStatus);
        contest.status = correctStatus;
    }
    if(contest.status !== 'REGISTRATION_STARTED'){
        return res.json({
            success : false,
            message  : 'Contest Registration are not open '
        });
    }else{
        try{
            let testRegFind = await ContestRegistration.findOne({user : req.user._id , test : req.body.contestid});
            if(testRegFind){
                console.log(testRegFind);
                res.json({
                    success : false,
                    message : 'Your registration for test is done already'
                })
            }else{
                try{
                    let tempdata = await new ContestRegistration({
                        test : req.body.contestid,
                        user : req.user.id
                    });
                    let saved = await tempdata.save();
                    return res.json({
                        success : true,
                        message : 'test reg done'
                    })
                }catch(err){
                    return res.json({
                        message : "internatl server err"
                    })
                }
                
    
            }
        }catch(e){
            console.log(e);
            return res.json({
                message  : 'internal esrver'
            })
        }
        

    }
}

module.exports.getallcontestants = async function(req,res){
    body('contestid').notEmpty();
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } 
    try{

        let list = await ContestRegistration.find({test  : req.body.contestid});
        return res.json({
            registeredCandidates : list,
            success : true
        })

    }catch(err){
        return res.json({
            message : "internal server err"
        })
    }
}


module.exports.enterContest = async function(req,res){
    let contest = await Contest.findById(req.body.contestid);
    let current_status = getTestStatus(contest);
    if(current_status !== contest.status){
        await updateStatus(contest,current_status);
        contest.status = current_status;

    }
    if(current_status !== "TEST_STARTED"){
        return res.json({
            message : "cannot enter contest"
        })
    }
    console.log(contest.questions)
    let list = await Promise.all(contest.questions.map(async(ques)=>{
        let sample = [];
        console.log(ques);
        ques = await Problem.findById(ques);
        ques.testcases.forEach(tc => {
            if(tc.sample){
                sample.add({
                    input : tc.input,
                    output : tc.output,
                    explanation : tc.explanation
                });
            }
        });
        return {
            id : ques.id,
            statement : ques.statement,
            title : ques.title,
            solvedby : ques.solvedby,
            constraint : ques.constraint,
            timelimit : ques.timelimit,
            memorylimit : ques.memorylimit,
            testcases : sample
        }
    }));
    return res.json({
        list : list,

    })

}
