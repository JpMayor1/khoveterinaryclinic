import express from "express";
import {
    getProducts,
    getProductsByName,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    createCategory,
    getCategories,
    deleteCategory,
} from "../controllers/ProductController";

const productRouter = express.Router();

productRouter.get("/api/products", getProducts);
productRouter.get("/api/products/:name", getProductsByName);
productRouter.get("/api/products/productId/:id", getProduct);
productRouter.get("/api/products/category/:category", getProductsByCategory);
productRouter.get("/api/categories", getCategories);
productRouter.post("/api/category/create", createCategory);
productRouter.post("/api/products/create", createProduct);
productRouter.put("/api/products/update/:id", updateProduct);
productRouter.delete("/api/category/delete/:id", deleteCategory);
productRouter.delete("/api/products/delete/:id", deleteProduct);

export default productRouter;
