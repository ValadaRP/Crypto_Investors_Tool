const express = require('express');
const userController = require('../controllers/user-controller');
const checkAuth = require('../middleware/check-auth');
const {check} = require("express-validator");
const router = express.Router();

router.post('/getuser', userController.getUser);
router.post('/signup',[check('name').not().isEmpty().isLength({min:2,max:15}),
    check('email').not().isEmpty().isEmail(),check('password').not().isEmpty().isLength({min:6,max:60})] ,userController.signUpUser);

router.post('/login', [check('email').not().isEmpty().isEmail(),
    check('password').not().isEmpty().isLength({min:6,max:60})], userController.logInUser);

router.post('/update',[check('email').not().isEmpty().isEmail(),
    check('newpassword').not().isEmpty().isLength({min:6,max:60})] ,userController.updatePassword);

router.use(checkAuth); // Everything after this route is protected and only logged in users can access it
router.post('/updatebalance',[check('newBalance').not().isEmpty().isFloat({min:0.0001,max:100000})] ,userController.updateBalance);
router.delete('/delete/:uid', userController.deleteUser);
router.post('/updateName', [check('newName').not().isEmpty().isLength({min:2,max:15})], userController.updateName);


module.exports = router;

