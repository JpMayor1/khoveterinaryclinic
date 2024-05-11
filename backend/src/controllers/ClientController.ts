import { PetSchema } from "../models/PetModel";
import { ClientSchema } from "../models/ClientModel";
import { RecordSchema } from "../models/RecordModel";
import { generateCode } from "../utils/generateCode";
import { Request, Response } from "express";
import sendEmail from "../utils/sendEmail";
import bcrypt from "bcrypt";

// Get All Clients
export const getAllClients = async (req: Request, res: Response) => {
    try {
        const clients = await ClientSchema.find();
        if (!clients) {
            return res.status(404).json({ message: "No clients found" });
        }
        res.json(clients);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error getting all clients" });
    }
};

// Get Client By ID
export const getClientById = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        const client = await ClientSchema.findOne({ _id }).populate("pets");
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }
        res.json(client);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error getting client" });
    }
};

// Get Client By Name
export const getClientByName = async (req: Request, res: Response) => {
    try {
        const name = req.params.name;

        // add regex to search for partial matches
        const regex = new RegExp(name, "i");

        const data = await ClientSchema.find({ name: regex });
        if (!data) return res.status(404).json({ error: "Client not found" });
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error getting clients by name" });
    }
};

// Create Client
export const createClient = async (req: Request, res: Response) => {
    try {
        const { name, email, password, location, cpNumber, image, balance } =
            req.body;

        if (!name || !email || !password || !location || !cpNumber) {
            return res
                .status(400)
                .json({ message: "Please fill in all fields" });
        }

        if (cpNumber.length !== 11) {
            return res
                .status(400)
                .json({ message: "Invalid cellphone number" });
        }

        //replace the first 0 with 63
        const formattedCpNumber = cpNumber.replace(/^0/, "63");

        const hasClientEmail = await ClientSchema.findOne({ email });

        if (hasClientEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        if (password.length < 6 || password.length > 15) {
            return res.status(400).json({
                message: "Password must be between 6 and 15 characters long",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newClient = {
            image,
            name,
            email,
            password: hashedPassword,
            location,
            cpNumber: formattedCpNumber,
            balance: balance || 0,
            blocked: false,
        };

        const client = await ClientSchema.create(newClient);

        return res.status(201).json({ message: "Account created", client });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error creating account" });
    }
};

// Login Client
export const loginClient = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Please fill in all fields" });
        }

        const client = await ClientSchema.findOne({ email }).populate("pets");

        if (!client) {
            return res.status(400).json({ message: "Account does not exist" });
        }

        if (client.blocked) {
            return res.status(403).json({ message: "Account is blocked" });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            client.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        return res.status(200).json({ message: "Account logged in", client });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error logging in account" });
    }
};

// Handler for initiating password reset and sending the code via SMS
export const initiatePasswordReset = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        // Find the client by email
        const client = await ClientSchema.findOne({ email });

        if (!client) {
            return res.status(404).json({ message: "Account not found" });
        }

        // Generate a reset password code
        const resetPasswordCode = generateCode();

        // Update the admin's resetPasswordCode in the database
        client.set("resetPasswordCode", resetPasswordCode);
        await client.save();

        const message = `Your reset password code is ${resetPasswordCode}`;

        await sendEmail(client.email, "Reset Password Code", message);

        return res.status(200).json({
            message: "Reset password code generated and sent via gmail",
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "Error initiating password reset" });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, resetPasswordCode } = req.body;

        if (!email || !resetPasswordCode) {
            return res
                .status(400)
                .json({ message: "Please fill in all fields" });
        }

        const client = await ClientSchema.findOne({ email });

        if (!client) {
            return res.status(404).json({ message: "Account not found" });
        }

        if (resetPasswordCode !== client.resetPasswordCode) {
            return res.status(400).json({ message: "Invalid reset code" });
        }

        client.set("resetPasswordCode", "");
        await client.save();

        return res.status(200).json({ message: "Pass Code matched" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error resetting password" });
    }
};

// Update Client Password
export const updateClientPassword = async (req: Request, res: Response) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res
                .status(400)
                .json({ message: "Please fill in all fields" });
        }

        if (newPassword.length < 6 || newPassword.length > 15) {
            return res.status(400).json({
                message: "Password must be between 6 and 15 characters long",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedClient = await ClientSchema.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedClient) {
            return res.status(404).json({ message: "Account not found" });
        }

        return res.status(200).json({ message: "Password updated" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error updating password" });
    }
};

// Update Client
export const updateClient = async (req: Request, res: Response) => {
    try {
        const { name, email, location, cpNumber, image, balance } = req.body;

        if (!name || !email || !location || !cpNumber) {
            return res
                .status(400)
                .json({ message: "Please fill in all fields" });
        }

        const client = await ClientSchema.findById(req.params.id);

        if (!client) {
            return res.status(404).json({ message: "Account not found" });
        }

        const clientExist = await ClientSchema.findOne({ email });

        if (clientExist && clientExist._id.toString() !== req.params.id) {
            return res.status(400).json({ message: "Email already exists" });
        }

        if (cpNumber.length !== 11) {
            return res
                .status(400)
                .json({ message: "Invalid cellphone number" });
        }

        //replace the first 0 with 63
        const formattedCpNumber = cpNumber.replace(/^0/, "63");

        const updatedClient = {
            image,
            name,
            email,
            location,
            cpNumber: formattedCpNumber,
            balance: balance === 0 ? 0 : balance || client.balance,
        };

        const updated = await ClientSchema.findByIdAndUpdate(
            req.params.id,
            updatedClient,
            { new: true }
        ).populate("pets");

        const updatedClientRecord = {
            name,
            email,
            address: location,
            contactNumber: formattedCpNumber,
        };

        // Update associated records
        await RecordSchema.updateMany(
            { "client.email": client.email }, // Update records where client's email matches
            { $set: { client: updatedClientRecord } } // Set the new client information in the records
        );

        return res.status(200).json({ message: "Account updated", updated });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error updating account" });
    }
};

export const blockClient = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Missing client ID" });
        }

        const blockedClient = await ClientSchema.findByIdAndUpdate(
            { _id: id },
            {
                blocked: true,
            },
            { new: true }
        ).populate("pets");

        if (!blockedClient) {
            return res.status(404).json({ error: "Client not found" });
        }

        return res
            .status(200)
            .json({ message: "Account blocked", blockedClient });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error blocking account" });
    }
};

export const unBlockClient = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Missing client ID" });
        }

        const unBlockedClient = await ClientSchema.findByIdAndUpdate(
            { _id: id },
            {
                blocked: false,
            },
            { new: true }
        ).populate("pets");

        if (!unBlockedClient) {
            return res.status(404).json({ error: "Client not found" });
        }

        return res
            .status(200)
            .json({ message: "Account unblocked", unBlockedClient });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error unblocking account" });
    }
};

// Delete Client
export const deleteClient = async (req: Request, res: Response) => {
    try {
        const clientId = req.params.id;

        // Step 1: Get the client
        const client = await ClientSchema.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: "Account not found" });
        }

        const defaultName = "No owner";
        const petIds = client.pets.map((pet) => pet._id);

        if (petIds.length === 0) {
            await ClientSchema.findByIdAndDelete(clientId);
            return res.status(200).json({ message: "Account deleted" });
        }

        const defaultClient = await ClientSchema.findOne({ name: defaultName });
        if (defaultClient) {
            defaultClient.pets.push(...petIds);
            await defaultClient.save();

            await PetSchema.updateMany(
                { clientId },
                { clientId: defaultClient._id }
            );

            await ClientSchema.findByIdAndDelete(clientId);
            return res.status(200).json({ message: "Account deleted" });
        }

        await PetSchema.deleteMany({ _id: { $in: petIds } });
        await ClientSchema.findByIdAndDelete(clientId);
        return res.status(200).json({ message: "Account deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error deleting account" });
    }
};
