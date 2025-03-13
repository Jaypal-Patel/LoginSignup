import express from "express";
import {
  Register,
  Login,
  Profile,
  ForgetPassword,
  ResetPassword,
} from "../controllers/UserController.js";
import AuthUser from "../middlewares/userAuth.js";
import uplode from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", uplode.single("image"), Register);
router.post("/login", Login);
router.get("/profile", AuthUser, Profile);
router.post("/forget-password", ForgetPassword);
router.post("/reset-password/:id/:token", ResetPassword);

export default router;
