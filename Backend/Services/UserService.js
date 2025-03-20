import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import nodemailer from "nodemailer";
import { sendMail } from "../middlewares/mailer.js";
import OTPModel from "../models/OtpModel.js";

// Register User
export const registerUser = async ({
  firstName,
  lastName,
  email,
  password,
  phone,
  dob,
  imageFile,
}) => {
  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields are required");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const convertToDate = (dobString) => {
    const [day, month, year] = dobString.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  const formattedDob = convertToDate(dob);

  const userData = {
    firstName,
    lastName,
    email,
    phone,
    dob: formattedDob,
    password: hashPassword,
  };

  if (imageFile) {
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    userData.image = imageUpload.secure_url;
  }

  const newUser = new UserModel(userData);
  await newUser.save();
  return { message: "User registered successfully" };
};

// Login User
export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("All fields are required");
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error("User does not exist");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return { message: "Login successful", token };
};

// User Profile Route
export const getUserProfile = async (userId) => {
  const user = await UserModel.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

// Update Route
export const userUpdate = async ({
  userId,
  firstName,
  lastName,
  phone,
  dob,
  imageFile,
}) => {
  if (!userId || !firstName || !lastName || !phone || !dob) {
    throw new Error("Missing required files");
  }

  const convertToDate = (dobString) => {
    const [day, month, year] = dobString.split("/");
    return new Date(`${year}-${month}-${day}`);
  };
  const formattedDob = convertToDate(dob);

  const updateData = { firstName, lastName, phone, dob: formattedDob };

  if (imageFile) {
    const imageUplode = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    updateData.image = imageUplode.secure_url;
  }

  const updateUser = await UserModel.findByIdAndUpdate(userId, updateData, {
    new: true,
  });

  if (!updateUser) {
    throw new Error("User not found");
  }

  return { message: "User Update successfully" };
};

// Send OTP Route
export const sendOtp = async (email) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error("email not existed");
  }

  const otp = Math.floor(Math.random() * 10000);

  user.otp = otp;
  user.otpExprires = new Date() + 5 * 60 * 1000;
  await OTPModel.create({ userId: user._id, otp });

  await sendMail(email, "Password Reset OTP", `Your OTP is: ${otp}`);

  return { message: "OTP sent to email" };
};

// Verify OTP Route
export const verifyOTP = async ({ userId, otp }) => {
  const otpRecord = await OTPModel.findOne({ userId, otp });

  if (!otpRecord) {
    throw new Error("Invalid or expired OTP");
  }
  await OTPModel.updateOne({ userId, otp }, { verify: true });

  return { message: "OTP verified successfully" };
};

// Change Password Route
export const resetPassword = async ({ userId, newPassword }) => {
  const otpRecord = await OTPModel.findOne({ userId, verify: true });
  if (!otpRecord) {
    throw new Error("OTP not verified");
  }
  console.log(otpRecord);
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await UserModel.updateOne({ _id: userId }, { password: hashedPassword });
  await OTPModel.deleteMany({ userId });

  return { message: "Password reset successful" };
};
