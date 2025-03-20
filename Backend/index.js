import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectCloudinary from "./confing/Cloudinary.js";
import mongodbConnect from "./confing/MongodbConnect.js";

import UserRouter from "./routers/UserRoter.js";

const app = express();
dotenv.config();
connectCloudinary();
mongodbConnect();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", UserRouter);

app.listen(port, () => {
  console.log(`Server Start ${port}`);
});
