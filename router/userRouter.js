const express = require('express');
const { registerUser, loginUser, verifyController, logoutUser, getAllUsers } = require('../controller/userController');
const auth =require('../middleware/auth')
const router = express.Router();

router.post('/register', registerUser);
router.post('/login',loginUser);
router.get('/verify', auth,verifyController)
router.post("/logout", auth,logoutUser);
router.get("/all",auth,getAllUsers)

module.exports = router;
