const express = require('express');
const router = express.Router();
const adminController = require('../../../controllers/v1/admin_api');
const userController = require('../../../controllers/v1/user_api');
var passport = require('passport');

router.post('/adminsignIn',adminController.createSession);
router.use('/admin',passport.authenticate('admin-token',{session : false}),require('./admin'));
router.post('/usersignin' ,userController.createSession);
router.use('/user',passport.authenticate('user-token',{session : false}),require('./user'));
router.post('/usersignup',userController.signup);
module.exports = router;