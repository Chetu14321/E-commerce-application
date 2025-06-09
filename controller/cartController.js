const Cart = require("../model/cart");

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate("items.productId");
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  try {
    console.log("Authenticated user ID:", req.userId); // Log the authenticated user

    if (!req.userId) {
      return res.status(400).json({ error: "User not authenticated" });
    }

    let cart = await Cart.findOne({ user: req.userId });
    console.log("Existing cart:", cart);

    if (!cart) {
      console.log("Creating new cart...");
      cart = new Cart({ user: req.userId, items: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(i => i.productId.toString() === productId);
      console.log("Item index in existing cart:", itemIndex);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error); // Log the error for debugging
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

exports.updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(i => i.productId.toString() === productId);
    if (item) {
      item.quantity = quantity;
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ error: "Product not in cart" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update quantity" });
  }
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.userId },
      { $pull: { items: { productId } } },
      { new: true }
    );
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to remove item" });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.userId },
      { $set: { items: [] } },
      { new: true }
    );
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to clear cart" });
  }
};
