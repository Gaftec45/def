const express = require('express');
const router = require('./routes/user');
const app = express();
const path = require('path');
const PORT = 3000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Corrected the property to 'views'

// // Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(router);

app.get('/', (req, res) => {
  res.render('index');
});


app.listen(PORT, () => {
  console.log(`App is running on: ${PORT}`);
});