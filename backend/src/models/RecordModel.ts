import mongoose, { Schema } from "mongoose";

const TableSchema = new Schema(
    {
        date: { type: Date, required: true },
        temp: { type: String, required: true },
        weight: { type: String, required: true },
        history: { type: String, required: false },
        diagnosis: { type: String, required: true },
        treatment: { type: String, required: true },
        followUp: { type: Date, required: true },
    },
    { _id: false }
);

const recordSchema = new Schema(
    {
        client: {
            name: String,
            email: String,
            contactNumber: String,
            address: String,
        },

        pet: {
            id: String,
            name: String,
            species: String,
            breed: String,
            birthdate: Date || String,
            gender: String,
            color: String,
            age: String,
        },

        tables: [TableSchema],
    },
    {
        timestamps: true,
    }
);

export const RecordSchema = mongoose.model("Record", recordSchema);
