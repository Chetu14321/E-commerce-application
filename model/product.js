const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true // e.g., grains, fruits, seeds
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  image: {
    type: String // URL or Cloudinary path
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
