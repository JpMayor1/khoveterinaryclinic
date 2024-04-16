import { Request, Response } from "express";
import { AppointmentSchema } from "../models/AppointmentModel";
import { ClientSchema } from "../models/ClientModel";
import { PetSchema } from "../models/PetModel";
import { RequestOptions } from "http";
import https from "https";
require("dotenv").config();

// Get All Appointments
export const getAllAppointments = async (req: Request, res: Response) => {
    try {
        const appointments = await AppointmentSchema.find();
        if (!appointments) {
            return res.status(404).json({ message: "No appointments found" });
        }
        res.json(appointments);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            error: `Error getting all appointments: ${error.message}`,
        });
    }
};

// Get Appointment By ID
export const getAppointmentById = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        const appointment = await AppointmentSchema.findById(_id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.json(appointment);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            error: `Error getting appointment: ${error.message}`,
        });
    }
};

// Get Appointments By Client ID
export const getAppointmentsByClientId = async (
    req: Request,
    res: Response
) => {
    try {
        const clientId = req.params.id;
        const appointments = await AppointmentSchema.find({
            "client._id": clientId,
        });
        if (!appointments) {
            return res.status(404).json({ message: "No appointments found" });
        }
        res.json(appointments);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            error: `Error getting appointment: ${error.message}`,
        });
    }
};

// Get Appointments By Date
export const getAppointmentsByDate = async (req: Request, res: Response) => {
    try {
        const date = req.params.date;
        const appointments = await AppointmentSchema.find({ date });
        if (!appointments) {
            return res.status(404).json({ message: "No appointments found" });
        }
        res.json(appointments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error getting appointments" });
    }
};

// Create Appointment
export const createAppointment = async (req: Request, res: Response) => {
    try {
        const { clientId, petId, date, time, purpose } = req.body;

        if (!clientId || !petId || !date || !time || !purpose) {
            return res
                .status(400)
                .json({ message: "Please fill in all fields" });
        }

        const client = await ClientSchema.findById(clientId);
        const pet = await PetSchema.findById(petId);

        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        // Validate if the pet belongs to the specified client
        if (client.pets?.indexOf(petId) === -1) {
            return res
                .status(400)
                .json({ message: "Pet does not belong to the client" });
        }

        const appointment = new AppointmentSchema({
            client: {
                _id: client._id,
                name: client.name,
                location: client.location,
                cpNumber: client.cpNumber,
            },
            pet: {
                _id: pet._id,
                name: pet.name,
                weight: pet.weight,
                breed: pet.breed,
                species: pet.species,
                gender: pet.gender,
                age: pet.age,
            },
            date,
            time,
            purpose,
        });

        await appointment.save();

        const formattedDate = new Date(appointment.date).toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
            }
        );

        // Notify Dr. Mark
        const message = `Hello Dr. Mark, you have a new appointment scheduled on ${formattedDate} at ${time}. Client: ${client.name}, Pet: ${pet.name}, Purpose: ${purpose}`;

        const postData = JSON.stringify({
            messages: [
                {
                    destinations: [{ to: process.env.DEFAULT_PHONE_NUMBER }],
                    from: process.env.SENDER_NAME,
                    text: message,
                },
            ],
        });

        const options: RequestOptions = {
            method: "POST",
            hostname: process.env.INFOBIP_HOST_NAME,
            path: process.env.INFOBIP_PATH,
            headers: {
                Authorization: `App ${process.env.INFOBIP_API_KEY}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };

        const reqInfobip = https.request(options, (infobipRes) => {
            let chunks: Uint8Array[] = [];

            infobipRes.on("data", (chunk) => {
                chunks.push(chunk);
            });

            infobipRes.on("end", () => {
                const body = Buffer.concat(chunks);
                console.log(body.toString());
            });

            infobipRes.on("error", (error) => {
                console.error(error);
            });
        });

        reqInfobip.write(postData);
        reqInfobip.end();

        res.status(201).json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating appointment" });
    }
};

// Add Feedback
export const addFeedback = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        const { feedback } = req.body;

        if (!feedback) {
            return res
                .status(400)
                .json({ message: "Please fill in all fields" });
        }

        const appointment = await AppointmentSchema.findByIdAndUpdate(
            _id,
            {
                feedback,
            },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.status(200).json(appointment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error adding feedback" });
    }
};

// Update Appointment
export const updateAppointment = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        const { status } = req.body;

        if (!status) {
            return res
                .status(400)
                .json({ message: "Please fill in all fields" });
        }

        const appointment = await AppointmentSchema.findByIdAndUpdate(
            _id,
            {
                status,
            },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.status(200).json(appointment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error updating appointment" });
    }
};

// Update Appointment by Client
export const updateAppointmentByClient = async (
    req: Request,
    res: Response
) => {
    try {
        const _id = req.params.id;
        const { pet, time, date, purpose } = req.body;

        if (!pet || !time || !date || !purpose) {
            return res
                .status(400)
                .json({ message: "Please fill in all fields" });
        }

        const hasAppointment = await AppointmentSchema.findOne({
            date,
            time,
        });

        if (hasAppointment) {
            return res
                .status(400)
                .json({ message: "Date and Time Already Occupied" });
        }

        const hasPet = await PetSchema.findById(pet);

        if (!hasPet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        const newPet = {
            _id: hasPet._id,
            name: hasPet.name,
            weight: hasPet.weight,
            breed: hasPet.breed,
            species: hasPet.species,
            gender: hasPet.gender,
            age: hasPet.age,
        };

        const appointment = await AppointmentSchema.findByIdAndUpdate(
            _id,
            {
                pet: newPet,
                time,
                date,
                purpose,
                status: "PENDING",
                notified: false,
            },
            { new: true }
        );

        if (!appointment) {
            return res
                .status(404)
                .json({ message: "Something went wrong, try again!" });
        }

        const formattedDate = new Date(appointment.date).toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
            }
        );

        // Notify Dr. Mark
        const message = `Hello Dr. Mark, an appointment has been updated, scheduled on ${formattedDate} at ${appointment.time}. Client: ${appointment.client?.name}, Pet: ${appointment.pet?.name}, Purpose: ${appointment.purpose}`;

        const postData = JSON.stringify({
            messages: [
                {
                    destinations: [{ to: process.env.DEFAULT_PHONE_NUMBER }],
                    from: process.env.SENDER_NAME,
                    text: message,
                },
            ],
        });

        const options: RequestOptions = {
            method: "POST",
            hostname: process.env.INFOBIP_HOST_NAME,
            path: process.env.INFOBIP_PATH,
            headers: {
                Authorization: `App ${process.env.INFOBIP_API_KEY}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };

        const reqInfobip = https.request(options, (infobipRes) => {
            let chunks: Uint8Array[] = [];

            infobipRes.on("data", (chunk) => {
                chunks.push(chunk);
            });

            infobipRes.on("end", () => {
                const body = Buffer.concat(chunks);
                console.log(body.toString());
            });

            infobipRes.on("error", (error) => {
                console.error(error);
            });
        });

        reqInfobip.write(postData);
        reqInfobip.end();

        res.status(200).json(appointment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error updating appointment" });
    }
};

// Cancel Appointment
export const cancelAppointment = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        const appointment = await AppointmentSchema.findByIdAndDelete(_id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        const formattedDate = new Date(appointment.date).toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
            }
        );

        // Notify Dr. Mark
        const message = `Hello Dr. Mark, an appointment has been cancelled, scheduled on ${formattedDate} at ${appointment.time}. Client: ${appointment.client?.name}, Pet: ${appointment.pet?.name}, Purpose: ${appointment.purpose}`;

        const postData = JSON.stringify({
            messages: [
                {
                    destinations: [{ to: process.env.DEFAULT_PHONE_NUMBER }],
                    from: process.env.SENDER_NAME,
                    text: message,
                },
            ],
        });

        const options: RequestOptions = {
            method: "POST",
            hostname: process.env.INFOBIP_HOST_NAME,
            path: process.env.INFOBIP_PATH,
            headers: {
                Authorization: `App ${process.env.INFOBIP_API_KEY}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };

        const reqInfobip = https.request(options, (infobipRes) => {
            let chunks: Uint8Array[] = [];

            infobipRes.on("data", (chunk) => {
                chunks.push(chunk);
            });

            infobipRes.on("end", () => {
                const body = Buffer.concat(chunks);
                console.log(body.toString());
            });

            infobipRes.on("error", (error) => {
                console.error(error);
            });
        });

        reqInfobip.write(postData);
        reqInfobip.end();

        res.json({ message: "Appointment Cancelled" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error deleting appointment" });
    }
};

// Delete Appointment
export const deleteAppointment = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        const appointment = await AppointmentSchema.findByIdAndDelete(_id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.json({ message: "Appointment deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error deleting appointment" });
    }
};

// Delete Appointment after 5 days
export const deleteAppointmentAfterFiveDays = async () => {
    try {
        const today = new Date();
        const fiveDaysAgo = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 5
        );
        const appointments = await AppointmentSchema.find({
            createdAt: { $lte: fiveDaysAgo },
        });
        if (!appointments) {
            return;
        }
        appointments.forEach(async (appointment) => {
            await AppointmentSchema.findByIdAndDelete(appointment._id);
        });

        console.log("Deleted appointments");
    } catch (error) {
        console.log(error);
    }
};

// Function to notify doctor and client about the appointment
export const notifyDoctorAndClient = async () => {
    try {
        // Get the appointments scheduled for tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate());
        const appointments = await AppointmentSchema.find({
            date: {
                $gte: tomorrow,
                $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
            },
            notified: false,
        });

        // Notify doctor and client for each appointment
        for (const appointment of appointments) {
            // Check if appointment, client, and pet are defined
            if (appointment && appointment.client && appointment.pet) {
                // Notify the doctor
                const doctorMessage = `Hello Dr. Mark, you have appointment scheduled on ${appointment.date.toLocaleDateString(
                    "en-US"
                )} at ${appointment.time}. Client: ${
                    appointment.client.name
                }, Pet: ${appointment.pet.name}, Purpose: ${
                    appointment.purpose
                }`;

                const postData = JSON.stringify({
                    messages: [
                        {
                            destinations: [
                                { to: process.env.DEFAULT_PHONE_NUMBER },
                            ],
                            from: process.env.SENDER_NAME,
                            text: doctorMessage,
                        },
                    ],
                });

                const options = {
                    method: "POST",
                    hostname: process.env.INFOBIP_HOST_NAME,
                    path: process.env.INFOBIP_PATH,
                    headers: {
                        Authorization: `App ${process.env.INFOBIP_API_KEY}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                };

                await new Promise<void>((resolve, reject) => {
                    const reqInfobip = https.request(options, (infobipRes) => {
                        let chunks: Uint8Array[] = [];

                        infobipRes.on("data", (chunk) => {
                            chunks.push(chunk);
                        });

                        infobipRes.on("end", () => {
                            const body = Buffer.concat(chunks);
                            console.log(body.toString());
                            resolve(); // Resolve the promise when the request is complete
                        });
                    });

                    reqInfobip.on("error", (error) => {
                        console.error(error);
                        reject(error); // Reject the promise if there's an error
                    });

                    reqInfobip.write(postData);
                    reqInfobip.end();
                });

                // Notify the client
                const clientMessage = `Hello ${
                    appointment.client.name
                }, your appointment is scheduled on ${appointment.date.toLocaleDateString(
                    "en-US"
                )} at ${appointment.time}. Pet: ${
                    appointment.pet.name
                }, Purpose: ${appointment.purpose}, Please be on time.`;

                const clientPostData = JSON.stringify({
                    messages: [
                        {
                            destinations: [{ to: appointment.client.cpNumber }],
                            from: process.env.SENDER_NAME,
                            text: clientMessage,
                        },
                    ],
                });

                const clientOptions = {
                    method: "POST",
                    hostname: process.env.INFOBIP_HOST_NAME,
                    path: process.env.INFOBIP_PATH,
                    headers: {
                        Authorization: `App ${process.env.INFOBIP_API_KEY}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                };

                await new Promise<void>((resolve, reject) => {
                    const clientReqInfobip = https.request(
                        clientOptions,
                        (clientInfobipRes) => {
                            let clientChunks: Uint8Array[] = [];

                            clientInfobipRes.on("data", (clientChunk) => {
                                clientChunks.push(clientChunk);
                            });

                            clientInfobipRes.on("end", () => {
                                const clientBody = Buffer.concat(clientChunks);
                                console.log(clientBody.toString());
                                resolve(); // Resolve the promise when the request is complete
                            });
                        }
                    );

                    clientReqInfobip.on("error", (clientError) => {
                        console.error(clientError);
                        reject(clientError); // Reject the promise if there's an error
                    });

                    clientReqInfobip.write(clientPostData);
                    clientReqInfobip.end();
                });
                appointment.notified = true;
                await appointment.save();
            }
            console.log("Notified doctor and client");
        }
    } catch (error) {
        console.error("Error notifying doctor and client:", error);
    }
};
