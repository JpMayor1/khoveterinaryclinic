import express from "express";
import {
    createInvoice,
    getInvoices,
    getInvoiceById,
    deleteInvoice,
    getInvoicesByDate,
} from "../controllers/InvoiceController";

const invoiceRouter = express.Router();

invoiceRouter.get("/api/invoice", getInvoices);
invoiceRouter.get("/api/invoice/:id", getInvoiceById);
invoiceRouter.post("/api/invoice/filterdate", getInvoicesByDate);
invoiceRouter.post("/api/invoice/create", createInvoice);
invoiceRouter.delete("/api/invoice/delete/:id", deleteInvoice);

export default invoiceRouter;
