import mongoose, { Schema } from "mongoose";

const totalSaleSchema = new Schema(
    {
        total: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const dailySalesSchema = new Schema(
    {
        date: { type: Date, required: true },
        dailySales: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const TotalSalesModel = mongoose.model("TotalSale", totalSaleSchema);
export const DailySalesModel = mongoose.model("DailySales", dailySalesSchema);
