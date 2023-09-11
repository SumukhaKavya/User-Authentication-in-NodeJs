var express = require('express');
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var router = express.Router();
var User = require('../models/userSchema');

// sign-up route
router.post('/signup', async (req,res,next) => {
    try{
        const {username,password} = req.body;

        // check if user already exists
        const user = await User.findOne({username});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        if(password.length < 5){
            return res.status(400).json({message:"Password must contain atleast 5 characters"});
        }
        // hash password
        const hashedpwd = await bcrypt.hash(password,10);

        // save the new user details
        const newUser = new User({
            username,
            password : hashedpwd
        });
         await newUser.save();
        return res.status(200).json({message:"Added the new User"});
    } catch(err){
        res.status(500).json({ message: 'Server Error' });
    }
});

// sign-in route
router.post('/signin', async (req,res,next) => {
    try{
        const {username,password} = req.body;

        // check if user exists
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({message:"User Not Found"});
        }
        // compare password with hashed password
        const matched = await bcrypt.compare(password,user.password);
        if(!matched){
            return res.status(404).json({message:"Incorrect Credentials"});
        }
        // Generate and return a token
        const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;