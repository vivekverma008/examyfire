const express = require('express');
const passport = require('passport');
const router = express.Router();
const adminController = require('../../../controllers/v1/admin_api');


router.post('/createAdmin',adminController.createAdmin);
router.post('/createTeacher',adminController.createTeacher);
router.get('/blockUser/:id',adminController.blockUser);
router.get('/',adminController.admininfo);
module.exports = router;