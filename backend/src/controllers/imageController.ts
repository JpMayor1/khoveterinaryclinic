import { Request, Response } from "express";
import fs from "fs";
import path from "path";

export const uploadImage = (req: Request, res: Response) => {
    try {
        if (!req.file) {
            throw new Error("No file uploaded");
        }

        const imageUrl = req.file.filename;

        res.status(200).json({
            message: "Image uploaded successfully",
            imageUrl,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to upload image" });
    }
};

export const uploadImageByMobile = (req: Request, res: Response) => {
    try {
        const { imgsource } = req.body;
        if (!imgsource) {
            return res
                .status(400)
                .json({ message: "No image source provided" });
        }

        // Decode the base64 image data
        const base64Data = imgsource.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        // Save the image file with a unique filename
        const filename = `image-${Date.now()}.png`;
        fs.writeFile(`public/images/${filename}`, buffer, (err) => {
            if (err) {
                console.error(err);
                return res
                    .status(500)
                    .json({ message: "Failed to save image" });
            }
            res.status(200).json({
                message: "Image uploaded successfully",
                imageUrl: filename,
            });
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to upload image" });
    }
};

export const deleteImage = (req: Request, res: Response) => {
    try {
        const { image } = req.body;

        if (!image) {
            throw new Error("No image provided");
        }

        const filename = image.split("/").pop() || "";

        const imagePath = path.join(
            process.cwd(),
            "public",
            "images",
            filename
        );

        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: "Failed to delete image" });
                return;
            }

            res.status(200).json({ message: "Image deleted successfully" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete image" });
    }
};
