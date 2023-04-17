const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
        name: {
            type: String,
            required: [true, 'Name is required.'],
            minlength: [3, 'Name must be at least 3 characters.'],
            maxlength: [50, 'Name cannot be more than 50 characters.']
        },
        price: {
            type: Number,
            required: true,
            validate: {
                validator: function(v) {
                    return /^-?\d+(?:\.\d{1,2})?$/.test(v);
                },
                message: props => `${props.value} is not a valid price. Price must have up to 2 decimal places.`
            }
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required.'],
            min: [0, 'Quantity cannot be negative.']
        },
});

// Export Product model
const Product = mongoose.model('Product', productSchema);
module.exports = Product;