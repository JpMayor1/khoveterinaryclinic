import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema(
    {
        client: {
            _id: { type: String, required: true },
            name: { type: String, required: true },
            location: { type: String, required: true },
            cpNumber: { type: String, required: true },
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        pet: {
            _id: { type: String, required: true },
            name: { type: String, required: true },
            weight: { type: String, required: true },
            breed: { type: String, required: true },
            species: { type: String, required: true },
            gender: { type: String, required: true },
            age: { type: String, required: true },
        },
        purpose: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["PENDING", "ACCEPTED", "DECLINED"],
            default: "PENDING",
        },
        feedback: {
            type: String,
            default: "",
        },
        notified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const AppointmentSchema = mongoose.model(
    "Appointment",
    appointmentSchema
);
