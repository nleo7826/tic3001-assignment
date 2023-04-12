const authMiddleware = require('./middleware/auth');
const router = require('express').Router();
// Set default API response
router.get('/', (req, res) =>    {
        res.send({ express: 'Express Backend is connected to React, api-routes success' });
});

const productController = require('./controllers/productController')

// Product routes
router.route('/products', authMiddleware)
    .get(productController.index)
    .post(productController.new);

router.route('/products/:product_id', authMiddleware)
    .get(productController.view)
    .patch(productController.update)
    .put(productController.update)
    .delete(productController.delete);
    
// Export API routes
module.exports = router;
