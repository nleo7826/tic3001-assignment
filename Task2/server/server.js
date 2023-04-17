require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

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
// Launch app to listen to specified PORT
if(!module.parent){
    app.listen(port, () => {
        console.log("Server running on port: " + port);
    });
}

// Import routes
const apiRoutes = require("./api-routes");

// Use routes in the App
app.use('/api', apiRoutes);

module.exports = {
    app,
    port
};