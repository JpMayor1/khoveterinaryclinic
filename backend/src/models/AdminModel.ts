import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        contactNumber: { type: String, required: true },
        superAdmin: { type: Boolean, required: true, default: false },
        resetPasswordCode: { type: String },
    },
    {
        timestamps: true,
    }
);

export const AdminSchema = mongoose.model("Admin", adminSchema);
