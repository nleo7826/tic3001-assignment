// productController.js
// Import product model
const Product = require('../models/product');
// Handle index actions
exports.index = function (req, res) {
    Product.find()
        .then(products => {
            res.json({
                status: "success",
                message: "Products retrieved successfully",
                data: products
            });
        })
        .catch(err => {
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
    product.quantity = req.body.quantity;
    // save the product and check for errors
    product.save()
      .then(() => {
        res.status(201).json({
          message: 'New product created!',
          data: product
        });
      })
      .catch((err) => {
        // Check for validation error
        res.json(err);
      });
  };
  
  // Handle view product info
  exports.view = function (req, res) {
    Product.findById(req.params.product_id)
      .then((product) => {
        res.json({
          message: 'product details loading..',
          data: product
        });
      })
      .catch((err) => {
        res.send(err);
      });
  };
  
  // Handle update product info
  exports.update = function (req, res) {
    Product.findById(req.params.product_id)
      .then((product) => {
        product.name = req.body.name;
        product.price = req.body.price;
        product.quantity = req.body.quantity;
        // save the product and check for errors
        return product.save();
      })
      .then(() => {
        res.json({
          message: 'Product Info updated',
          data: product
        });
      })
      .catch((err) => {
        res.json(err);
      });
  };
  
  // Handle patch product info
  exports.patch = function (req, res) {
    Product.findById(req.params.product_id)
      .then((product) => {
        product.name = req.body.name ? req.body.name : product.name;
        product.price = req.body.price ? req.body.price : product.price;
        product.quantity = req.body.quantity ? req.body.quantity : product.quantity;
        // save the product and check for errors
        return product.save();
      })
      .then(() => {
        res.json({
          message: 'Product Info updated',
          data: product
        });
      })
      .catch((err) => {
        res.json(err);
      });
  };
  
  // Handle delete product
  exports.delete = function (req, res) {
    Product.deleteOne({
      _id: req.params.product_id
    })
      .then((product) => {
        if (product.deletedCount === 0) {
          res.status(404).send('Product not found');
        } else {
          res.json({
            status: "success",
            message: 'Product successfully deleted'
          });
        }
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  };
  