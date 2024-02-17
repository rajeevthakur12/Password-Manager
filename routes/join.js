const express = require('express');
const router = express.Router();
const _ = require('lodash');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {forwardAuthenticate} = require('../middleware/auth');


router.post('/register', async(req, res) => {
    const {error} = User.validate(req.body);
    if (error) {
        return res.status(400).json({ok:false, message: error.details[0].message});
    }
    // make sure that username is unique..
    let user = await User.find({username: req.body.username});
    
    if(user) {
        return res.status(409).json({ok: false, message: 'Sorry! Username already taken.'});
    }
    //if valid create user object.
    user = new User(_.pick(req.body, ['username', 'password']));
    //create hash of password.
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    //insert into database
    await user.save();
    //send user object in response (use lodash for selecting properties of user)

    // send json web token in response...
    let maxAge = 60*60;
    let token = user.generateAuthToken();
    res.cookie('auth_token', token, {httpOnly: true, maxAge: 1000*maxAge});
    res
        .status(200)
        .json({ok: true, message: "Success", user: _.pick(user, ["username"])});
});

router.post('/login', async (req, res) => {

    let user = await User.find({username: req.body.username});
    if (!user) {
        return res.status(401).render('login', {err: 'Username is incorrect'});
    } 
    const validatePass = await bcrypt.compare(req.body.password, user.password);
    if (!validatePass) {
        // console.log(user.password + '\n')
        console.log(req.body.password + '\n')
        return res.status(401).render('login', {err: 'Password is incorrect'});
    }
    let maxAge = 60*60;
    
    const token = new User(user).generateAuthToken();
    res.cookie('auth_token', token, {httpOnly: true, maxAge: 1000*maxAge});

    res.status(200).redirect('../vault');
});

router.get('/register', [forwardAuthenticate], (req, res)=> {
    res.render('register');
});

router.get('/login', [forwardAuthenticate],(req, res) => {
    res.render('login', {
        err : req.flash('error'), 
        success_msg: req.flash('success_msg'),
    });
});


module.exports = router;