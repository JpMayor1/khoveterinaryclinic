import express from "express";
import {
    createAdmin,
    deleteAdmin,
    getAdmins,
    initiatePasswordReset,
    loginAdmin,
    resetPassword,
    updateAdminPassword,
} from "../controllers/AdminController";

const adminRouter = express.Router();

adminRouter.get("/api/admins", getAdmins);
adminRouter.post("/api/register", createAdmin);
adminRouter.post("/api/login", loginAdmin);
adminRouter.post("/api/auth/forgot-password", initiatePasswordReset);
adminRouter.post("/api/auth/reset-password", resetPassword);
adminRouter.put("/api/auth/new-password", updateAdminPassword);
adminRouter.delete("/api/delete/:id", deleteAdmin);

export default adminRouter;
