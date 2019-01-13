const express = require('express');
const router = express.Router();

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
        res.send('Pass');
    }
});


module.exports = router;