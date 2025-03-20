import mongoose from "mongoose";

const mongodbConnect = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB Connected"))
    .catch((error) => console.log(error));
};

export default mongodbConnect;
