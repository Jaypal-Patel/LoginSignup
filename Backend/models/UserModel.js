import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: "",
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
