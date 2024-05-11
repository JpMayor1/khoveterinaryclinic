import { Request, Response } from "express";
import { AdminSchema } from "../models/AdminModel";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { generateCode } from "../utils/generateCode";
import sendEmail from "../utils/sendEmail";

dotenv.config();

// Get All Admins
export const getAdmins = async (req: Request, res: Response) => {
    try {
        const admins = await AdminSchema.find();
        if (!admins) {
            return res.status(404).json({ message: "No admins found" });
        }
        res.json(admins);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error getting admins" });
    }
};

// Create Admin
export const createAdmin = async (req: Request, res: Response) => {
    try {
        const { username, email, password, contactNumber, secretKey } =
            req.body;

        if (!username || !email || !password || !contactNumber || !secretKey) {
            return res
                .status(400)
                .json({ message: "Please fill in all fields" });
        }

        if (password.length < 6 || password.length > 15) {
            return res.status(400).json({
                message: "Password must be between 6 and 15 characters long",
            });
        }

        if (
            secretKey !== process.env.ADMIN_SECRET_KEY &&
            secretKey !== process.env.SUPER_ADMIN_SECRET_KEY
        ) {
            return res.status(400).json({ message: "Invalid secret key" });
        }

        const hasAdminEmail = await AdminSchema.findOne({ email });

        if (hasAdminEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const adminOnly = secretKey === process.env.ADMIN_SECRET_KEY;
        const isSuperAdmin = secretKey === process.env.SUPER_ADMIN_SECRET_KEY;

        //replace the first 0 with 63
        const formattedCpNumber = contactNumber.replace(/^0/, "63");

        const newAdmin = {
            username,
            email,
            password: hashedPassword,
            contactNumber: formattedCpNumber,
            superAdmin: adminOnly ? false : isSuperAdmin ? true : false,
        };

        const admin = await AdminSchema.create(newAdmin);

        return res.status(201).json({ message: "Admin created", admin });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error creating admin" });
    }
};

// Login Admin
export const loginAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Please fill in all fields" });
        }

        const admin = await AdminSchema.findOne({ email });

        if (!admin) {
            return res.status(400).json({ message: "Email not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            admin?.password as string
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET as string
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                contactNumber: admin.contactNumber,
                superAdmin: admin.superAdmin,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error logging in admin" });
    }
};

// Update Admin Password
export const updateAdminPassword = async (req: Request, res: Response) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res
                .status(400)
                .json({ message: "Please fill in all fields" });
        }

        if (newPassword.length < 6 || newPassword.length > 15) {
            return res.status(400).json({
                message: "Password must be between 6 and 15 characters long",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedAdmin = await AdminSchema.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        return res.status(200).json({ message: "Password updated" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error updating password" });
    }
};

//Delete Admin
export const deleteAdmin = async (req: Request, res: Response) => {
    try {
        const admin = await AdminSchema.findById(req.params.id);

        if (!admin) {
            return res.status(400).json({ message: "Admin not found" });
        }

        await admin.deleteOne();

        return res.status(200).json({ message: "Admin deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error deleting admin" });
    }
};

// Handler for initiating password reset and sending the code via SMS
export const initiatePasswordReset = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        // Find the admin by email
        const admin = await AdminSchema.findOne({ email });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Generate a reset password code
        const resetPasswordCode = generateCode();

        // Update the admin's resetPasswordCode in the database
        admin.set("resetPasswordCode", resetPasswordCode);
        await admin.save();

        const message = `Your reset password code is ${resetPasswordCode}`;

        await sendEmail(admin.email, "Reset Password Code", message);

        return res.status(200).json({
            message: "Reset password code generated and sent via gmail",
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "Error initiating password reset" });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, resetPasswordCode } = req.body;

        if (!email || !resetPasswordCode) {
            return res
                .status(400)
                .json({ message: "Please fill in all fields" });
        }

        const admin = await AdminSchema.findOne({ email });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (resetPasswordCode !== admin.resetPasswordCode) {
            return res.status(400).json({ message: "Invalid reset code" });
        }

        admin.set("resetPasswordCode", "");
        await admin.save();

        return res.status(200).json({ message: "Pass Code matched" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error resetting password" });
    }
};
