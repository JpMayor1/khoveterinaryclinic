import mongoose, { Schema } from "mongoose";

const serviceSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});

const invoiceSchema = new Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        client: {
            type: String,
            required: true,
        },
        pet: {
            type: String,
            required: true,
        },
        services: [serviceSchema],
        products: [productSchema],
        total: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const InvoiceSchema = mongoose.model("Invoice", invoiceSchema);
