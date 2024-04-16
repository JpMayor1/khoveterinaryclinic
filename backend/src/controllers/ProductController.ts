import { Request, Response } from "express";
import { CategorySchema, ProductSchema } from "../models/ProductModel";
import { Types } from "mongoose";

// Get All Products
export const getProducts = async (req: Request, res: Response) => {
    try {
        const data = await ProductSchema.find();
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error getting products" });
    }
};

// Get Product by Name
export const getProductsByName = async (req: Request, res: Response) => {
    try {
        const name = req.params.name;

        // add regex to search for partial matches
        const regex = new RegExp(name, "i");

        const data = await ProductSchema.find({ name: regex });
        if (!data) return res.status(404).json({ error: "Product not found" });
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error getting products by name" });
    }
};

// Get One Product
export const getProduct = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        const data = await ProductSchema.findOne({ _id });
        if (!data) return res.status(404).json({ error: "Product not found" });
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error getting product" });
    }
};

// Get Products by Category
export const getProductsByCategory = async (req: Request, res: Response) => {
    try {
        const category = req.params.category;

        if (!category) {
            return res
                .status(400)
                .json({ error: "Category parameter is missing" });
        }

        const products = await ProductSchema.find({ category });

        if (!products || products.length === 0) {
            return res
                .status(404)
                .json({ message: "No products found for the given category" });
        }

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error getting products by category" });
    }
};

// Get All Categories
export const getCategories = async (req: Request, res: Response) => {
    try {
        const data = await CategorySchema.find();
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error getting categories" });
    }
};

// Create category
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Category name is required" });
        }

        const categoryExist = await CategorySchema.findOne({ name });

        if (categoryExist) {
            return res.status(400).json({ error: "Category already exists" });
        }

        const category = await CategorySchema.create({ name });

        return res
            .status(201)
            .json({ message: "Category created successfully", category });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating category" });
    }
};

// Create Products
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { category, name, price, stock, sold } = req.body;

        // Validate input types
        if (!category || !name || isNaN(price) || isNaN(stock) || isNaN(sold)) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        const nameExist = await ProductSchema.findOne({ name });

        if (nameExist) {
            return res.status(400).json({ error: "Product already exists" });
        }

        await ProductSchema.create({
            category,
            name,
            price,
            stock,
            sold,
        });

        return res
            .status(201)
            .json({ message: "Product created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating product" });
    }
};

// Update Product
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { name, price, stock } = req.body;

        if (!name || !price || !stock) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if the product name already exists with a different ID
        const nameExist = await ProductSchema.findOne({ name });
        if (nameExist && !nameExist._id.equals(new Types.ObjectId(id))) {
            return res.status(400).json({ error: "Product already exists" });
        }

        await ProductSchema.findByIdAndUpdate(id, {
            name,
            price,
            stock,
        });

        return res.status(201).json({ message: "Product updated" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error updating product" });
    }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        await CategorySchema.findByIdAndDelete(req.params.id);
        return res.status(201).json({ message: "Category deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error deleting category" });
    }
};

// Delete Product
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        await ProductSchema.findByIdAndDelete(req.params.id);
        return res.status(201).json({ message: "Product deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error deleting product" });
    }
};
