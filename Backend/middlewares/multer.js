import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Task",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const uplode = multer({ storage });

export default uplode;
