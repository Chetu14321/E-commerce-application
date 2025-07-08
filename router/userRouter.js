const express = require('express');
const { registerUser, loginUser, verifyController, logoutUser, getAllUsers, forgotPassController, updatePassController ,updateUserProfile} = require('../controller/userController');
const auth =require('../middleware/auth')
const upload=require("../controller/uploadMiddleware")
const router = express.Router();

router.post('/register', registerUser);
router.post('/login',loginUser);
router.get('/verify', auth,verifyController)
router.post("/logout", auth,logoutUser);
router.get("/all",auth,getAllUsers)
router.post("/forgot",forgotPassController)
router.patch("/update",updatePassController)
// router.put("/update/:id", upload.single("profileImage"), updateUserProfile);

module.exports = router;
