require('dotenv').config();
// Import express
const express = require('express');
// Import Body parser
const bodyParser = require('body-parser');
// Import Mongoose
const mongoose = require('mongoose');
//Import cors
const cors = require('cors');
// Initialize the app
const app = express();
// Import routes
const apiRoutes = require("./api-routes");
const userRoutes = require("./user-routes");

app.use(cors());
// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// Connect to Mongoose and set connection variable
mongoose.connect('mongodb://localhost:27017/productsdb', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

const db = mongoose.connection;

// Added check for DB connection
if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

// Setup server PORT
const port = process.env.APP_PORT || 8080;

// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express'));

// Use Api routes in the App
app.use('/api', apiRoutes);
// Launch app to listen to specified PORT
if(!module.parent){
    app.listen(port, () => {
        console.log("Server running on port: " + port);
    });
}

// Use user routes in the App
app.use('/user', userRoutes);


module.exports = {
    app,
    port
  };