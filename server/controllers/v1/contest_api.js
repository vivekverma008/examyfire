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
        console.log(req.body);
        
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
        let exist = await Contest.findOne({slug : req.body.slug});
        if(exist){
            return res.status(400).json({
                success : false,
                message : "contest already exist",
                
            });
        }
        if((req.body.regStartTime) >= (req.body.regEndTime))valid = false;
        if(req.body.duration < 1)valid = false;
        if((req.body.startTime) >= (req.body.endTime))valid = false;
        
        let newls = await Promise.all(req.body.list.map(async(que)=>{
            let pr=   await(Problem.findOne({title : que.title}));
            // pr.status = false;
            await pr.save();
            return pr.id;
        }));
        console.log('my list');
        newls = Array.from(new Set(newls));
        
        let tempdata = await Contest.create({
            slug : req.body.slug,
            questions : newls,
            startTime : new Date(req.body.startTime).toISOString(),
            endTime : new Date(req.body.endTime).toISOString(),
            duration  : (req.body.duration),
            regStartTime : new Date(req.body.regStartTime).toISOString(),
            regEndTime : new Date(req.body.regEndTime).toISOString(),
            createdBy : creator.id
        });
         return res.json({
            message : "ok created contest",
            // data : tempdata
        })

    }catch(err){
        console.log(err.message);
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
            testlist : await Promise.all(result.map(async(v)=>{
                let userRegistered = await ContestRegistration.findOne({user : req.user.id , test : v.id});
                return {
                    id: v._id, title : v.slug,status : v.status,
                    startTime : v.startTime, endTime  : v.endTime , duration : v.duration,
                    regStartTime : v.regStartTime , regEndTime : v.regEndTime,user_registered : (userRegistered?true:false)
                }

            })
            )
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

module.exports.getallcontestants = async function(req, res) {
    const { contestid } = req.query;
    if (!contestid) {
      return res.status(400).json({ message: 'Missing contestid query parameter' });
    }
  
    try {
      console.log("contestid " , contestid);
      let list = await ContestRegistration.find({ test: contestid }).populate('user');
      console.log("contestid " ,list);
      let listUpdated = list.map((v)=>{
        return {
            username : v.user.username,
            usertype : v.user.usertype,
            useremail : v.user.email,
            id : v.user.id
        }
      })
      console.log(listUpdated)
      return res.json({
        registeredCandidates: listUpdated,
        success: true
      });
    } catch (err) {
        console.log(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };


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
module.exports.getTest = async function(req,res){
    
    try{
        let slug = req.params.slug || null;
        if(slug == null){
            return res.status(404).json({
                message : " no contest found with given slug"
            })
        }
        let contest = await Contest.findOne({slug : slug}).populate('questions');
        let current_status = getTestStatus(contest);
        if(current_status !== contest.status){
            await updateStatus(contest,current_status);
            contest.status = current_status;
    
        }
        if( (req.user.id != contest.createdBy) &&(!(current_status == "TEST_COMPLETE" || current_status== "TEST_COMPLETE"))){
            console.log(contest.status);
            return res.status(403).json({
                message : "cannot enter contest"
            })
        }
        let ques_form = contest.questions.map((ques)=>{
            return {
                title : ques.title,
                id : ques._id,
                solvedby : ques.solvedby
            }
        });
        if(contest){
            return res.json({
                questions : ques_form,
                id : contest.id
            });
        }
    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            message :  " internal server error"
        })
    }
}
