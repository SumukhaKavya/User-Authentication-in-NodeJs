const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "views" folder
app.use(express.static('views'));


// Route to render the sign-up form
app.get('/signup', (req, res) => {
    console.log('Accessing /signup route');
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

// Route to render the sign-in form
app.get('/signin', (req, res) => {
    console.log('Accessing /signin route');
    res.sendFile(path.join(__dirname, 'views', 'signin.html'));
});

let authRouter = require('./routes/auth');

mongoose.connect('mongodb://127.0.0.1:27017/userdata', {useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
  console.log('Connected to DB');
})
.catch((err)=>{
    console.log("Error ", err)
});

app.use('/',authRouter);

app.listen(5000,"localhost", (error)=>{
    if(error){
        console.log("Error ", error);
    }else{
        console.log("web server is now live on localhost:5000");
    }
});

