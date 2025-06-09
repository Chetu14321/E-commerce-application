const express = require('express');
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controller/productController');
const router = express.Router();

router.post('/create', createProduct);
router.get('/all', getAllProducts);
router.get('/:id', getProductById);
router.patch('/update/:id',updateProduct)
router.delete('/delete/:id',deleteProduct)
module.exports = router;
