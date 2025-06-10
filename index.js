const express = require('express');
const path = require("path");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Load env variables
dotenv.config();

// Routes
const userRoutes = require('./router/userRouter');
const productRoutes = require('./router/productRouter');
const orderRoutes = require('./router/orderRouter');
const cartRoutes = require("./router/cartRouter");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// Connect to MongoDB
mongoose.connect(process.env.CLOUD_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/cart", cartRoutes);

// // Serve frontend static files
// app.use(express.static(path.join(__dirname, "build")));

// // Serve React app for all other routes
// app.get("*", (req, res) => {
//   res.sendFile("index.html", { root: path.join(__dirname, "build") });
// });

// const path = require("path");
app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
