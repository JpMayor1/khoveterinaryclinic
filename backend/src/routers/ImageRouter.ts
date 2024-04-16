import express from "express";
import {
    deleteImage,
    uploadImage,
    uploadImageByMobile,
} from "../controllers/imageController";
import { upload } from "../middleware/multer";

const imageRouter = express.Router();

imageRouter.post("/api/image/upload", upload, uploadImage);
imageRouter.post("/api/image/upload/mobile", uploadImageByMobile);
imageRouter.delete("/api/image/delete", deleteImage);

export default imageRouter;
