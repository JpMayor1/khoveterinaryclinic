import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cron from "node-cron";
import express from "express";
import mongoose from "mongoose";

import petRouter from "./routers/PetRouter";
import imageRouter from "./routers/ImageRouter";
import salesRouter from "./routers/SalesRouter";
import adminRouter from "./routers/AdminRouter";
import recordRouter from "./routers/RecordRouter";
import clientRouter from "./routers/ClientRouter";
import invoiceRouter from "./routers/InvoiceRouter";
import productRouter from "./routers/ProductRouter";
import appointmentRouter from "./routers/AppointmentRouter";
import { dailySalesFunc } from "./controllers/SalesController";
import {
    deleteAppointmentAfterFiveDays,
    notifyDoctorAndClient,
} from "./controllers/AppointmentController";

// Middlewares
dotenv.config();
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// Database
const MONGODB_URL = process.env.MONGODB_URL;

mongoose.set("strictQuery", true);
mongoose
    .connect(MONGODB_URL as string)
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.log("Error connecting to database", err);
    });

// Routes
app.get("/", (req, res) => {
    res.send("Server is running");
});
app.use(petRouter);
app.use(imageRouter);
app.use(adminRouter);
app.use(salesRouter);
app.use(clientRouter);
app.use(recordRouter);
app.use(invoiceRouter);
app.use(productRouter);
app.use(appointmentRouter);

// Cron Job
// schedule to update daily sales
cron.schedule(
    "55 23 * * *",
    () => {
        dailySalesFunc();
    },
    {
        timezone: "Asia/Manila",
    }
);

// schedule to delete appointment after 5 days
cron.schedule(
    "0 0 * * *",
    () => {
        deleteAppointmentAfterFiveDays();
    },
    {
        timezone: "Asia/Manila",
    }
);

// schedule to notify doctor and client
cron.schedule(
    "0 8 * * *",
    () => {
        notifyDoctorAndClient();
    },
    {
        timezone: "Asia/Manila",
    }
);

// Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log("Server on port", PORT);
});
