import { Request, Response } from "express";
import { DailySalesModel, TotalSalesModel } from "../models/SalesModel";

export const dailySalesFunc = async () => {
    try {
        const total = await TotalSalesModel.find();
        const date = new Date();
        const dailySales = await DailySalesModel.create({
            date,
            dailySales: total[0].total,
        });

        if (!dailySales) {
            console.log("Error creating daily sales record");
            return;
        }

        await TotalSalesModel.findByIdAndUpdate(total[0]._id, {
            total: 0,
        });

        console.log("Daily sales record created: " + dailySales);
    } catch (error) {
        console.log(error);
    }
};

// get daily sales
export const getDailySales = async (req: Request, res: Response) => {
    try {
        const dailySales = await DailySalesModel.find();
        res.json(dailySales);
    } catch (error) {
        console.log(error);
    }
};

export const getFilteredDailySales = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.body;

        // Parse the input dates in "MM/DD/YYYY" format
        const parsedStartDate = new Date(`${startDate} GMT-0800`);
        const parsedEndDate = new Date(`${endDate} GMT-0800`);

        // Set the time part of the dates to ensure consistency
        parsedStartDate.setHours(0, 0, 0, 0);
        parsedEndDate.setHours(23, 59, 59, 999);

        const filteredSales = await DailySalesModel.find({
            date: { $gte: parsedStartDate, $lte: parsedEndDate },
        });

        res.json(filteredSales);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const generateSalesData = async () => {
    try {
        const sampleData = [
            { date: new Date("01/05/2024"), dailySales: 1000.00 },
            { date: new Date("01/06/2024"), dailySales: 1500.00 },
            { date: new Date("01/07/2024"), dailySales: 1200.00 },
            { date: new Date("01/08/2024"), dailySales: 2000.00 },
            { date: new Date("01/09/2024"), dailySales: 800.00 },
            { date: new Date("01/10/2024"), dailySales: 2500.00 },
            { date: new Date("01/11/2024"), dailySales: 1700.00 },
            { date: new Date("01/12/2024"), dailySales: 1300.00 },
            { date: new Date("01/13/2024"), dailySales: 900.00 },
            { date: new Date("01/14/2024"), dailySales: 1800.00 },
            { date: new Date("01/15/2024"), dailySales: 1600.00 },
            { date: new Date("01/16/2024"), dailySales: 1200.00 },
            { date: new Date("01/17/2024"), dailySales: 2200.00 },
            { date: new Date("01/18/2024"), dailySales: 1900.00 },
            { date: new Date("01/19/2024"), dailySales: 1100.00 },
            { date: new Date("01/20/2024"), dailySales: 2700.00 },
            { date: new Date("01/21/2024"), dailySales: 1400.00 },
            { date: new Date("01/22/2024"), dailySales: 1000.00 },
            { date: new Date("01/23/2024"), dailySales: 2300.00 },
            { date: new Date("01/24/2024"), dailySales: 2000.00 },
            { date: new Date("01/25/2024"), dailySales: 1200.00 },
            { date: new Date("01/26/2024"), dailySales: 1600.00 },
            { date: new Date("01/27/2024"), dailySales: 1800.00 },
            { date: new Date("01/28/2024"), dailySales: 900.00 },
            { date: new Date("01/29/2024"), dailySales: 2500.00 },
            { date: new Date("01/30/2024"), dailySales: 1300.00 },
            { date: new Date("02/01/2024"), dailySales: 1400.00 },
            { date: new Date("02/02/2024"), dailySales: 1800.00 },
            { date: new Date("02/03/2024"), dailySales: 2000.00 },
            { date: new Date("02/04/2024"), dailySales: 1100.00 },
            // Add more entries as needed
        ];
        
        await DailySalesModel.insertMany(sampleData);

        console.log("Sample data generated successfully");
    } catch (error) {
        console.error("Error generating sample data:", error);
    }
};
