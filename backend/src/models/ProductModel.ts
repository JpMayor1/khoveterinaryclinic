import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
    {
        name: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const productSchema = new Schema(
    {
        category: {
            type: String,
            required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        sold: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

export const CategorySchema = mongoose.model("Category", categorySchema);
export const ProductSchema = mongoose.model("Product", productSchema);
