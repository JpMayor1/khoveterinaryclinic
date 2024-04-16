import express from "express";
import {
    blockClient,
    createClient,
    deleteClient,
    getAllClients,
    getClientById,
    getClientByName,
    initiatePasswordReset,
    loginClient,
    resetPassword,
    unBlockClient,
    updateClient,
    updateClientPassword,
} from "../controllers/ClientController";

const clientRouter = express.Router();

clientRouter.get("/api/clients", getAllClients);
clientRouter.get("/api/clients/client/:id", getClientById);
clientRouter.get("/api/clients/:name", getClientByName);
clientRouter.post("/api/clients/create", createClient);
clientRouter.post("/api/clients/login", loginClient);
clientRouter.post("/api/clients/auth/forgot-password", initiatePasswordReset);
clientRouter.post("/api/clients/auth/reset-password", resetPassword);
clientRouter.put("/api/clients/auth/new-password", updateClientPassword);
clientRouter.put("/api/clients/update/:id", updateClient);
clientRouter.put("/api/clients/block/:id", blockClient);
clientRouter.put("/api/clients/unblock/:id", unBlockClient);
clientRouter.delete("/api/clients/delete/:id", deleteClient);

export default clientRouter;
