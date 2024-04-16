import express from "express";

import {
    getAllRecords,
    getOneRecord,
    createRecord,
    addTableToRecord,
    deleteRecord,
    getOneRecordByPetName,
    getOneRecordByPetId,
} from "../controllers/RecordController";

const recordRouter = express.Router();

recordRouter.get("/api/records", getAllRecords);
recordRouter.get("/api/records/:id", getOneRecord);
recordRouter.get("/api/records/pet/:id", getOneRecordByPetId);
recordRouter.get("/api/records/search/:name", getOneRecordByPetName);
recordRouter.post("/api/records/create", createRecord);
recordRouter.post("/api/records/table/:id", addTableToRecord);
recordRouter.delete("/api/records/delete/:id", deleteRecord);

export default recordRouter;
