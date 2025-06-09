const express = require('express');
const { createOrder, getAllOrdersForUser, getOrderById } = require('../controller/orderController');
const protect  = require('../middleware/auth');
const router = express.Router();

router.post('/create', protect, createOrder);
router.get('/user/:userId', protect, getAllOrdersForUser);
router.get('/user/:us', protect, getOrderById);
module.exports = router;
