import { Request, Response } from "express";
import { InvoiceSchema } from "../models/InvoiceModel";
import { TotalSalesModel } from "../models/SalesModel";
import { ProductSchema } from "../models/ProductModel";

// Get All Invoices
export const getInvoices = async (req: Request, res: Response) => {
    try {
        const invoices = await InvoiceSchema.find();

        res.json(invoices);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error getting invoices" });
    }
};

// Get Invoice By ID
export const getInvoiceById = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        const invoice = await InvoiceSchema.findById(_id);

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        res.json(invoice);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error getting invoice" });
    }
};

export const getInvoicesByDate = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.body;

        // Parse the input dates in "MM/DD/YYYY" format
        const parsedStartDate = new Date(`${startDate} GMT-0800`);
        const parsedEndDate = new Date(`${endDate} GMT-0800`);

        const startDatePrevDay = new Date(parsedStartDate);
        startDatePrevDay.setDate(parsedStartDate.getDate() - 1);

        const filteredSales = await InvoiceSchema.find({
            date: { $gte: startDatePrevDay, $lte: parsedEndDate },
        });

        res.json(filteredSales);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching invoice data" });
    }
};

// Create Invoice
export const createInvoice = async (req: Request, res: Response) => {
    try {
        const { date, client, pet, services, products, total } = req.body;

        // Check if services and products are provided
        const servicesArray = services ? services : [];
        const productsArray = products ? products : [];

        await InvoiceSchema.create({
            date,
            client,
            pet,
            services: servicesArray,
            products: productsArray,
            total,
        });

        const previousTotal = await TotalSalesModel.find();

        if (!previousTotal || previousTotal.length === 0) {
            await TotalSalesModel.create({
                total: total,
            });
        } else {
            const newTotal = previousTotal[0].total + total;

            await TotalSalesModel.findByIdAndUpdate(previousTotal[0]._id, {
                total: newTotal,
            });
        }

        // Update product stock and sold quantity
        for (const product of productsArray) {
            const existingProduct = await ProductSchema.findOne({
                name: product.name,
            });
            if (existingProduct) {
                existingProduct.stock -= product.quantity;
                existingProduct.sold += product.quantity;
                await existingProduct.save();
            }
        }

        return res.status(201).json({ message: "Invoice created" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error creating invoice" });
    }
};

// Delete Invoice
export const deleteInvoice = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        const deletedInvoice = await InvoiceSchema.findByIdAndDelete(_id);

        if (!deletedInvoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        res.json({ message: "Invoice deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error deleting invoice" });
    }
};
