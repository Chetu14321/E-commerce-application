const Order = require('../model/order'); // Assuming Order model is in the 'models' directory
const Product = require('../model/product'); // Assuming Product model is in the 'models' directory

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, items, shippingAddress } = req.body;

    if (!userId || !items || items.length === 0 || !shippingAddress) {
      return res.status(400).json({ error: 'User ID, items, and shipping address are required' });
    }

    // Calculate the total price of the order
    let totalPrice = 0;
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ error: `Product with ID ${item.product} not found` });
      }
      totalPrice += product.price * item.quantity;  // Calculate price based on product price and quantity
    }

    // Create a new order
    const order = new Order({
      userId,
      items,
      totalPrice,
      shippingAddress
    });

    // Save the order to the database
    await order.save();
    res.status(201).json(order);  // Send the created order in response
  } catch (err) {
    res.status(400).json({ error: err.message });  // Handle any errors
  }
};



// Get all orders for a specific user
exports.getAllOrdersForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('User ID:', userId);

    const orders = await Order.find({ userId }).populate('items.product');

    console.log('Orders:', orders);

    if (!orders.length) return res.status(404).json({ message: 'No orders found for this user' });

    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(400).json({ error: err.message });
  }
};


// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate('items.product');
    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Shipped', 'Delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
