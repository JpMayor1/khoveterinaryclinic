import mongoose from "mongoose";
import { Request, Response } from "express";
import { PetSchema } from "../models/PetModel";
import { ClientSchema } from "../models/ClientModel";
import { RecordSchema } from "../models/RecordModel";

// Get All Pets
export const getAllPets = async (req: Request, res: Response) => {
    try {
        const pets = await PetSchema.find().populate("clientId");
        if (!pets) {
            return res.status(404).json({ message: "No pets found" });
        }
        res.json(pets);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error getting all pets" });
    }
};

// Get Pet By ID
export const getPetById = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        const pet = await PetSchema.findById(_id).populate("clientId");
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }
        res.json(pet);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error getting pet" });
    }
};

// Get Pet By Name
export const getPetByName = async (req: Request, res: Response) => {
    try {
        const name = req.params.name;

        // add regex to search for partial matches
        const regex = new RegExp(name, "i");

        const data = await PetSchema.find({ name: regex }).populate("clientId");
        if (!data) return res.status(404).json({ error: "Pet not found" });
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error getting pets by name" });
    }
};

// Create Pet
export const createPet = async (req: Request, res: Response) => {
    try {
        const {
            clientId,
            image,
            name,
            weight,
            breed,
            species,
            gender,
            age,
            birthdate,
            color,
        } = req.body;

        if (
            !clientId ||
            !name ||
            !weight ||
            !breed ||
            !species ||
            !gender ||
            !age ||
            !color
        ) {
            return res
                .status(400)
                .json({ message: "Please fill in all fields" });
        }

        const client = await ClientSchema.findById(clientId);

        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        const newPet = {
            clientId,
            image,
            name,
            weight,
            breed,
            species,
            gender,
            age,
            birthdate,
            color,
        };

        const pet = await PetSchema.create(newPet);

        client.pets.push(pet._id);
        await client.save();

        const clientRecord = {
            name: client.name,
            email: client.email,
            contactNumber: client.cpNumber,
            address: client.location,
        };

        const petRecord = {
            id: pet._id,
            name: pet.name,
            species: pet.species,
            breed: pet.breed,
            birthdate: pet.birthdate,
            gender: pet.gender,
            color: pet.color,
            age: pet.age,
        };

        const newRecord = new RecordSchema({
            client: clientRecord,
            pet: petRecord,
        });

        await newRecord.save();

        await pet.updateOne({ recordId: newRecord._id });

        res.status(201).json({ message: "Pet created", pet });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error creating pet" });
    }
};

// Update Pet
export const updatePet = async (req: Request, res: Response) => {
    try {
        const {
            clientId,
            image,
            name,
            weight,
            breed,
            species,
            gender,
            age,
            birthdate,
            color,
        } = req.body;

        if (
            !clientId ||
            !name ||
            !weight ||
            !breed ||
            !species ||
            !gender ||
            !age ||
            !color
        ) {
            return res
                .status(400)
                .json({ message: "Please fill in all fields" });
        }

        // Find the new client
        const newClient = await ClientSchema.findById(clientId);
        if (!newClient) {
            return res.status(404).json({ message: "Client not found" });
        }

        // Find the current pet to be updated
        const pet = await PetSchema.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        const prevOwnerId = pet.clientId?.toString();
        const newOwnerId = clientId;

        // Create a transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            if (prevOwnerId === newOwnerId) {
                // Update the pet if the owner is the same
                const updatedPet = await PetSchema.findByIdAndUpdate(
                    req.params.id,
                    {
                        image,
                        name,
                        weight,
                        breed,
                        species,
                        gender,
                        age,
                        birthdate,
                        color,
                    },
                    { new: true }
                ).populate("clientId");
                res.status(200).json({ message: "Pet updated", updatedPet });
            } else {
                // Transfer ownership

                // Remove the pet from the previous owner's pets array
                await ClientSchema.updateOne(
                    { _id: prevOwnerId },
                    { $pull: { pets: pet._id } }
                );

                // Add the pet to the new owner's pets array
                newClient.pets.push(pet._id);
                await newClient.save();

                // Update the pet's owner to the new client
                pet.clientId = clientId;
                await pet.save();

                // Commit the transaction
                await session.commitTransaction();
                session.endSession();

                const updatedPet = await PetSchema.findByIdAndUpdate(
                    req.params.id,
                    {
                        image,
                        name,
                        weight,
                        breed,
                        species,
                        gender,
                        age,
                        birthdate,
                        color,
                    },
                    { new: true }
                ).populate("clientId");

                const updatedPetRecord = {
                    name,
                    weight,
                    breed,
                    species,
                    gender,
                    age,
                    birthdate,
                    color,
                };

                // Update associated records
                await RecordSchema.updateMany(
                    { "pet.name": pet.name }, // Update records where pet's name matches
                    { $set: { pet: updatedPetRecord } } // Set the new client information in the records
                );

                res.status(200).json({ message: "Pet updated", updatedPet });
            }
        } catch (error) {
            // Roll back the transaction in case of an error
            await session.abortTransaction();
            session.endSession();

            console.log(error);
            res.status(500).json({ error: "Error updating pet" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error updating pet" });
    }
};

// Delete Pet
export const deletePet = async (req: Request, res: Response) => {
    try {
        const pet = await PetSchema.findById(req.params.id);

        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        // Find the owner of the pet and populate the 'pets' field
        const owner = await ClientSchema.findOne({ pets: pet._id }).populate(
            "pets"
        );

        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        // Remove the pet from the owner's pets array
        owner.pets = owner.pets.filter(
            (p) => p._id.toString() !== pet._id.toString()
        );
        await owner.save();

        // Delete the pet
        await pet.deleteOne();

        res.status(200).json({ message: "Pet deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error deleting pet" });
    }
};
