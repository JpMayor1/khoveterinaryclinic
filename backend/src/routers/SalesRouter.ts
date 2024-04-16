import express from "express";
import {
    getDailySales,
    getFilteredDailySales,
} from "../controllers/SalesController";

const salesRouter = express.Router();
salesRouter.get("/api/sales", getDailySales);
salesRouter.post("/api/sales/filter", getFilteredDailySales);
export default salesRouter;
