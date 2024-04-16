import { Request, Response } from "express";
import { RecordSchema } from "../models/RecordModel";
import { PetSchema } from "../models/PetModel";

//Get All Records
export const getAllRecords = async (req: Request, res: Response) => {
    try {
        const records = await RecordSchema.find();

        res.status(200).json(records);
    } catch (error) {
        console.log(error);
        res.status(500).json("Internal Server Error");
    }
};

//Get One Record by id
export const getOneRecord = async (req: Request, res: Response) => {
    try {
        const record = await RecordSchema.findById(req.params.id);

        res.status(200).json(record);
    } catch (error) {
        console.log(error);
        res.status(500).json("Internal Server Error");
    }
};

//Get One Record by Pet id
export const getOneRecordByPetId = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const data = await RecordSchema.find({ "pet.id": id });

        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json("Internal Server Error");
    }
};

//Get One Record by Pet name
export const getOneRecordByPetName = async (req: Request, res: Response) => {
    try {
        const name = req.params.name;

        // add regex to search for partial matches
        const regex = new RegExp(name, "i");

        const data = await RecordSchema.find({ "pet.name": regex });

        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json("Internal Server Error");
    }
};

//Create Record
export const createRecord = async (req: Request, res: Response) => {
    try {
        const { client, pet } = req.body;

        if (!client || !pet) {
            return res.status(400).json({ message: "Please provide data" });
        }

        // check if pet already has a record
        const existpetRecord = await RecordSchema.findById(pet.recordId);

        if (existpetRecord) {
            return res
                .status(400)
                .json({ message: "Pet already has a record" });
        }

        const newRecord = new RecordSchema({
            client,
            pet,
        });

        await newRecord.save();

        await PetSchema.findByIdAndUpdate(pet.id, {
            recordId: newRecord._id,
        });

        res.status(200).json({
            message: "Record created successfully",
            newRecord,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Add a new table to an existing record
export const addTableToRecord = async (req: Request, res: Response) => {
    try {
        const { table } = req.body;
        const recordId = req.params.id;

        if (!recordId || !table) {
            return res
                .status(400)
                .json("Please provide recordId and table data");
        }

        const record = await RecordSchema.findById(recordId);

        if (!record) {
            return res.status(404).json("Record not found");
        }

        record.tables.push(table);

        await record.save();

        res.status(200).json({ message: "Record added successfully", record });
    } catch (error) {
        console.log(error);
        res.status(500).json("Internal Server Error");
    }
};

//Delete Record
export const deleteRecord = async (req: Request, res: Response) => {
    try {
        await PetSchema.findOneAndUpdate(
            { recordId: req.params.id },
            { recordId: null }
        );
        await RecordSchema.findByIdAndDelete(req.params.id);

        res.status(200).json("Record Deleted Successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json("Internal Server Error");
    }
};
