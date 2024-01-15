if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const express = require('express');
const app = express();
const PORT = 2000;
const passport = require('passport');
const initializePassport = require('./passport-config');
const session = require('express-session');
const flash = require('express-flash');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
  console.log('connected to the database successfully')
})
.catch((err)=> {
  console.error('error connecting to the database', err)
})

initializePassport(passport,
  id => users.find(user => user.id === id),
  email => users.find(user => user.email === email)
)

// midleware
app.use(express.urlencoded({ extended: true }));
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

app.set('view engine', 'ejs');

const userRoute = require('./routes/user');
const orderRoute = require('./routes/order');
// const adminRoute = require('./routes/admin');

// ROUTE
app.use('/user', userRoute);
app.use('/order', orderRoute);
// app.use('/admin', adminRoute);


app.get('/', (req, res)=>{
  res.render('index')
});


app.listen(PORT,()=> {
  console.log('server in now listening to: ',`${PORT}`)
})