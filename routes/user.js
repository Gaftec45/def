const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/users');

// ROUTE
router.get('/Signup', (req, res)=>{
    res.render('SignUp')
});

router.post('/login', checkNotAuthenticated, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        // Handle authentication errors
        if (err || !user) {
            console.error('Error during authentication:', err);
            return res.redirect('/user/login');
        }

        // Store additional information in the session (user's name)
        req.session.name = user.name;  // Assuming the user object has a 'name' property

            // Continue with the default passport authentication callback
            passport.authenticate('local', {
                successRedirect: '/user/dashboard',
                failureRedirect: '/user/login',
                failureFlash: true
            })(req, res, next);
        })(req, res, next);
});

router.post('/signup', checkNotAuthenticated, async (req, res)=> {
    try {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: 'user'
        });
        console.log(newUser);
        await newUser.save();
        console.log('User saved:', newUser);

        // Log in the user and store their name in the session
        req.login(newUser, (err) => {
            if (err) {
                console.error('Error logging in user:', err);
                return res.redirect('/user/signup');
            }
            req.session.name = newUser.name; // Store user's name in session
            return res.redirect('/user/login');
        });
    } catch (e) {
        console.error(e);
        res.redirect('/user/signup');
    }
});

router.get('/login', (req, res)=>{
    const errorMessage = req.flash('error');
    // Pass errorMessage to the EJS template
    res.render('login', { errorMessage });
});

router.get('/dashboard', checkAuthenticated, (req, res)=>{
    // const name = req.session.name; // Retrieve user's name from session
    const name = req.body.name; // Retrieve user's name from session
    res.render('dashboard', { name: name });
});

router.get('/dashboard', checkAuthenticated, async (req, res) => {
    const userId = req.user.id;

    try {
        // Fetch orders from the database
        const orders = await orderService.fetchOrdersFromDatabase();
        // Render the dashboard.ejs template and pass the orders variable
        res.render('dashboard', { orders });
    } catch (error) {
        console.error('Error handling dashboard route:', error);
        res.status(500).send('Internal Server Error');
    }
});

// add Logout Route

router.get('/logout', (req, res) => {
    req.logout(); // Passport adds this function to the request object
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/user/login');
    });
});

// END ROUTE

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/user/dashboard');
    }
    next();
}

module.exports = router;