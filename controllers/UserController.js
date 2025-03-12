import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

// Register Route
export const Register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
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

    // create user
    const newUser = new UserModel({
      fullName,
      email,
      password: hashPassword,
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
