const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./router/userRouter');
const productRoutes = require('./router/productRouter');
const orderRoutes = require('./router/orderRouter');
const cartRoutes = require("./router/cartRouter");
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
app.use(express.urlencoded())
app.use(express.json());
// app.use(cookieParser())
// const cookieParser = require('cookie-parser');
app.use(cookieParser(process.env.JWT_SECRET));  // Make sure to add the secret for signed cookies



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);


app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
