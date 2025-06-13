const User = require('../model/user');
const jwt = require('jsonwebtoken');
const mailHandler=require('../config/mail')
const bcrypt = require('bcryptjs');
const genarateToken = require("../utils/token")
const { StatusCodes } = require('http-status-codes');
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

        let temp = `
  <div style="font-family: Arial, sans-serif; padding: 30px; color: #333; background-color: #f9fff9;">
    <div style="max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #4CAF50; padding: 20px;">
        <h1 style="margin: 0; color: white; font-size: 24px;">🌿 Welcome to Agri Mart</h1>
      </div>

      <div style="padding: 20px;">
        <h2 style="color: #4CAF50;">Hi ${name},</h2>
        <p style="font-size: 16px;">Thank you for registering with <strong>Agri Mart</strong>, your trusted partner for all agricultural needs.</p>

        <h3 style="margin-top: 30px; color: #388e3c;">Your Registration Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #e8f5e9;">
              <th style="padding: 10px; border: 1px solid #ccc;">Name</th>
              <th style="padding: 10px; border: 1px solid #ccc;">Email</th>
              <th style="padding: 10px; border: 1px solid #ccc;">Mobile</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
             
            </tr>
          </tbody>
        </table>

        <p style="font-size: 15px; margin-top: 30px;">We’re excited to have you with us. Stay tuned for the best deals on seeds, fertilizers, tools, and more!</p>

        <hr style="margin: 40px 0; border: none; border-top: 1px solid #ccc;" />

        <p style="font-size: 16px;">Warm regards,<br/>
        <strong style="color: #4CAF50;">Team Agri Mart</strong></p>
      </div>
    </div>
  </div>
`;

      

        await mailHandler(email,"user Registration",temp)//email configuration while sending the welcome message
        .then(out=>{
            res.status(200).json({msg:" user rigister successfully",user: user})

        }).catch(err=>{
            return res.status(404).json({msg:err.message})
        })
       
    }catch(err){
        return res.status(404).json({msg:err.message});
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



// formgot pass


exports.forgotPassController=async(req,res)=>{
    try{
        let {email}=req.body;
        //verify the emailid
        let exUser=await User.findOne({email})
        if(!exUser)
            return res.status(StatusCodes.NOT_FOUND).json({msg:`User ${email} not found`})
        //generate random password

        //send an email to the user to update the password
        let num =Math.floor(100000+Math.random()*999999)

        let template=`<div>
                       <h1>${exUser.name} , we proccesed the rewuest for  genatring the new password.....</h1>
                       <h3>OTP: <strong><mark>${num}</mark></strong></h3> 
                      </div>`
        await User.findOneAndUpdate({email},{otp:num})

        //send email to user and store the otp
        await mailHandler(exUser.email,"Reset Password",template)
        .then(out=>{
            res.status(StatusCodes.OK).json({msg:"Otp successfully....sent check your email inbox...."})
        })
        .catch(err=>{
             return res.json(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.message})
        })
    }catch(err){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.message});
    }
}









exports.updatePassController = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    // 1. Check if user exists
    const exUser = await User.findOne({ email });
    if (!exUser) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: `User ${email} not found` });
    }

    // 2. Verify OTP
    if (exUser.otp !== otp) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid OTP' });
    }

    // 3. Check if new password is same as old
    const isSamePassword = await bcrypt.compare(password, exUser.password);
    if (isSamePassword) {
      return res.status(StatusCodes.CONFLICT).json({ msg: 'New password cannot be same as old password' });
    }

    // 4. Hash the new password and update
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword, otp: 0 } // Reset OTP to 0 after use
    );

    // 5. Send confirmation email
    const template = `
      <div style="font-family: Arial, sans-serif; padding: 30px; color: #333; background-color: #f9fff9;">
        <div style="max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #4CAF50; padding: 20px;">
            <h1 style="margin: 0; color: white; font-size: 24px;">🔐 Password Reset Successful</h1>
          </div>
          <div style="padding: 20px;">
            <h2 style="color: #4CAF50;">Hi ${exUser.name},</h2>
            <p style="font-size: 16px;">Your password has been <strong>successfully reset</strong> for Agri Mart.</p>
            <p style="font-size: 15px; margin-top: 20px;">If you did not request this change, please contact support immediately.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;" />
            <p style="font-size: 16px;">Best regards,<br/>
            <strong style="color: #4CAF50;">Team Agri Mart</strong></p>
          </div>
        </div>
      </div>
    `;

    await mailHandler(exUser.email, 'Password Reset Successful', template);

    // 6. Return success response
    return res.status(StatusCodes.OK).json({ msg: 'Password updated successfully' });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};



