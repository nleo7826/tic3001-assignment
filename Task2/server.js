// ImPORT express
const express = require('express');
// ImPORT Body parser
const bodyParser = require('body-parser');
// ImPORT Mongoose
const mongoose = require('mongoose');
//ImPORT cors
const cors = require('cors');
//ImPORT jwt
// const jwt = require('jsonwebtoken');
// Initialize the app
const app = express();
// ImPORT routes
const apiRoutes = require("./api-routes");

app.use(cors());
// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// Connect to Mongoose and set connection variable
mongoose.connect('mongodb://localhost/productsdb', { useNewUrlParser: true, useUnifiedTopology: true});

// require('crypto').randomBytes(64).toString('hex')
// '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611'

const db = mongoose.connection;

// Added check for DB connection

if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

// Setup server PORT
const PORT = process.env.PORT || 8080;

// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express'));

// Use Api routes in the App
app.use('/api', apiRoutes);
// Launch app to listen to specified PORT
if(!module.parent){
    app.listen(PORT, () => {
        console.log("Server running on PORT", PORT);
    });
}

module.exports = {
    app,
    PORT
  };