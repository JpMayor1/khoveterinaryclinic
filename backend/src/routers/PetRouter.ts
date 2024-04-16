import express from "express";
import {
    createPet,
    deletePet,
    getAllPets,
    getPetById,
    getPetByName,
    updatePet,
} from "../controllers/PetController";

const petRouter = express.Router();

petRouter.get("/api/pets", getAllPets);
petRouter.get("/api/pets/:id", getPetById);
petRouter.get("/api/pets/search/:name", getPetByName);
petRouter.post("/api/pets/create", createPet);
petRouter.put("/api/pets/update/:id", updatePet);
petRouter.delete("/api/pets/delete/:id", deletePet);

export default petRouter;
