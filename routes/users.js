const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Login
router.get('/login',(req,res) => res.render('login'));

//Register
router.get('/register',(req,res) => res.render('register'));

router.post('/register',(req,res) => {
    const {name,email,password,password2} = req.body;
    let errors = [];

    // Error Possibilities
    if(!name || !email || !password || !password2) {
        errors.push({msg:'Please fill in all fields'});
    }

    if(password != password2) {
        errors.push({msg : 'Passwords do not match'});
    }

    if(password.length < 6) {
        errors.push({msg:'Password must be at least 6 characters long'});
    }

    if(errors.length > 0) {
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // No errors in form - validation passed
        // res.send('Pass');
        User.findOne({email : email})
            .then( user => {
                if(user) {
                    errors.push({msg : 'Email is already registered'});
                    res.render('register',{
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({name,email,password});

                    bcrypt.genSalt(11, (err,salt) => {
                        bcrypt.hash(newUser.password,salt, (err,hash) => {
                            if(err) throw err;
                            // Password = Hashed value
                            newUser.password = hash;

                            // Save User
                            newUser.save()
                                   .then(user => {
                                       req.flash('success_msg','You are now registered and can login');
                                       res.redirect('/users/login');
                                   })
                                   .catch(err => {
                                        console.log(err);
                                        req.flash('error_msg','Error encountered during registeration');
                                        res.redirect('/users/register');
                                   });
                        });
                    });
                    console.log(newUser);
                    //res.send('hello');
                }
            });

    }
});

// Handle User Login via Passport
router.post('/login', (req,res,next) => {
    passport.authenticate('local', {
        successRedirect : '/dashboard',
        failureRedirect : '/users/login',
        failureFlash : true
    })(req,res,next);
});

// Logout
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
});

module.exports = router;