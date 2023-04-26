const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../../../controllers/v1/user_api');
const contestController = require('../../../controllers/v1/contest_api');

router.post('/createProblem' , userController.createProblem);
router.post('/submit' , userController.submit);
router.post('/createcontest' , contestController.createContest);
router.get('/getallcontests',contestController.getAllTest);
router.post('/Register',contestController.testRegistration);
router.get('/showParticipants',contestController.getallcontestants);
router.get('/entercontest',contestController.enterContest);
module.exports = router;