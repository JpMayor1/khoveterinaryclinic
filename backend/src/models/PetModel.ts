import mongoose, { Schema } from "mongoose";

const petSchema = new Schema(
    {
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
        image: { type: String, required: false },
        name: { type: String, required: true },
        weight: { type: String, required: true },
        breed: { type: String, required: true },
        species: { type: String, required: true },
        gender: { type: String, required: true },
        age: { type: String, required: true },
        birthdate: { type: String, required: false },
        color: { type: String, required: true },
        recordId: { type: String, required: false },
    },
    {
        timestamps: true,
    }
);

export const PetSchema = mongoose.model("Pet", petSchema);
