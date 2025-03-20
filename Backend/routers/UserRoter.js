import express from "express";
import {
  Register,
  Login,
  Profile,
  UserUpdate,
  SendOtp,
  VerifyOtp,
  ChangePassword,
} from "../controllers/UserController.js";
import AuthUser from "../middlewares/userAuth.js";
import uplode from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", uplode.single("image"), Register);
router.post("/login", Login);
router.get("/profile", AuthUser, Profile);
router.put("/update/:id", uplode.single("image"), UserUpdate);
router.post("/forget-password", SendOtp);
router.post("/verify-otp", VerifyOtp);
router.post("/reset-password", ChangePassword);

export default router;
