import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import connectCloudinary from "./confing/Cloudinary.js";
import UserRouter from "./routers/UserRoter.js";

const app = express();
dotenv.config();
connectCloudinary();

const port = process.env.PORT;
const mongo_url = process.env.MONGO_URL;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", UserRouter);

mongoose
  .connect(mongo_url)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log(error));

app.listen(port, () => {
  console.log(`Server Start ${port}`);
});
