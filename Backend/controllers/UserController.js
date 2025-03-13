import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";

// Register Route
export const Register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const imageFile = req.file;

    if (!fullName || !email || !password || !imageFile) {
      return res.json({ success: false, message: "All files required" });
    }

    // validation email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Not valid email" });
    }

    // check user
    const User = await UserModel.findOne({ email });
    if (User) {
      return res.json({ success: false, message: "User Already existed" });
    }

    // strong password
    if (password.length < 8) {
      return res.json({ success: false, message: "Not strong password" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // image uplode cloudinary
    const imageUplode = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUplode.secure_url;

    // create user
    const newUser = new UserModel({
      fullName,
      email,
      password: hashPassword,
      image: imageUrl,
    });
    await newUser.save();
    return res.json({ success: true, message: "Register Successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Login Route
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "All files required" });
    }

    // check user
    const User = await UserModel.findOne({ email });
    if (!User) {
      return res.json({ success: false, message: "User not existed" });
    }

    // password comppare
    const CompparePass = await bcrypt.compare(password, User.password);
    if (!CompparePass) {
      return res.json({
        success: false,
        message: "Password wrong, pleace try again",
      });
    }

    // create token
    const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.json({ success: true, message: "Login Succefully", token });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Profile Route
export const Profile = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await UserModel.find({ _id: userId }).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Forget Password Route
export const ForgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // check user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not registered" });
    }

    // generate JWT Token
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "15m" });

    // reset password link
    const link = `http://localhost:5173/reset-password/${user._id}/${token}`;

    // email configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${link}">here</a> to reset your password.</p>`,
    };

    // send email
    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Password reset link sent to email",
      link,
    });
  } catch (error) {
    console.error("Error in ForgetPassword:", error);
    return res.json({ success: false, message: error.message });
  }
};

// Reset Password Route
export const ResetPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    // find user by ID
    const user = await UserModel.findById(id);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    // verify token
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.json({ success: false, message: "Invalid or expired token" });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};
