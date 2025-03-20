import * as userService from "../Services/UserService.js";

// Register Route
export const Register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, dob } = req.body;
    const imageFile = req.file;
    const response = await userService.registerUser({
      firstName,
      lastName,
      email,
      password,
      phone,
      dob,
      imageFile,
    });
    return res.json({ success: true, ...response });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Login Route
export const Login = async (req, res) => {
  try {
    const response = await userService.loginUser({
      email: req.body.email,
      password: req.body.password,
    });
    return res.json({ success: true, ...response });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Profile Route
export const Profile = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userService.getUserProfile(userId);
    return res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Update Route
export const UserUpdate = async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, phone, dob } = req.body;
    const imageFile = req.file;
    const response = await userService.userUpdate({
      userId,
      firstName,
      lastName,
      phone,
      dob,
      imageFile,
    });
    return res.json({ success: true, ...response });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Send OTP Route
export const SendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await userService.sendOtp(email);
    return res.json({ success: true, ...response });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Verify OTP Route
export const VerifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const response = await userService.verifyOTP({ userId, otp });
    return res.json({ success: true, ...response });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Change Password Route
export const ChangePassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    const response = await userService.resetPassword({
      userId,
      newPassword,
    });
    return res.json({ success: true, ...response });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
