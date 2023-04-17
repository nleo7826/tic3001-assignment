const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userController = {};

// Register user
userController.registerUser = async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }

        // Check if user already exists in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send("User already exists. Please login");
        }

        // Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        // Save user token
        user.token = token;
        await user.save();

        // Return new user
        res.status(201).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
};

// Login user
userController.loginUser = async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }

        // Find user in our database
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).send("User not found. Please register.");
        }

        // Compare user password
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).send("Invalid credentials. Please try again.");
        }

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        // Save user token
        user.token = token;
        await user.save();

        // Return user data and token
        res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
            },
            token,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
};

module.exports = userController;
