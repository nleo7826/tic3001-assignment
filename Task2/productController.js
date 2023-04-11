// productController.js
// Import product model
Product = require('./productModel');
// Handle index actions
exports.index = function (req, res) {
    Product.get()
        .then(function (products) {
            res.json({
                status: "success",
                message: "products retrieved successfully",
                data: products
            });
        })
        .catch(function (err) {
            res.json({
                status: "error",
                message: err,
            });
        });
};

// Handle create product actions
exports.new = function (req, res) {
    let product = new Product();
    product.name = req.body.name ? req.body.name : product.name;
    product.price = req.body.price;
    product.quatity = req.body.quatity;
// save the product and check for errors
    product.save(function (err) {
        // Check for validation error
        if (err)
            res.json(err);
        else
            res.json({
                message: 'New product created!',
                data: product
            });
    });
};
// Handle view product info
exports.view = function (req, res) {
    product.findById(req.params.product_id, function (err, product) {
        if (err)
            res.send(err);
        res.json({
            message: 'product details loading..',
            data: product
        });
    });
};
// Handle update product info
exports.update = function (req, res) {
    product.findById(req.params.product_id, function (err, product) {
        if (err)
            res.send(err);
        product.name = req.body.name ? req.body.name : product.name;
        product.price = req.body.price;
        product.quatity = req.body.quatity;
// save the product and check for errors
        product.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'product Info updated',
                data: product
            });
        });
    });
};
// Handle delete product
exports.delete = function (req, res) {
    product.remove({
        _id: req.params.product_id
    }, function (err, product) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'product deleted'
        });
    });
};

// Get all products
// exports.getAllProducts = async (req, res) => {
//     try {
//       const products = await Product.find()
//       res.json(products)
//     } catch (err) {
//       console.error(err)
//       res.status(500).send('Server Error')
//     }
//   }