require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const md5 = require('md5');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

mongoose.connect('mongodb://localhost:27017/secretDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

//encryption-work

userSchema.plugin(encrypt,{secret:process.env.TOP_SECRET, encryptedFields:['password']});

const User = mongoose.model('User',userSchema);

app.get('/',function(req,res){
    res.render('home');
});
app.get('/login',function(req,res){
    res.render('login');
});
app.get('/register',function(req,res){
    res.render('register');
});

app.post('/register',function(req,res){
    const email = req.body.username;
    const password = md5(req.body.password);
    const newUser = new User({
        email: email,
        password: password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render('secrets');
        }
    });
});
app.post('/login',function(req,res){
    const email = req.body.username;
    const password = md5(req.body.password);
    User.findOne({email:email},function(err,found){
        if(err){
            console.log(err);
        }else{
            if(found.password === password){
                res.render('secrets');
            }
        }
    })
});

app.listen(3000,function(){
    console.log('Server started at port 3000');
})
