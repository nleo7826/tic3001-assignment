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
// Launch app to listen to specified PORT
app.listen(port, () => {
    console.log("Server running on port: " + port);
});

// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express'));

// Import axios for making HTTP requests
const axios = require('axios');
const Redis = require('redis');
const DEFAULT_EXPIRATION = 3600;

app.get('/photos', async (req, res) => {
  (async () => {
    const redisClient = Redis.createClient()
    await redisClient.connect();
    const albumId = req.query.albumId;
    const { data } = await axios.get(
    'https://jsonplaceholder.typicode.com/photos',
    { params: { albumId } }
    );
    redisClient.setEx('photos', DEFAULT_EXPIRATION, JSON.stringify(data));
    res.json(data);
  })()
});
