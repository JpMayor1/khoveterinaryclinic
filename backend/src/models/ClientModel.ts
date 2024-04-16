import mongoose, { Schema } from "mongoose";

const clientSchema = new Schema(
    {
        image: { type: String, required: false },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        location: { type: String, required: true },
        cpNumber: { type: String, required: true },
        pets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pet" }],
        balance: { type: Number },
        blocked: { type: Boolean, default: false },
        resetPasswordCode: { type: String },
    },
    {
        timestamps: true,
    }
);

export const ClientSchema = mongoose.model("Client", clientSchema);
