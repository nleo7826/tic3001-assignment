const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
    description: String,
});

// Export Product model
const Product = mongoose.model('Product', productSchema);

module.exports = {
  Product,
  get: function (limit) {
    return Product.find().limit(limit).exec();
  }
}
// // Export Product model
// class Product extends mongoose.model('Product', productSchema) {}
// // module.exports = Product;

// module.exports.get = function (limit) {
//     return Product.find().limit(limit).exec();
// }