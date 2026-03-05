import bcrypt from "bcryptjs";
import UserModel from "../schema/User.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import transporter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE , PASSWORD_RESET_TEMPLATE} from "../config/emailTemplates.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // seding welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "welcome to our app",
      text: `Welcome to our app, ${name}! We're glad to have you on board. Your account has been successfully created. If you have any questions or need assistance, feel free to reach out to our support team. Enjoy exploring our app!`,
    };

    await transporter.sendMail(mailOptions);

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    const user = await UserModel.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials(password is incorrect)",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {

    const userId = req.userId;
    
    const user = await UserModel.findById(userId);

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.VerifyOtp = otp;
    user.VerifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours expiration
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      html : EMAIL_VERIFY_TEMPLATE.replace("{{email}}" , user.email).replace("{{otp}}" , otp)
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "otp sent to your email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req , res) => {
  const userId = req.userId;
  const { otp } = req.body;

  if(!userId || !otp){
    return res.status(400).json({ success: false , message : "Please fill all the fields" });
  }
  try{
    const user = await UserModel.findById(userId);
    if(!user){
      return res.json({ success: false , message : "User not found" });
    }

    if(user.VerifyOtp === '' || user.VerifyOtp !== otp){
      return res.json({ success: false , message : "Invalid OTP" });
    }

    if(user.VerifyOtpExpireAt < Date.now()){
      return res.json({ success: false , message : "OTP expired" });
    }

    user.isAccountVerified = true;
    user.VerifyOtp = '';
    user.VerifyOtpExpireAt = 0;

    await user.save();

    return res.json({ success: true , message : "Account verified successfully" });


  }catch(error){
    return res.json({ success: false, message: error.message });
  }
}

export const isAuthenticated = async (req , res) => {
  try{
    return res.json({ success: true , message : "User is authenticated" });
  }catch(error){
    return res.json({ success: false, message: error.message });
  }
}

export const resetOtp = async (req , res) => {
  try{
    const {email} = req.body;
    
    if(!email){
      return res.status(400).json({ success: false , message : "please provide the right email.."});
    }

    const user = await UserModel.findOne({email});

    if(!user){
      return res.status(400).json({ success: false , message : "User not found "});
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes expiration
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. This OTP is valid for 15 minutes.`,
      html : PASSWORD_RESET_TEMPLATE.replace("{{email}}" , user.email).replace("{{otp}}" , otp)
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success : true , message : "OTP sent to your email" });

  }catch(err){
    return res.json({ success: false, message: err.message });
  }
}

export const verifyResetOtp = async (req , res) => {
  const {email , otp , newPassword} = req.body;

  if(!email || !otp || !newPassword){
    return res.status(400).json({ success: false , message : "please fill all the fields"});
  }

  try{
    const user = await UserModel.findOne({email});

    if(!user){
      return res.status(400).json({ success : false , message : "User not found"});
    }

    if(user.resetOtp === '' || user.resetOtp !== otp){
      return res.status(400).json({ success : false , message : "Invalid OTP"});
    }

    if(user.resetOtpExpireAt < Date.now()){
      return res.status(400).json({ success : false , message : "OTP expired"});
    }

    const hasedPassword = await bcrypt.hash(newPassword , 10);
    user.password = hasedPassword;
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;

    await user.save();


    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset Successful",
      text: `Your password has been reset successfully. If you did not perform this action, please contact our support team immediately.`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success : true , message : "Password reset successful" });

  }catch(err){
    return res.json({ success: false, message: err.message });
  }
}