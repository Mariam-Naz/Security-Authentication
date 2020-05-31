require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/secretDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(passportLocalMongoose);

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
    const password = req.body.password;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            email: email,
            password: hash
        });
        newUser.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.render('secrets');
            }
        });
    });
    });
    
app.post('/login',function(req,res){
    const email = req.body.username;
    const password = req.body.password
    User.findOne({email:email},function(err,found){
        if(err){
            console.log(err);
        }else{
            bcrypt.compare(password, found.password, function(err, result) {
                // result == true
                if(result === true){
                    res.render('secrets');
                }else{
                    res.send('incorrect password');
                }
            });
               
        }
    })
});

app.listen(3000,function(){
    console.log('Server started at port 3000');
})
