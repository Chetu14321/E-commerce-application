const User = require('../model/user');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const genarateToken = require("../utils/token")
// const User = require('../models/User'); // adjust path as needed

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.loginUser=async(req,res)=>{
    try{

    let {email,password}=req.body
        //verify the emailid
        let exUser=await User.findOne({email})
        if(!exUser)
            return res.status(404).json({msg:`User ${email} not found`})

        //verify password

        let veriftPass= await bcrypt.compare(password,exUser.password)
        if(!veriftPass)
            return res.status(402).json({msg:"Invalid password"})

        //login token
        let token=await genarateToken(exUser._id)

        //cookie

        res.cookie("login_token",token,{
            httpOnly:true,
            signed:true,
            path: "/",
            expires:new Date(Date.now()+1000*60*60*24*30)
        })


        res.json({msg:"login successful", token,role:exUser.role,exUser})
    }catch(err){
        return res.status(404).json({msg:err.message});
    }
}
exports.verifyController = async (req,res) => {
    try {
        let id = req.userId 

        // verify the user
        let exUser = await User.findById({_id: id }).select("-password")
            if(!exUser)
                return res.status(404).json({ msg: `request user id not found..`})
        

        res.json({ msg: "verified successful", user: exUser })
    } catch (err) {
        return res.status(401).json({ msg: err.message })
    }
}
exports.logoutUser = async (req, res) => {
  try {
    // Clear the login_token cookie
    res.clearCookie("login_token", {
      httpOnly: true,
      signed: true,
      path: "/",
    });

    return res.status(200).json({ msg: "Logout successful" });
  } catch (err) {
    return res.status(500).json({ msg: "Logout failed", error: err.message });
  }
};
// Get all users (Admin access)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude passwords
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch users", error: err.message });
  }
};
