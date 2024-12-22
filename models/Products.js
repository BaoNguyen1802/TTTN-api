const mongoose = require('mongoose');

// Định nghĩa Schema cho sản phẩm
const productSchema = new mongoose.Schema({
    img: {
        type: String,
        required: true, // Đảm bảo ảnh phải được cung cấp
    },
    productName: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    badge: {
        type: Boolean,
        default: false,
    },
    des: {
        type: String,
        maxlength: 500, // Tối đa 500 ký tự
    },
});

module.exports = mongoose.model("Product", productSchema)