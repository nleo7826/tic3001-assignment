const router = require('express').Router();
const userController = require("./controllers/userController");

router.get('/', (req, res) =>    {
    res.send({ express: 'Express Backend is connected to React, user-routes success' });
});

router.route('/register')
    .post(userController.registerUser);

router.route('/login')
    .post(userController.loginUser);
    
// Export API routes
module.exports = router;
